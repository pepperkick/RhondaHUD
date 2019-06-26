const net = require("net");
const debug = require("debug");
const JSON5 = require('json5')
const io = require("socket.io")(2565);
const express = require("express");

const GSI_PIPE_PATH = "\\\\.\\pipe\\tf2-gsi";
const log = debug("app:main");

let info = {}, client;

const app = new express();

app.use("/", express.static("public"));

app.listen(2560)

const server = net.createServer((stream) => {
    stream.on('data', async (data) => {    
        log(data.toString());
        const values = data.toString();
        info = JSON5.parse(values);

        // log(info.event);

        if (client) client.emit("data", info);
    });
});

io.on("connect", _client => {
    client = _client;
});

server.listen(GSI_PIPE_PATH, () => {
    log("GSI Pipe Started!");
});