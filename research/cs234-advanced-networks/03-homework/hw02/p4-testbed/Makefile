all: demo

demo:
	p4c-bm2-ss --arch v1model -o demo.json \
		--p4runtime-file mytunnel.p4info --p4runtime-format text \
		p4src/task1.p4

ans:
	p4c-bm2-ss --arch v1model -o demo.json \
		--p4runtime-file mytunnel.p4info --p4runtime-format text \
		p4src/ans.p4
