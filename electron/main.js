const { app, BrowserWindow, globalShortcut} = require('electron');
const config = require('config');
const debug = require('debug');
const io = require('socket.io')(config.get('electron.socket_port'));
const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');

const log = debug('app:main');
const hudUrl = `http://${config.get('vue.host')}:${config.get('vue.port')}`;
const adminUrl = `${hudUrl}/admin?electron=true`;
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

const hudOptions = {
    width: config.get("electron.hud.width"),
    height: config.get("electron.hud.height"),
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
    width: config.get("electron.admin.width"),
    height: config.get("electron.admin.height"),
    frame: false,
    resizable: false,
};

db.defaults({ players: [],  teams: [],
    config: {
        announcements: [],
        announcementsDelay: 8
    }
}).write();

app.on('ready', () => {
    const overlay = new BrowserWindow(hudOptions);
    const admin = new BrowserWindow(adminOptions);
    
    overlay.loadURL(hudUrl);
    overlay.setIgnoreMouseEvents(true);

    admin.loadURL(adminUrl);
    admin.hide();

    if (process.env.NODE_ENV === 'development') {
        globalShortcut.register('Alt+A', () => {
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
        overlay.reload();
    });

    globalShortcut.register('Alt+S', () => {
        overlay.minimize();
    });

    globalShortcut.register('Alt+Q', () => {
        if (overlay.isVisible()) {
            overlay.hide();
        } else {
            overlay.show();
        }
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

        updateConfig();
    });
});

function updateConfig() {
    io.sockets.emit('config', db.get('config').value());
}
