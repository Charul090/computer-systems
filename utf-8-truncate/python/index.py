import sys


def getBytesForUtf(code_point):
    byte_limits = [[0, 127], [194, 223], [224, 239], [240, 247]]
    for i in range(len(byte_limits)):
        if byte_limits[i][0] <= code_point <= byte_limits[i][1]:
            return i+1

    return 4


def handleTruncate(file_obj):
    for current_line in file_obj:
        length = current_line[0]
        string = current_line[1:]
        x = 0
        while x < len(string):
            curr_byte_len = getBytesForUtf(string[x])
            if length - curr_byte_len >= 0:
                length -= curr_byte_len
                sys.stdout.buffer.write(string[x:x+curr_byte_len])
                x += curr_byte_len
            else:
                sys.stdout.buffer.write(b'\n')
                break
    sys.stdout.buffer.flush()


with open('../files/cases', 'rb') as file_object:
    handleTruncate(file_object)
