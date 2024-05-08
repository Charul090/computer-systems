import sys


def handleTruncate(byte, length):
    while length > 0 and (byte[length] & 0b11000000 == 0b10000000):
        length -= 1

    return byte[:length]


# open the file as file object containing data as byte object
with open('../files/cases', 'rb') as file_object:
    for current_line in file_object:
        target_length = current_line[0]
        string = current_line[1:]
        if target_length > len(string):
            sys.stdout.buffer.write(string)
            continue
        sys.stdout.buffer.write(handleTruncate(string, target_length) + b'\n')

