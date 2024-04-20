import sys
import re

hex_to_decimal_dict = dict(zip('0123456789abcdef', range(16)))


def getNormalisedHexString(hex_string):
    if len(hex_string) == 3 or len(hex_string) == 4:
        curr_string = ''
        for i in range(len(hex_string)):
            curr_string += hex_string[i] + hex_string[i]
        hex_string = curr_string

    return hex_string


def getHexToDecimal(hex_string):
    return hex_to_decimal_dict[hex_string[0].lower()] << 4 | hex_to_decimal_dict[hex_string[1].lower()]


def convertHexToRGB(match_obj):
    hex_string = getNormalisedHexString(match_obj[0].removeprefix('#'))
    rgba_string = ''

    rgba_list = []
    for i in range(0, len(hex_string), 2):
        curr_val = getHexToDecimal(hex_string[i]+hex_string[i+1])
        if i == 6:
            rgba_list.append('/')
            rgba_list.append(str(round(curr_val / 255, 5)))
        else:
            rgba_list.append(str(curr_val))

    rgba_prefix_string = 'rgba' if len(hex_string) == 8 else 'rgb'
    rgba_string = f'{rgba_prefix_string}({" ".join(rgba_list)})'

    return rgba_string


sys.stdout.write(re.sub(r'#[0-9aA-fF]+', convertHexToRGB, sys.stdin.read()))

