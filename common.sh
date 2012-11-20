# exit on error or unbound variable
set -ue

# clean up process group on exit
trap "kill 0" SIGINT SIGTERM EXIT

# drone config
export DRONE_IP="192.168.1.1"
export DRONE_TELNET_PORT="23"
export DRONE_NAVDATA_PORT="5554"
export DRONE_VIDEO_PORT="5555"
export DRONE_AT_PORT="5556"

# client config
export CLIENT_UDP_PORTS="${DRONE_NAVDATA_PORT},${DRONE_AT_PORT}"
export CLIENT_TELNET_PORT="8023"
export CLIENT_VIDEO_PORT="8023"
export CLIENT_UDP_TUNNEL_PORT="${DRONE_VIDEO_PORT}"

# server config
export SERVER_LOCALHOST="127.0.0.1"
export SERVER_UDP_TUNNEL_PORT="${CLIENT_UDP_TUNNEL_PORT}"
