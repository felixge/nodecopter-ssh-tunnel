#!/usr/bin/env node
var net = require('net');
var tcpPort = parseInt(process.env.CLIENT_UDP_TUNNEL_PORT, 10);

var server = net.createServer(function(socket) {
  console.log('--> New client: ' + socket.remoteAddress);

  socket.on('end', function() {
    console.log('--> Disconnected client: ' + socket.remoteAddress);
  });

});

server.on('listening', function() {
  console.log('--> Established tcp->udp proxy on port: ' + tcpPort);
});

console.log('--> Creating tcp->udp proxy on port: ' + tcpPort + '...');
server.listen(tcpPort);
