section .text
global pangram
pangram:
	; rdi: source string
	mov r12, 0 ;r12 will be used as index to traverse source string
	xor r13, r13
	xor r14, r14
	xor r15, r15
check_pangram:
	movzx r13, byte [rdi + r12]
	cmp r13, 0
	je check_value
	cmp r13, 65
	js inc_index
	and r13,0x1f
	mov cl, r13b
	mov r14, 1
	shl r14,cl
	or r15,r14
inc_index:
	inc r12
	jmp check_pangram
check_value:
	and r15, 0x07fffffe
	cmp r15, 0x07fffffe
	mov rax, r15
	je ret_one
	mov rax, 0
	ret
ret_one:
	mov rax, 1
	ret
