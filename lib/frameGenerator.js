var util = require('util');
var Stream = require('stream').Stream;

module.exports = FrameGenerator;
util.inherits(FrameGenerator, Stream);
function FrameGenerator() {
  Stream.call(this);

  this.readable = true;
}

FrameGenerator.prototype.write = function(message, port) {
  var header = new Buffer(6);
  header.writeUInt32BE(message.length, 0);
  header.writeUInt16BE(port, 4);

  var wrapped = Buffer.concat([header, message]);
  this.emit('data', wrapped);
};
