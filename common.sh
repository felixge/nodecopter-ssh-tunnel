# drone config
drone_ip="192.168.1.1"
drone_telnet_port="23"
drone_navdata_port="5554"
drone_at_port="5556"

# client config
client_tcp_port_offset="1000"
client_navdata_fifo="./navdata_fifo"
client_localhost="127.0.0.1"
client_udp_navdata_port="${drone_navdata_port}"
client_tcp_navdata_port="$(($drone_navdata_port+$client_tcp_port_offset))"
