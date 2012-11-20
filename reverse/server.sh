#!/bin/bash
# @TODO absolute path
source "common.sh"

client_ssh="${1}"

echo "--> Setting server tcp -> drone udp routing via: ${server_navdata_fifo} ..."
rm -rf "${server_navdata_fifo}"
mkfifo "${server_navdata_fifo}"
nc -l "${server_localhost}" "${server_tcp_navdata_port}" < "${server_navdata_fifo}" \
  | nc -u "${drone_ip}" "${drone_navdata_port}" > "${server_navdata_fifo}" &


echo "--> Setting up reverse ssh tunnel to: ${client_ssh} ..."
# `-v`: Verbose to see when the tunnel has been established
# `-N`: Do not execute a remote command
# `-T`: Disable pseudo-tty allocation
# `-R`: Setup port forwards
ssh -vNT \
  -o "ExitOnForwardFailure=yes" \
  -R "${client_telnet_port}:${drone_ip}:${drone_telnet_port}" \
  -R "${client_tcp_navdata_port}:${server_localhost}:${server_tcp_navdata_port}" \
  "${client_ssh}" \
