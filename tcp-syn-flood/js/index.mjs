import { assert } from 'node:console';
import * as fs from 'node:fs/promises'

async function getPcapFile() {
  return fs.readFile('../files/synflood.pcap')
}

function parsePcapFileHeader(pcapFileHeaderData) {
  const magicNumber = pcapFileHeaderData.readUintLE(0, 4);
  const majorVersion = pcapFileHeaderData.readUintLE(4, 2);
  const minorVersion = pcapFileHeaderData.readUintLE(6, 2);
  assert(magicNumber === 0xa1b2c3d4);
  console.log(`Pcap Version: ${majorVersion}.${minorVersion}`);
}

/**
 * @param {Buffer} fileData
 * @returns {'init' | 'ack' | undefined}
 */
function parseIpAndTcpPackets (fileData) {
  const ipHeaderLen = ((fileData[4] & 0x0F) << 2) + 4;
  const srcPort = fileData.readIntBE(ipHeaderLen, 2);
  const destPort = fileData.readIntBE(ipHeaderLen + 2, 2);
  const tcpFlags = fileData.readIntBE(ipHeaderLen + 13, 1);
  const setFlag = 0b0000000000010010;

  if (destPort === 80 && ((tcpFlags & setFlag) === 2)) {
    return 'init';
  } else if (srcPort === 80 && ((tcpFlags & setFlag) === 18)) {
    return 'ack';
  }
}

async function main(){
  const fileData = await getPcapFile();
  const fileBytesLen = fileData.length;
  parsePcapFileHeader(fileData.slice(0,24));
  let i = 24;
  const packetTypeCount = { init: 0, ack: 0, total: 0 }
  while(i < fileBytesLen) {
    const perPacketPcapHeader = fileData.slice(i, i + 16);
    const truncLen = perPacketPcapHeader.readUIntLE(8, 4);
    const unTruncLen = perPacketPcapHeader.readUIntLE(12, 4);
    assert(truncLen === unTruncLen);
    i += 16;
    const packeType = parseIpAndTcpPackets(fileData.slice(i, i + truncLen));
    if (packeType === 'init') packetTypeCount['init'] = packetTypeCount.init + 1
    else if (packeType === 'ack') packetTypeCount['ack']++

    packetTypeCount['total']++;
    i += truncLen;
  }
  console.log(`Total Packets: ${packetTypeCount.total}, Syn Initiated: ${packetTypeCount.init}, Syn Acknowledged: ${packetTypeCount.ack}`);
}

main();
