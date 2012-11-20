# exit on error or unbound variable
set -ue

# clean up process group on exit
trap "kill 0" SIGINT SIGTERM EXIT

# common config
export ssh_control_socket="./ssh_control.socket"

# drone config
export drone_ip="192.168.1.1"
export drone_telnet_port="23"
export drone_navdata_port="5554"
export drone_at_port="5556"

# server config
export server_tcp_port_offset="2000"
export server_localhost="127.0.0.1"
export server_navdata_fifo="./server_navdata.fifo"
export server_tcp_navdata_port="$(($drone_navdata_port+$server_tcp_port_offset))"

# client config
export client_tcp_port_offset="2000"
export client_navdata_fifo="./client_navdata.fifo"
export client_telnet_port="$(($drone_telnet_port+$client_tcp_port_offset))"
export client_udp_navdata_port="${drone_navdata_port}"
export client_tcp_navdata_port="$(($drone_navdata_port+$client_tcp_port_offset))"
