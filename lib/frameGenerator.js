var util = require('util');
var Stream = require('stream').Stream;

module.exports = FrameGenerator;
util.inherits(FrameGenerator, Stream);
function FrameGenerator() {
  Stream.call(this);

  this.readable = true;
}

FrameGenerator.prototype.write = function(message, dstPort, srcPort) {
  var header = new Buffer(8);
  header.writeUInt32BE(message.length, 0);
  header.writeUInt16BE(dstPort, 4);
  header.writeUInt16BE(srcPort, 6);

  var wrapped = Buffer.concat([header, message]);
  this.emit('data', wrapped);
};
