const { app, BrowserWindow, globalShortcut} = require('electron')
const config = require('config')
const debug = require('debug')
const io = require('socket.io')(config.get('electron.socket_port'))

const log = debug('app:main')
const hudUrl = `http://${config.get('vue.host')}:${config.get('vue.port')}`
const adminUrl = `${hudUrl}/admin?electron=true`

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


let mouseIgnored = false;

app.on('ready', () => {
    const overlay = new BrowserWindow(hudOptions)
    const admin = new BrowserWindow(adminOptions)
    
    overlay.loadURL(hudUrl)
    overlay.setIgnoreMouseEvents(true)

    admin.loadURL(adminUrl)
    admin.hide()

    mouseIgnored = true

    if (process.env.NODE_ENV === 'development') {
        globalShortcut.register('Alt+A', () => {
            overlay.toggleDevTools()

            // if (mouseIgnored)
            //     overlay.setIgnoreMouseEvents(false)
            // else
            //     overlay.setIgnoreMouseEvents(true)
        });

        globalShortcut.register('Alt+W', () => {
            admin.toggleDevTools()
        });
    }

    globalShortcut.register('Alt+R', () => {
        admin.reload()
    })

    globalShortcut.register('Alt+D', () => {
        overlay.reload()
    })

    globalShortcut.register('Alt+S', () => {
        overlay.minimize()
    })

    globalShortcut.register('Alt+Q', () => {
        if (overlay.isVisible()) {
            overlay.hide()
        } else {
            overlay.show()
        }
    })

    globalShortcut.register('Alt+E', () => {
        if (admin.isVisible()) {
            admin.hide()
        } else {
            admin.show()
        }
    })

    io.on('connect', client => {
        log('Client connected')

        client.on('admin-close', () => {
            console.log('Admin Close Event')
            admin.hide()
        })
    })
})
