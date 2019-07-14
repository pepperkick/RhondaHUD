const net = require('net')
const debug = require('debug')
const JSON5 = require('json5')
const config = require('config')
const io = require('socket.io')(config.get('server.socket_port'))

const Store = require('./store.js')()
const Api = require('./api.js')(io)

const log = debug('app:main')

let info = {}


io.on('connect', async client => {
    const config = await Store.Config.Get()

    client.emit('config', config)

    log('Client connected')
});
