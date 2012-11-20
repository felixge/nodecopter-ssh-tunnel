module.exports = FrameParser;
function FrameParser() {
  this.writable = true;
  this.buffer = new Buffer(0);
  this.header = null;
}

FrameParser.prototype.write = function(buffer) {
  this.buffer = Buffer.concat([this.buffer, buffer]);

  while (this.buffer.length) {
    if (!this.header) {
      var headerReceived = (this.buffer.length >= 6);
      if (!headerReceived) {
        return;
      }

      this.header = {
        length: this.buffer.readUInt32BE(0),
        port: this.buffer.readUInt16BE(4),
      };

      this.buffer = this.buffer.slice(6);
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
      port: this.header.port,
    });

    this.buffer = this.buffer.slice(message.length);
    this.header = null;
  }
};
