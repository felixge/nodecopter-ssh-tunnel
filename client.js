#!/usr/bin/env node
var dgram = require('dgram');
var net = require('net');

process.nextTick(function main() {
  var proxy = new UdpToTcpProxy({
    tcpPort: parseInt(process.env.CLIENT_UDP_TUNNEL_PORT, 10),
    udpPorts: process.env.CLIENT_UDP_PORTS
      .split(',')
      .map(function(udpPort) {
        return parseInt(udpPort, 10);
      })
  ,
  });

  proxy.start();
});

function UdpToTcpProxy(options) {
  this.tcpSocket = null;
  this.tcpPort = options.tcpPort;
  this.udpPorts = options.udpPorts;
}

UdpToTcpProxy.prototype.start = function() {
  this.setupTcpProxyConnection();
};

UdpToTcpProxy.prototype.setupTcpProxyConnection = function() {
  var self = this;

  console.log('--> Connecting to tcp<->udp proxy on tcp port: %s ...', this.tcpPort);

  this.tcpSocket = net.createConnection(this.tcpPort)
  this.tcpSocket
    .on('connect', function() {
      console.log('--> Established tcp<->udp proxy connection');

      self.setupUdpServers();
    });
};

UdpToTcpProxy.prototype.setupUdpServers = function() {
  var self = this;
  this.udpPorts.forEach(function(udpPort) {
    var server = dgram.createSocket('udp4');

    server
      .on('message', function(message) {
        var header = new Buffer(4);
        header.writeUInt32BE(message.length, 0);
        var buffer = Buffer.concat([header, message]);

        self.tcpSocket.write(buffer);
      })
      .on('listening', function() {
        console.log('--> Listening on udp port: ' + udpPort);
      });

    server.bind(udpPort);
  });
};
