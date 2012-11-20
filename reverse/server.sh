#!/bin/bash
# @TODO absolute path
source "common.sh"

client_ssh="${1}"

./server.js &

echo "--> Setting up reverse ssh tunnel to: ${client_ssh} ..."
# `-v`: Verbose to see when the tunnel has been established
# `-N`: Do not execute a remote command
# `-T`: Disable pseudo-tty allocation
# `-R`: Setup port forwards
ssh -vNT \
  -o "ExitOnForwardFailure=yes" \
  -R "${CLIENT_TELNET_PORT}:${DRONE_IP}:${DRONE_TELNET_PORT}" \
  -R "${CLIENT_UDP_TUNNEL_PORT}:${SERVER_LOCALHOST}:${SERVER_UDP_TUNNEL_PORT}" \
  "${client_ssh}" \
