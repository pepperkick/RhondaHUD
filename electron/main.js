const { app, BrowserWindow, globalShortcut} = require('electron');
const debug = require('debug');
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const history = require('connect-history-api-fallback');
const Express = require('express');

app.disableHardwareAcceleration();

const log = debug('app:main');
const adapter = new FileSync('db.json');
const db = lowdb(adapter);
const express = new Express();

let PORT = process.env.PORT || 5500;
let SOCKET_PORT = process.env.SOCKET_PORT || 5530;
let hudUrl = `http://localhost:${PORT}`;
let adminUrl = `${hudUrl}/admin?electron=true`;

if (process.env.NODE_ENV === 'development') {
    const config = require('config');
    hudUrl = `http://${config.get('vue.host')}:${config.get('vue.port')}`;
    adminUrl = `${hudUrl}/admin?electron=true`;
    PORT = config.get('electron.port');
    SOCKET_PORT = config.get('electron.socket_port');
}

let io = require('socket.io')(SOCKET_PORT);

const hudOptions = {
    width: process.env.HUD_WIDTH || 1920,
    height: process.env.HUD_HEIGHT || 1080,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    center: true,
    resizable: false,
    movable: false,
    acceptFirstMouse: false,
    maximizable: true,
    minimizable: false,
    webPreferences: {
        webSecurity: false
    }
};

const adminOptions = {
    width: process.env.ADMIN_WIDTH || 1280,
    height: process.env.ADMIN_HEIGHT || 960,
    frame: false,
    resizable: false,
};

db.defaults({ players: {},  teams: {},
    config: {
        announcements: [],
        announcementsDelay: 8,
        experimental: {}
    }
}).write();

app.on('ready', () => {
    const overlay = new BrowserWindow(hudOptions);
    const admin = new BrowserWindow(adminOptions);
    
    overlay.loadURL(hudUrl);
    overlay.setIgnoreMouseEvents(true);

    admin.loadURL(adminUrl);
    admin.hide();

    overlay.on('closed', () => {
        if (process.env.NODE_ENV !== 'development') {
            app.exit();
        }
    });

    if (process.env.NODE_ENV === 'development') {
        globalShortcut.register('Alt+A', () => {
            if (!overlay) return;
            overlay.toggleDevTools();
        });

        globalShortcut.register('Alt+W', () => {
            admin.toggleDevTools();
        });
    }

    globalShortcut.register('Alt+R', () => {
        admin.reload();
    });

    globalShortcut.register('Alt+D', () => {
        if (!overlay) return;
        overlay.reload();
    });

    globalShortcut.register('Alt+S', () => {
        if (!overlay) return;
        overlay.minimize();
    });

    globalShortcut.register('Alt+Q', () => {
        if (!overlay) return;

        if (overlay.isVisible()) {
            overlay.hide();
        } else {
            overlay.show();
        }
    });

    globalShortcut.register('Alt+Z', () => {
        overlay.close()
    });

    globalShortcut.register('Alt+E', () => {
        if (admin.isVisible()) {
            admin.hide();
        } else {
            admin.show();
        }
    });

    io.on('connect', client => {
        log('Client connected');

        client.on('admin-close', () => {
            admin.hide()
        });

        client.on('set-config', (key, value) => {
            db.set(`config.${key}`, value).write();
            updateConfig();
        });

        client.on('get-config', () => {
            updateConfig();
        });

        client.on('set-player', (key, value) => {
            db.set(`players.${key}`, value).write();
            updatePlayer(key);
            updatePlayers();
        });

        client.on('remove-player', (key) => {
            db.unset(`players.${key}`).write();
            updatePlayers();
        });

        client.on('get-player', (id) => {
            updatePlayer(id);
        });

        client.on('get-players', () => {
            updatePlayers();
        });

        updateConfig();
        updatePlayers();
    });

    express.use(history());
    express.use('/', Express.static(`${__dirname}/../dist/webhud`));
    express.listen(PORT);
});

function updateConfig() {
    io.sockets.emit('config', db.get('config').value());
}

function updatePlayer(id) {
    io.sockets.emit(`player.${id}`, db.get(`players.${id}`).value());
}

function updatePlayers() {
    io.sockets.emit(`players`, db.get(`players`).value());
}
