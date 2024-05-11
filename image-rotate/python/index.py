import struct
import sys


def get_le_int(be_file_obj):
    output = 0
    for i, byte in enumerate(be_file_obj):
        output |= byte << (8 * i)

    return output


with open('../files/teapot.bmp', 'rb') as f:
    fileObj = f.read()
    # all integer values in bitmap are little indian

    # header offset value starts at/offset at 10th byte and is 4 byte in length
    header_offset = get_le_int(fileObj[10:14])

    # dib header size starts at 14th byte and is 4 byte in length.
    # dib header size value tells which dib header is being used
    dib_header_size = get_le_int(fileObj[14:18])

    # for BITMAPINFOHEADER and later headers width starts at/offsets at 18th byte and is 4 bit long
    # height starts at/offsets at 22nd byte and is 4 bit long
    # both width and byte are signed integers
    width = get_le_int(fileObj[18:22])
    height = get_le_int(fileObj[22:26])
    bytes_per_pixel = get_le_int(fileObj[28:30]) // 8

    rotated_file_obj = fileObj[:header_offset]

    for x in range(width - 1, -1, -1):
        for y in range(height):
            # x,y are x and y index of source bmp pixel array
            # iteration logic is written to give source bmps pixel coordinates for each target pixel starting at 0,0
            # since each pixel is 3 bytes/value of bytes_per_pixel,
            # x * bytes_per_pixel will give its column value in terms of bytes
            # adding y * width * bytes_per_pixel to it to get exact byte location (basically 2D matrix to linear)
            current_index = header_offset + ((x * bytes_per_pixel) + (y * width * bytes_per_pixel))
            rotated_file_obj += fileObj[current_index: current_index + bytes_per_pixel]

    with open('../files/output.bmp', 'wb') as output_file:
        output_file.write(rotated_file_obj)
