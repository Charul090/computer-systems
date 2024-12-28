section .data
    msg: db "Hello World!",10
    msg_size: equ $ - msg

section .text
    global _main

_main:
    mov rax,1
    mov rdi,1
    mov rsi,msg
    mov rdx,msg_size
    syscall
    mov rdi,0
    mov rax,60
    syscall
