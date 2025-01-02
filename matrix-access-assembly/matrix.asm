section .text
global index
index:
	; rdi: matrix
	; esi: rows
	; edx: cols
	; ecx: rindex
	; r8d: cindex
	mov r12d, ecx
	imul r12d, edx
	add r12d, r8d
	mov rax, [rdi + r12 * 4]
	ret
