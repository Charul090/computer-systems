import struct


def conceal(string):
    if len(string) == 0 or len(string) > 6:
        raise Exception('String too long')

    first_byte = b'\xff'
    second_byte = (0xf8 | len(string)).to_bytes(1, 'big')
    string_bytes = string.encode()
    padding_bytes = bytes(6 - len(string)) if len(string) < 6 else b''
    ans = struct.unpack('>d', first_byte + second_byte + string_bytes + padding_bytes)[0]

    return ans


def extract(curr_nan):
    bits = struct.pack('>d', curr_nan)
    string_length = bits[1] & 0b111

    return bits[2: 2 + string_length].decode()


print(extract(conceal('hello!')))
print(extract(conceal('he')))
print(extract(conceal('hello')))
print(extract(conceal('h')))
