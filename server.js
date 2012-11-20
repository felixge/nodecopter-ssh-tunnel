#!/usr/bin/env node
var net = require('net');
var tcpPort = parseInt(process.env.CLIENT_UDP_TUNNEL_PORT, 10);

var clientIds = 0;
var server = net.createServer(function(socket) {
  var clientId = clientIds++;

  console.log('--> New client: ' + clientId);

  socket.on('end', function() {
    console.log('--> Disconnected client: ' + clientId);
  });

});

server.on('listening', function() {
  console.log('--> Established tcp->udp proxy on port: ' + tcpPort);
});

console.log('--> Creating tcp->udp proxy on port: ' + tcpPort + '...');
server.listen(tcpPort);
