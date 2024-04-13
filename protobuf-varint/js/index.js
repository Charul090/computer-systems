const fs = require('fs');

function readFile (fileName) {
    const fileData = fs.readFileSync('../files/' + fileName + '.uint64');
    return fileData.readBigUInt64BE();
}

function getEncodedVal (value) {
    let output = '0b';
    while (value > 0) {
        let currBits = value & 127n;
        value >>= 7n;
        if (value > 0) {
            currBits |= 128n;
        }
        output += currBits.toString(2).padStart(8, '0');
    }

    return BigInt(output).toString(16);
}

function getDecodedVal (encodedVal) {
    let number = BigInt('0x' + encodedVal);
    let result = 0n;
    while (number > 0n) {
        result <<= 7n;
        const currentNumber = number & 127n;
        number >>= 8n;
        result |= currentNumber;
    }
    
    return result;
}

function testAgainstVal (currVal) {
    const encodedVal = getEncodedVal(currVal);
    const decodedVal = getDecodedVal(encodedVal);
    if (decodedVal === currVal) {
        console.log('Pass ==> ', currVal, encodedVal, decodedVal);
        return true;
    }
    console.log('Fail ===>', currVal, encodedVal, decodedVal);
    return false;
}

let i = 0;
while (i <= 30) {
    const currVal = BigInt(1 << i);
    const testSuccess = testAgainstVal(currVal);
    if (testSuccess) {
        i++;
    } else {
        break;
    }
}
testAgainstVal(readFile('1'));
testAgainstVal(readFile('150'));
testAgainstVal(readFile('maxint'));