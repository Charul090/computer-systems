(() => {
    function conceal (string) {
        const arrayBuffer = new ArrayBuffer(8);
        const dataView = new DataView(arrayBuffer);
        const lsBit = BigInt(51 - (string.length * 8));
        let bits = 0b1111111111111n;
        for(let i = 0; i < string.length;i++) {
            bits <<= 8n;
            bits |= BigInt(string.charCodeAt(i));
        }
        bits <<= BigInt(lsBit);
        const lowBit = bits >> 32n;
        const highBit = bits & 0b11111111111111111111111111111111n
        dataView.setUint32(0, Number(lowBit));
        dataView.setUint32(4, Number(highBit));

        return dataView.getFloat64();
    }

    function extract(nan) {
        const arrayBuffer = new ArrayBuffer(8);
        const dataView = new DataView(arrayBuffer);
        dataView.setFloat64(0, nan);
        let carryBit = dataView.getUint8(1) & 0b111;
        let string = '';
        for(let i = 2;i < 8; i++) {
            let currByte = carryBit << 5;
            const currentIndexByte = dataView.getUint8(i);
            currByte = currByte | (currentIndexByte >> 3);
            carryBit = currentIndexByte & 0b111;
            string += String.fromCharCode(currByte);
        }

        return string;
    }

    const nan = conceal('@');
    console.log(nan, typeof nan, extract(nan));
})();