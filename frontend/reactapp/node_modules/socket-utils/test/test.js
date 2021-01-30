var should = require('should')
  , utils = require('../')

describe('gaw-socket-utils', function() {
  it('should have property `socketInfo`', function() {
    utils.should.have.property('socketInfo')
  })

  describe('socketInfo', function() {
    before(function(done) {
      var app = require('./fixtures/server')
      this.server = app.http
      this.io = app.io
      this.io.on('connection', function(socket) {
        socket.on('info', function() {
          var info = utils.socketInfo(this)
          this.emit('info', info)
        })

        socket.on('blah', function() {
          socket.emit('done')
        })
      })
      this.server.listen(0, done)
    })

    it('should be able to get request info from socket', function(done) {
      var port = this.server.address().port
      var socket = require('socket.io-client')('http://localhost:'+port, {
        referer: 'http://localhost'
      })
      socket.on('connect', function() {
        socket.emit('info')
      })

      socket.on('info', function(info) {
        info.should.be.type('object')
        info.should.have.property('user', null)
        info.should.have.property('address')
        info.should.have.property('headers')
        info.headers.should.be.type('object')
        info.headers.connection.should.equal('close')
        info.headers['user-agent'].should.equal('node-XMLHttpRequest')
        this.disconnect()
      })

      socket.on('disconnect', function() {
        done()
      })
    })
  })
})
