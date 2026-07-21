# Usage: make pull ID=<extension_id>
.PHONY: pull precommit precommit-fix precommit-docker fmt fmt-check lint lint-fix install-dev test test-py type tm-repair sync-check

tm-repair:
	@./bin/tm-repair

pull:
	@./retriever/pull $(ID)

install-dev:
	@npm install

precommit: fmt-check lint type test test-py test-ebpf test-nas sync-check

precommit-fix: fmt lint-fix type test test-py test-ebpf test-nas sync-check

# Containerized precommit for hosts where privileged tests fail locally (e.g.
# macOS socket permissions). Builds `Dockerfile.precommit` and runs `make precommit`
# inside an Ubuntu container so raw-socket tests behave like CI. Starts Colima
# automatically if the Docker daemon is not reachable.
PRECOMMIT_DOCKER_IMAGE ?= net-tools-precommit
precommit-docker:
	@if ! docker info >/dev/null 2>&1; then \
		echo "Docker daemon not reachable; starting Colima..."; \
		colima start || { echo "Failed to start Colima. Install with: brew install colima"; exit 1; }; \
	fi
	@echo "Building precommit Docker image..."
	@docker build -t $(PRECOMMIT_DOCKER_IMAGE) -f Dockerfile.precommit .
	@echo "Running precommit in Docker..."
	@docker run --rm -v "$$(pwd)":/app $(PRECOMMIT_DOCKER_IMAGE) make precommit

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

lint:
	@npm run lint

lint-fix:
	@npm run lint:fix

# JS strict-typing via JSDoc (Typist lane). Blocking: `make type` gates once the
# included first-party JS is clean (see .jules/typist.md).
type:
	@npx tsc -p jsconfig.json --noEmit

test:
	@npm run test:coverage

# Python unit tests + coverage (term-missing), mirroring the Jest coverage report.
# Coverage is scoped to the three importable packages (the source modules);
# nas_tools contributes C-binary integration tests but no Python source to cover.
# nas_tools' privileged tests (ICMP / eth0) self-skip when the host lacks the
# prerequisites — see the skipUnless guards in nas_tools/__tests__/test_tools.py.
PY ?= python3
test-py:
	@echo "Building nas_tools binaries (needed by its tests)..."
	@$(MAKE) -C nas_tools all
	@echo "Running Python Tests (pytest + coverage)..."
	@$(PY) -m pytest nas_proxy retriever vps_kernel_proxy nas_tools bin \
		-p no:cacheprovider \
		--cov=nas_proxy --cov=retriever --cov=vps_kernel_proxy \
		--cov-report=term-missing

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
