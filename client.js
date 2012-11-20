#!/usr/bin/env node
var dgram = require('dgram');
var net = require('net');
var tcpPort = parseInt(process.env.CLIENT_UDP_TUNNEL_PORT, 10);

console.log('--> Creating tcp->udp tunnel on port: ' + tcpPort + '...');
var tcpSocket = net.createConnection(tcpPort)
tcpSocket
  .on('connect', function() {
    console.log('--> Established udp->tcp tunnel on tcp port: ' + tcpPort);
  });

return;

process.env.CLIENT_UDP_PORTS
  .split(',')
  .map(function(udpPort) {
    return parseInt(udpPort, 10);
  })
  .forEach(function(udpPort) {
    var server = dgram.createSocket('udp4');

    server
      .on('message', function(buffer) {
        console.log(buffer);
      })
      .on('listening', function() {
        console.log('--> Forwarding messages from udp port: ' + udpPort + ' to tcp port: ' + tcpPort);
      });

    server.bind(udpPort);
  });


return;





server.on('message', function (msg, rinfo) {
  console.log('server got: ' + msg + ' from ' +
    rinfo.address + ':' + rinfo.port);
});

server.on('listening', function () {
  var address = server.address();
  console.log('server listening ' +
      address.address + ':' + address.port);
});

