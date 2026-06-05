# Usage: make pull ID=<extension_id>
.PHONY: pull precommit precommit-fix fmt fmt-check lint lint-fix install-dev test tm-repair

tm-repair:
	@./bin/tm-repair

pull:
	@./retriever/pull $(ID)

install-dev:
	@npm install

precommit: fmt-check lint test test-ebpf test-nas

precommit-fix: fmt lint-fix test test-ebpf test-nas

fmt:
	@npm run fmt

fmt-check:
	@npm run fmt:check

lint:
	@npm run lint

lint-fix:
	@npm run lint:fix

test:
	@npm test

test-ebpf:
	@echo "Running eBPF Kernel Tests (via python)..."
	-@python3 -m unittest discover -s vps_kernel_proxy -p "test_*.py"

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

coverage:
	@npm run coverage
	@coverage run -m unittest discover -s retriever -p "test_*.py" || true
	@coverage run -a -m unittest discover -s vps_kernel_proxy -p "test_*.py" || true
	@coverage report -m
