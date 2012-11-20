#!/usr/bin/env node
var net = require('net');
var dgram = require('dgram');
var FrameParser = require('./lib/frameParser');

process.nextTick(function main() {
  var server = new UdpTcpProxyServer({
    droneIp: process.env.DRONE_IP,
    tcpPort: parseInt(process.env.CLIENT_UDP_TUNNEL_PORT, 10),
  });
  server.start();
});


function UdpTcpProxyServer(options) {
  this.droneIp = options.droneIp;
  this.tcpPort = options.tcpPort;
  this.clientCounter = 0;
  this.tcpServer = null;
}

UdpTcpProxyServer.prototype.start = function() {
  this.createTcpServer();
};

UdpTcpProxyServer.prototype.createTcpServer = function() {
  var self = this;
  this.tcpServer = net.createServer(function(socket) {
    var client = new TcpClient({
      id: self.clientCounter++,
      socket: socket,
    });

    client.init();
  });

  this.tcpServer.on('listening', function() {
    console.log('--> Established tcp<->udp proxy server on tcp port: %s', self.tcpPort);
  });

  console.log('--> Creating tcp<->udp proxy server on tcp port: %s ...', this.tcpPort);
  this.tcpServer.listen(this.tcpPort);
};

function TcpClient(options) {
  this.id = options.id;
  this.socket = options.socket;
  this.frameParser = new FrameParser();
  this.udpSockets = {};
  this.bytesReceived = 0;
  this.bytesSent = 0;
  this.reportTimer = null;
}

TcpClient.prototype.init = function() {
  this.reportTimer = setInterval(this.report.bind(this), 2000);
  this.frameParser.on('data', this.proxyTcpToUdp.bind(this));
  this.socket
    .on('data', this.handleData.bind(this))
    .on('end', this.handleDisconnect.bind(this));

  console.log('--> New client: #%s', this.id);
};

TcpClient.prototype.handleData = function(buffer) {
  this.bytesReceived += buffer.length;
  this.frameParser.write(buffer);
};

TcpClient.prototype.handleDisconnect = function() {
  console.log('--> Disconnected client: #%s', this.id);
  this.destroy();
};

TcpClient.prototype.report = function() {
  console.log('--> Stats from client #%s: bytes received: %s, bytes sent: %s', this.id, this.bytesReceived, this.bytesSent);
};

TcpClient.prototype.proxyTcpToUdp = function(data) {
  var udpSocket = this.udpSockets[data.port];

  if (!udpSocket) {
    udpSocket = this.udpSockets[data.port] = dgram.createSocket('udp4');
    udpSocket.on('message', this.proxyUdpToTcp.bind(this, data.port));
    udpSocket.bind();
  }

  udpSocket.send(data.message, 0, data.message.length, data.port, this.droneIp);
};

TcpClient.prototype.proxyUdpToTcp = function(port, buffer) {
  console.log('received', buffer);
};

TcpClient.prototype.destroy = function() {
  this.socket.destroy();
  clearInterval(this.reportTimer);
  for (var key in this.udpSockets) {
    var udpSocket = this.udpSockets[key];
    udpSocket.close();
  }
};
