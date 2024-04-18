import sys
import re


def convertHexToRGB(hex_string):
    hex_string = hex_string.removeprefix('#')
    if len(hex_string) == 3 or len(hex_string) == 4:
        curr_string = ''
        for i in range(len(hex_string)):
            curr_string += hex_string[i] + hex_string[i]
        hex_string = curr_string
    rgba_string = ''
    for i in range(0, len(hex_string), 2):
        curr_val = int(hex_string[i] + hex_string[i + 1], 16)
        if i == 6:
            rgba_string += '/ ' + str(round(curr_val / 255, 5))
        else:
            space_str = '' if i == len(hex_string) - 2 else ' '
            rgba_string += str(curr_val) + space_str

    rgba_string = 'rgba(' + rgba_string + ')' if len(hex_string) == 8 else 'rgb(' + rgba_string + ')'
    return rgba_string


fileContent = sys.stdin.read()
splitFileContent = re.split(r': |;', fileContent)

for x in range(len(splitFileContent)):
    if splitFileContent[x][0] == '#':
        rgba = convertHexToRGB(splitFileContent[x])
        splitFileContent[x] = ': ' + rgba + ';'

sys.stdout.write(''.join(splitFileContent))

