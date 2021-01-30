var http = require('http')
  , io = require('socket.io')

var server = http.Server()

module.exports = {
  http: server
, io: io(server)
}
