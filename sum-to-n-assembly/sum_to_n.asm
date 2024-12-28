section .text
global sum_to_n

sum_to_n:
	xor rax,rax
	mov rax,rdi
	mov rbp,rax
	add rbp,1 
	imul rax,rbp
	shr rax, 1
	ret

