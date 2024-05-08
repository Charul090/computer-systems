import { open } from 'node:fs/promises';
import { fileURLToPath } from 'node:url'
import path from 'node:path';

function truncateLine(buffer) {
    let length = buffer[0];
    const stringBuffer = Buffer.from(buffer.subarray(1, buffer.length));
    if (length > stringBuffer.length) {
        console.log(Buffer.from(stringBuffer).toString());
        return;
    }
    while(length >= 0 && ((stringBuffer[length] & 0b11000000) === 0b10000000)){
        length--;
    }
    console.log(Buffer.from(stringBuffer.subarray(0, length)).toString());
}

(async () => {
    const casesFilePath = path.normalize(path.dirname(fileURLToPath(import.meta.url)) + '/../files/cases');
    try {
        var fileHandle = await open(casesFilePath, 'r');
        const fileObj = await fileHandle.readFile();
        let lineBuffer = Buffer.from([]);
        for(const buf of fileObj) {
            if (buf !== 0x0A) {
                lineBuffer = Buffer.concat([lineBuffer, Buffer.from([buf])])
                continue;
            }
            truncateLine(lineBuffer)
            lineBuffer = Buffer.from([]);
        }
    } finally {
        await fileHandle.close();
    }
})()