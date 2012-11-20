#!/usr/bin/env node
var dgram = require('dgram');
var net = require('net');
var FrameGenerator = require('./lib/frameGenerator');
var FrameParser = require('./lib/frameParser');

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
  this.frameParser = new FrameParser();
  this.udpSockets = {};
}

UdpToTcpProxy.prototype.start = function() {
  this.setupTcpProxyConnection();
  this.frameParser.on('data', this.proxyTcpToUdp.bind(this));
};

UdpToTcpProxy.prototype.setupTcpProxyConnection = function() {
  var self = this;

  console.log('--> Connecting to tcp<->udp proxy on tcp port: %s ...', this.tcpPort);

  this.tcpSocket = net.createConnection(this.tcpPort)
  this.tcpSocket
    .on('data', function(buffer) {
      self.frameParser.write(buffer);
    })
    .on('connect', function() {
      console.log('--> Established tcp<->udp proxy connection');

      self.setupUdpServers();
    });
};

UdpToTcpProxy.prototype.proxyTcpToUdp = function(data) {
  this.udpSockets[data.srcPort].send(
    data.message,
    0,
    data.message.length,
    data.dstPort,
    '127.0.0.1'
  );
};

UdpToTcpProxy.prototype.setupUdpServers = function() {
  var self = this;

  var frameGenerator = new FrameGenerator();
  frameGenerator.pipe(this.tcpSocket);

  this.udpPorts.forEach(function(udpPort) {
    var server = self.udpSockets[udpPort] = dgram.createSocket('udp4');

    server
      .on('message', function(message, rinfo) {
        frameGenerator.write(message, udpPort, rinfo.port);
      })
      .on('listening', function() {
        console.log('--> Listening on udp port: ' + udpPort);
      });

    server.bind(udpPort);
  });
};
