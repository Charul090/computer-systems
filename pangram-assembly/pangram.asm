section .text
global pangram
pangram:
	; rdi: source string
	xor r12,r12
.loop
	movzx r13, Byte [rdi]
	cmp r13, 0
	je .end
	add rdi,1
	cmp r13,'@'
	jl .loop
	bts r12d, r13d
	jmp .loop
.end
	xor rax, rax
	and r12, 0x07fffffe
	cmp r12, 0x07fffffe
	sete al ;sets rax to 1 if prev cmp is equal. al is lower 8bit representation of rax
	ret
	