const process = require('node:process');

const hexVals = '0123456789abcdef';
const dec = Array.from(Array(16).keys());
const hexToDecObj = dec.reduce((acc, curr) => {
    acc[hexVals[curr]] = curr;
    return acc;
}, {});

function convertHexToDec (hexString) {
    return Number(hexToDecObj[hexString[0].toLowerCase()]) << 4 | Number(hexToDecObj[hexString[1].toLowerCase()])
}

function normaliseHexString (hexString) {
    if (hexString.length === 3 || hexString.length === 4) {
        return hexString.replaceAll(new RegExp('[0-9aA-fF]', 'g'), (string) => string.repeat(2))
    }
    return hexString
}

function convertHexToRbg (hexString) {
    const hexStringWithoutPrefix = normaliseHexString(hexString.substring(1));
    const rgbArray = [];
    for(let i=0;i<hexStringWithoutPrefix.length;i+=2) {
        const decimalVal = convertHexToDec(hexStringWithoutPrefix[i] + hexStringWithoutPrefix[i+1]);
        if (i === 6) {
            rgbArray.push('/');
            rgbArray.push((decimalVal/255).toFixed(5));
            continue;
        }
        rgbArray.push(decimalVal);
    }

    const rgbPrefix = hexStringWithoutPrefix.length === 8 ? 'rgba' : 'rgb';
    return `${rgbPrefix}(${rgbArray.join(' ')})`;
}

function processFile (string) {
    const regex = new RegExp('#[0-9aA-fF]+', 'g');
    return string.replaceAll(regex, convertHexToRbg);
}

process.stdin.setEncoding('utf-8');
process.stdin.on('data', (chunk) => {
    const output = processFile(chunk);
    process.stdout.write(output)
});
