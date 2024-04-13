import struct


def encode(value):
    output = []
    while value > 0:
        curr_seven_bits = value & 0b01111111

        value >>= 7
        if value > 0:
            curr_seven_bits |= 0b10000000
        output.append(curr_seven_bits)

    return bytes(output)


def decode(value):
    value_int = int.from_bytes(value, byteorder='big')
    output = 0
    while value_int > 0:
        output <<= 7
        curr_seven_bits = value_int & 0b01111111
        value_int >>= 8
        output |= curr_seven_bits
    return output


for i in range(1, 31):
    n = 1 << i
    assert decode(encode(n)) == n

cases = (
    ('1.uint64', b'\x01'),
    ('150.uint64', b'\x96\x01'),
    ('maxint.uint64', b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\x01'),
)

for file_name, expectation in cases:
    with open('../files/' + file_name, 'rb') as f:
        data = struct.unpack('>Q', f.read())[0]
        assert encode(data) == expectation
        assert decode(encode(data)) == data

print('All tests passed!')