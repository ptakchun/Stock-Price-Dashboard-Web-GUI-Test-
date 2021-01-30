# gaw-socket-utils

[![build status](https://circleci.com/gh/GAWMiners/socket-utils.png?circle-token=4fcb5ba5e9b5890601887b202864536529be6b5c)](https://circleci.com/gh/GAWMiners/socket-utils)

very simple utilities to get information from a socket.io (v1.0.0+) connection

## Install

```bash
$ npm install --save socket-utils
```

## Tests

```bash
$ npm test
```

## Coverage

```bash
$ npm run cover
```

## API

### utils.socketInfo()

##### Params

| Name | Type | Description |
| ---- | ---- | ----------- |
| socket | `socket.io.Socket` | A connected socket object |

##### Example

```js
io.on('connection', function(socket) {
  socket.on('info', function() {
    var info = utils.socketInfo(this)
    console.log(info)
    // => {
    // =>   user: { id: 1, name: 'Evan' },
    // =>   address: '127.0.0.1',
    // =>   headers: {
    // =>     connection: 'keep-alive',
    // =>     'user-agent': 'blah blah'
    // =>   }
    // => }
  })
})
```
