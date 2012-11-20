#!/bin/bash
# exit on error or unbound variable
set -ue

# UPDATE THIS WITH FELIX' LATEST IP
felix_ip="91.64.83.193"

# DO NOT MODIFY ANYTHING BELOW HERE
felix_ssh_user="sydjs"

drone_ip="192.168.1.1"
drone_telnet_port="23"
drone_navdata_port="5554"
drone_at_port="5556"

felix_telnet_port="2023"
felix_navdata_port="${drone_navdata_port}"
felix_at_port="${drone_at_port}"

navdata_fifo="./navdata_fifo"

localhost="127.0.0.1"

echo "--> Killing ssh processes alive from last session ..."
killall ssh || true

echo "--> Killing nc processes alive from last session ..."
killall nc || true

echo "--> Setting up reverse ssh tcp tunnels ..."
# `-f`: Run in background
# `-n`: Prevent reading from stdin (may not be needed)
# `-N`: Do not execute a remote command
# `-T`: Disable pseudo-tty allocation
ssh -fnNT \
  -R "${felix_telnet_port}:${drone_ip}:${drone_telnet_port}" \
  -R "${felix_navdata_port}:${localhost}:${drone_navdata_port}" \
  -R "${felix_at_port}:${localhost}:${drone_at_port}" \
  "${felix_ssh_user}@${felix_ip}"

echo "--> Setting up navdata fifo ..."
rm -rf "${navdata_fifo}"
mkfifo "${navdata_fifo}"
nc -l ${drone_navdata_port} < "${navdata_fifo}" | nc -u ${drone_ip} ${drone_navdata_port} > "${navdata_fifo}"
