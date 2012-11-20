# exit on error or unbound variable
set -ue

# clean up process group on exit
trap "kill 0" SIGINT SIGTERM EXIT

# drone config
export DRONE_IP="192.168.1.1"
export DRONE_TELNET_PORT="23"
export DRONE_NAVDATA_PORT="5554"
export DRONE_AT_PORT="5556"

# client config
export CLIENT_UDP_PORTS="${DRONE_NAVDATA_PORT},${DRONE_AT_PORT}"
export CLIENT_TELNET_PORT="8023"
export CLIENT_UDP_TUNNEL_PORT="8024"

# server config
export SERVER_LOCALHOST="127.0.0.1"
export SERVER_UDP_TUNNEL_PORT="${CLIENT_UDP_TUNNEL_PORT}"
export server_tcp_port_offset="2000"
#export server_tcp_navdata_port="$(($drone_navdata_port+$server_tcp_port_offset))"


#export client_localhost="127.0.0.1"
#export client_telnet_port="$(($drone_telnet_port+$client_tcp_port_offset))"
#export client_udp_navdata_port="${drone_navdata_port}"
#export client_tcp_navdata_port="$(($drone_navdata_port+$client_tcp_port_offset))"
