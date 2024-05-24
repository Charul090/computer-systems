import struct


def conceal(string):
    if len(string) == 0 or len(string) > 6:
        raise Exception('String too long')

    prefix_bytes = 0b0111111111110
    str_byte = string.encode()
    for x in range(len(str_byte)):
        prefix_bytes <<= 8
        prefix_bytes |= str_byte[x]

    for y in range(51 - (len(str_byte) * 8)):
        prefix_bytes <<= 1

    ans = struct.unpack('>d', prefix_bytes.to_bytes(8, byteorder='big'))[0]

    return ans


def extract(curr_nan):
    bits = struct.pack('>d', curr_nan)
    bits_number = int.from_bytes(bits, 'big') >> 3
    ans_string = ''
    for _ in range(6):
        curr_ascii_val = 0b11111111 & bits_number
        bits_number >>= 8
        if curr_ascii_val != 0:
            ans_string = chr(curr_ascii_val) + ans_string

    return ans_string

