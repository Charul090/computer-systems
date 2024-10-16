import struct

info = {
    "init": 0,
    "ack": 0
}

def parsePcapHeader(bytes_obj):
    magic_no,major_version,minor_version,_,_,_,llh = struct.unpack('<IHHIIII', bytes_obj)
    assert magic_no == 0xa1b2c3d4
    print(f'Pcap Version: {major_version}.{minor_version}')

def parseIpAndTcpHeader(bytes_obj):
    ip_len = ((bytes_obj[4] & 0x0F) << 2) + 4 # ignoring first 4 bytes of bytes_obj as in these packets first 4 bytes are to be ignored
    src,dst,_,_,tcp_flags = struct.unpack('>HHIIH', bytes_obj[ip_len: ip_len + 14])
    set_flag = 0b0000000000010010
    syn = tcp_flags & set_flag == 2
    ack = tcp_flags & set_flag == 18

    if dst == 80 and syn:
        info["init"] = info["init"] + 1
    elif src == 80 and ack:
        info["ack"] = info["ack"] + 1

def parsePcapPacketHeader(bytes_obj):
    tm_sec,tm_ms,len_data,un_trunc_len_data = struct.unpack('<IIII', bytes_obj[0:16])
    len_packet = len_data + 16
    assert len_data == un_trunc_len_data
    parseIpAndTcpHeader(bytes_obj[16: len_packet])
    return len_packet

with open('../files/synflood.pcap', 'rb') as file_object:
    file_bytes = file_object.read()
    parsePcapHeader(file_bytes[0:24])
    pcapHeaderStartIndex = 24
    packets_count = 0
    while pcapHeaderStartIndex < len(file_bytes):
        pcapHeaderStartIndex = pcapHeaderStartIndex + parsePcapPacketHeader(file_bytes[pcapHeaderStartIndex:])
        packets_count += 1

    print(f'Total Packets: {packets_count}, Syn Initiated: {info["init"]}, Syn Acked: {info["ack"]}')