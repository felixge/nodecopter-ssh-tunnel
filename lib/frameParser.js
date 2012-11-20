var EventEmitter = require('events').EventEmitter;
var util = require('util');

module.exports = FrameParser;
util.inherits(FrameParser, EventEmitter);
function FrameParser() {
  EventEmitter.call(this);

  this.writable = true;
  this.buffer = new Buffer(0);
  this.header = null;
}

FrameParser.prototype.write = function(buffer) {
  this.buffer = Buffer.concat([this.buffer, buffer]);

  while (this.buffer.length) {
    if (!this.header) {
      var headerReceived = (this.buffer.length >= 8);
      if (!headerReceived) {
        return;
      }

      this.header = {
        length: this.buffer.readUInt32BE(0),
        srcPort: this.buffer.readUInt16BE(4),
        dstPort: this.buffer.readUInt16BE(6),
      };

      this.buffer = this.buffer.slice(8);
      this.message = new Buffer(this.header.length);
      continue;
    }

    var messageReceived = (this.buffer.length >= this.header.length);
    if (!messageReceived) {
      return;
    }

    var message = new Buffer(this.header.length);
    this.buffer.copy(message, 0, 0, message.length);

    this.emit('data', {
      message: message,
      srcPort: this.header.srcPort,
      dstPort: this.header.dstPort,
    });

    this.buffer = this.buffer.slice(message.length);
    this.header = null;
  }
};
