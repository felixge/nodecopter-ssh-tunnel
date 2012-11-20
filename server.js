#!/usr/bin/env node
var net = require('net');
var tcpPort = parseInt(process.env.CLIENT_UDP_TUNNEL_PORT, 10);

var clientIds = 0;
var server = net.createServer(function(socket) {
  var clientId = clientIds++;

  console.log('--> Connected client #%s', clientId);

  socket
    .on('data', function(buffer) {
      console.log('--> Client #%s data: %s', clientId, buffer.toString('hex'));
    })
    .on('end', function() {
      console.log('--> Disconnected client #%s', clientId);
    });

});

server.on('listening', function() {
  console.log('--> Established tcp->udp proxy on port: ' + tcpPort);
});

console.log('--> Creating tcp->udp proxy on port: ' + tcpPort + '...');
server.listen(tcpPort);
