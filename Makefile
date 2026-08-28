# Usage: make pull ID=<extension_id>
.PHONY: pull precommit precommit-fix precommit-docker fmt fmt-check lint depcheck lint-fix install-dev test test-py type tm-repair sync-check thinking-check bot-pr-check mutate-js mutate-py

tm-repair:
	@./bin/tm-repair

pull:
	@./retriever/pull $(ID)

install-dev:
	@npm install

precommit: fmt-check lint thinking-check bot-pr-check type test test-py test-ebpf test-nas sync-check

precommit-fix: fmt lint-fix thinking-check bot-pr-check type test test-py test-ebpf test-nas sync-check

# Containerized precommit for hosts where privileged tests fail locally (e.g.
# macOS socket permissions). Builds `Dockerfile.precommit` and runs `make precommit`
# inside an Ubuntu container so raw-socket tests behave like CI. Starts Colima
# automatically if the Docker daemon is not reachable.
#
# C binaries are cleaned first inside the container: the bind-mounted repo may
# contain host-architecture artifacts (e.g. macOS ARM64) that `make` would
# otherwise skip rebuilding, causing "Exec format error" when the tests try to
# run them as Linux binaries.
#
# `.claude/commands/` is regenerated before `make precommit` so the sync-check
# gate passes without requiring the host to have write access to that directory.
#
# The anonymous volume at /app/node_modules keeps the image's Linux-built
# dependencies in place: the bind mount would otherwise shadow them with the
# host's node_modules, whose native binaries are macOS-only (e.g.
# @typescript/typescript-darwin-arm64 for `make type`).
PRECOMMIT_DOCKER_IMAGE ?= net-tools-precommit
precommit-docker:
	@if ! docker info >/dev/null 2>&1; then \
		echo "Docker daemon not reachable; starting Colima..."; \
		colima start || { echo "Failed to start Colima. Install with: brew install colima"; exit 1; }; \
	fi
	@echo "Building precommit Docker image..."
	@docker build -t $(PRECOMMIT_DOCKER_IMAGE) -f Dockerfile.precommit .
	@echo "Running precommit in Docker..."
	@docker run --rm -v "$$(pwd)":/app -v /app/node_modules $(PRECOMMIT_DOCKER_IMAGE) \
		sh -c 'make -C nas_tools clean && make -C nas_proxy clean && python3 tools/sync_commands.py && make precommit'

# Stream-of-consciousness gate (AGENTS.md non-negotiable #9): deterministic scan
# of all git-tracked sources (py/js/css/c/h/sh) for thinking-out-loud comments
# and abandoned test bodies. Detector: tools/check_thinking_comments.py
# (tests in tools/__tests__/, run by test-py).
thinking-check:
	@$(PY) tools/check_thinking_comments.py

# Bot PR hygiene gate (AGENTS.md non-negotiable #11): deterministic check that
# every Jules-bot-authored commit in origin/main..HEAD is real — no empty
# commits, no zero-content placeholder files, no deletions in test files (bot
# lanes are append-only in tests; Testpilot owns __tests__/ and tests/).
# Wording alone did not stop the empty Typist PRs (#75, #78) or the anki
# repo's PR #494 churn commits; this fails the gate instead. Human commits are
# skipped. Detector: tools/check_bot_pr_hygiene.py (tests in tools/__tests__/,
# run by test-py). Check-only: precommit-fix runs the same check.
bot-pr-check:
	@$(PY) tools/check_bot_pr_hygiene.py

# .claude/commands/ is generated from .agents/skills/ (the canonical source) by
# tools/sync_commands.py. Fail if regeneration is not a no-op (content hash of
# the tree before vs after), so the generated copy can never silently go stale.
sync-check:
	@before=$$(find .claude/commands -type f | LC_ALL=C sort | xargs shasum | shasum | cut -d' ' -f1); \
	python3 tools/sync_commands.py >/dev/null; \
	after=$$(find .claude/commands -type f | LC_ALL=C sort | xargs shasum | shasum | cut -d' ' -f1); \
	if [ "$$before" = "$$after" ]; then \
		echo "sync-check: .claude/commands is up to date"; \
	else \
		echo "sync-check FAIL: .claude/commands was stale and has been regenerated — commit the updated files (python3 tools/sync_commands.py)."; \
		exit 1; \
	fi

