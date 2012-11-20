#!/bin/bash
source "../config.sh"

echo "--> Creating ${client_navdata_fifo} ..."
rm -rf "${client_navdata_fifo}"
mkfifo "${client_navdata_fifo}"

echo "--> Forwarding local navdata udp port: ${client_udp_navdata_port} via local tcp port ${client_tcp_navdata_port} to server ..."
nc -l -u "${client_udp_navdata_port}" < "${client_navdata_fifo}" | nc "${client_localhost}" "${client_tcp_navdata_port}" > "${client_navdata_fifo}"
