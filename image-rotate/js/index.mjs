import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from 'path';

function getBEIntFromLeBuffer (buffer) {
    const length = buffer.length;
    let output = 0;
    for (let i = 0;i < length; i++) {
        output |= (buffer[i] << (i * 8));
    }

    return output;
}

(async () => {
    const currPath = path.dirname(fileURLToPath(import.meta.url));
    const imgPath = path.resolve(currPath, '../files/teapot.bmp');
    const outputPath = path.resolve(currPath, '../files/output.bmp');

    const imgData = await readFile(imgPath);

    const offsetByte = getBEIntFromLeBuffer(imgData.subarray(10,14))
    const width = getBEIntFromLeBuffer(imgData.subarray(18,22))
    const height = getBEIntFromLeBuffer(imgData.subarray(22,26))
    const bytesPerPixel = getBEIntFromLeBuffer(imgData.subarray(28,30)) / 8;

    const headerBuffer = imgData.subarray(0, offsetByte);
    const outputBufferArray = [headerBuffer];

    for(let x = width -1; x >= 0; x--) {
        for (let y = 0; y < height; y++) {
            const byteIndex = offsetByte + (x * bytesPerPixel) + (y * width * bytesPerPixel);
            outputBufferArray.push(imgData.subarray(byteIndex, byteIndex + 3));
        }
    }

    const outputBuffer = Buffer.concat(outputBufferArray);
    await writeFile(outputPath, outputBuffer);
})()