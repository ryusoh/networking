# Usage: make pull ID=<extension_id>
.PHONY: pull precommit precommit-fix fmt fmt-check lint lint-fix install-dev test test-py tm-repair

tm-repair:
	@./bin/tm-repair

pull:
	@./retriever/pull $(ID)

install-dev:
	@npm install

precommit: fmt-check lint test test-py test-ebpf test-nas

precommit-fix: fmt lint-fix test test-py test-ebpf test-nas

fmt:
	@npm run fmt

fmt-check:
	@npm run fmt:check

lint:
	@npm run lint

lint-fix:
	@npm run lint:fix

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
