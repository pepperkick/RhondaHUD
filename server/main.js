const net = require('net')
const debug = require('debug')
const JSON5 = require('json5')
const config = require('config')
const io = require('socket.io')(config.get('server.socket_port'))

const Store = require('./store.js')()
const Api = require('./api.js')(io)

const GSI_PIPE_PATH = '\\\\.\\pipe\\tf2-gsi'
const log = debug('app:main')

let info = {}

const server = net.createServer((stream) => {
    stream.on('data', async (data) => {    
        // log(data.toString());
        const values = data.toString()
        info = JSON5.parse(values)

        // log(info.event);

        io.sockets.emit('data', info)
    });
});

io.on('connect', async client => {
    const config = await Store.Config.Get()

    client.emit('config', config)

    log('Client connected')
});

server.listen(GSI_PIPE_PATH, () => {
    log('GSI Pipe Started!')
});