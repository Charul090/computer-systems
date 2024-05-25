(() => {
    function conceal (string) {
        const arrayBuffer = new ArrayBuffer(8);
        const dataView = new DataView(arrayBuffer);
        dataView.setUint8(0, 0xff); // set first byte
        dataView.setUint8(1, 0xf8 | string.length); // set second byte 
        for(let i = 0; i < string.length;i++) {
            dataView.setUint8(i+2, string.charCodeAt(i));
        }

        return dataView.getFloat64();
    }

    function extract(nan) {
        const arrayBuffer = new ArrayBuffer(8);
        const dataView = new DataView(arrayBuffer);
        dataView.setFloat64(0, nan);
        let stringLength = dataView.getUint8(1) & 0b111;
        let string = '';
        for(let i = 2;i < stringLength + 2; i++) {
            const currentIndexByte = dataView.getUint8(i);
            string += String.fromCharCode(currentIndexByte);
        }

        return string;
    }

    const nan = conceal('@#$hel');
    console.log(nan, typeof nan, extract(nan));
})();