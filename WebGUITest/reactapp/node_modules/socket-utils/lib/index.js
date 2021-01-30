var utils = exports

// get request info for socket
// adapted from express
utils.socketInfo = function(socket) {
  var headers = socket.request.headers || {}
  var o = {
    headers: headers
  , user: socket.user || null
  , address: null
  }
  var ip = getHeader('X-Forwarded-For', headers)
  ip = ip ? ip.split(/ *, */) : []
  var conn = socket.request.connection
  o.address = ip[0] ||
    conn.remoteAddress ||
    conn.localAddress ||
    null
  return o
}

// get http header from headers
// taken from express
function getHeader(name, headers) {
  switch (name = name.toLowerCase()) {
    case 'referer':
    case 'referrer':
      return headers.referrer || headers.referer
    default:
      return headers[name]
  }
}
