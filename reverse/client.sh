#!/bin/bash
# @TODO absolute path
source "common.sh"

echo "--> Setting local udp -> server tcp routing via: ${client_navdata_fifo} ..."
rm -rf "${client_navdata_fifo}"
mkfifo "${client_navdata_fifo}"
nc -l -u "${client_localhost}" "${client_udp_navdata_port}" < "${client_navdata_fifo}" \
  | nc "${client_localhost}" "${client_tcp_navdata_port}" > "${client_navdata_fifo}"