fmt:
	@npm run fmt

fmt-check:
	@npm run fmt:check

lint: depcheck
	@npm run lint
	@# Complexity ratchet: xenon fails if the average/worst cyclomatic-complexity
	@# rank regresses past these ceilings (current: average A, worst block C).
	$(PY) -m xenon --max-average A --max-modules C --max-absolute C nas_proxy retriever vps_kernel_proxy nas_tools bin

lint-fix:
	@npm run lint:fix

# Dependency-structure gate (JS): no circular deps, no cross-subproject
# imports, production source never imports tests. Rules: .dependency-cruiser.cjs
depcheck:
	npx --yes dependency-cruiser adblock gov_bypass jest.setup.js --config .dependency-cruiser.cjs

# Mutation testing (NON-BLOCKING scaffold — deliberately NOT wired into
# precommit or CI gates; informational scores only).
# mutate-js: StrykerJS, incremental, scoped to adblock/picker.js
#   (config: stryker.config.mjs; cache: .stryker-tmp/, reports/).
# mutate-py: mutmut over the three test-py source packages
#   (config: [tool.mutmut] in pyproject.toml; cache: mutants/, .mutmut-cache/).
mutate-js:
	npx stryker run

mutate-py:
	$(PY) -m mutmut run

# JS strict-typing via JSDoc (Typist lane). Blocking: `make type` gates once the
# included first-party JS is clean (see .jules/typist.md).
type:
	@npx tsc -p jsconfig.json --noEmit

test:
	@npm run test:coverage

# Python unit tests + coverage (term-missing), mirroring the Jest coverage report.
# Coverage is scoped to the three importable packages (the source modules);
# nas_tools contributes C-binary integration tests but no Python source to cover.
# bin and tools are collected for their tests only (no coverage scope) — tools
# holds the thinking-check detector's suite.
# nas_tools' privileged tests (ICMP / eth0) self-skip when the host lacks the
# prerequisites — see the skipUnless guards in nas_tools/__tests__/test_tools.py.
# Whole-suite floor: measured 95.5% total; gate fails below 94%.
PY ?= python3
test-py:
	@echo "Building nas_tools binaries (needed by its tests)..."
	@$(MAKE) -C nas_tools all
	@echo "Running Python Tests (pytest + coverage)..."
	@$(PY) -m pytest nas_proxy retriever vps_kernel_proxy nas_tools bin tools \
		-p no:cacheprovider \
		--cov=nas_proxy --cov=retriever --cov=vps_kernel_proxy \
		--cov-report=term-missing \
		--cov-fail-under=94

test-ebpf:
	@echo "Running eBPF Kernel Tests (via Docker)..."
	-@docker run --rm -v $(shell pwd):/app ebpf-builder make -C vps_kernel_proxy test

test-nas:
	@echo "Running C-based NAS Tool Tests..."
	@make -C nas_proxy test

build-nas-tools:
	@echo "Building C-based NAS tools..."
	@make -C nas_proxy all
	@echo "Building NAS Build Accelerators..."
	@gcc -O3 bin/ctx_cleaner.c -o bin/ctx_cleaner
	@gcc -O3 bin/ram_disk_accelerator.c -o bin/ram_disk_accelerator
	@gcc -O3 bin/parallel_pkg_pull.c -o bin/parallel_pkg_pull -lcurl
	@gcc -O3 bin/ccache_manager.c -o bin/ccache_manager
	@gcc -O3 bin/pkg_warrior.c -o bin/pkg_warrior -lcurl
	@gcc -O3 bin/dependency_sideloader.c -o bin/dependency_sideloader -lcurl
	@gcc -O3 bin/fs_overdrive.c -o bin/fs_overdrive
	@gcc -O3 bin/dist_build_client.c -o bin/dist_build_client
