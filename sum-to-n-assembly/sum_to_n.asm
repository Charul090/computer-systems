section .text
global sum_to_n

sum_to_n:
	xor rax,rax ;make rax 0
	mov rbx,rdi ;copy first argument(rdi) to rbx
	cmp rbx, 0 ;check if rbx is greater than 0
	jg loop_to_n ; execute loop_to_n if it is
	ret ;return if its not
loop_to_n:
	add rax,rbx
	dec rbx
	cmp rbx,0 ;check if rbx is greater than 0
	jg loop_to_n ;if it is jump to loop_to_n to run it again
	ret ;else return rax which is sum of n now
