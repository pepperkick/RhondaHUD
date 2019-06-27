const { app, BrowserWindow, globalShortcut} = require('electron')
const config = require('config')

const url = `http://${config.get('vue.host')}:${config.get('vue.port')}`

const hudOptions = {
    width: config.get("electron.width"),
    height: config.get("electron.height"),
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

let mouseIgnored = false;

app.on('ready', () => {
    const overlay = new BrowserWindow(hudOptions)
    
    overlay.loadURL(url)
    overlay.setIgnoreMouseEvents(true);

    mouseIgnored = true;

    if (process.env.NODE_ENV === 'development') {
        globalShortcut.register('Alt+A', () => {
            overlay.toggleDevTools();

            if (mouseIgnored)
                overlay.setIgnoreMouseEvents(false);
            else
                overlay.setIgnoreMouseEvents(true);
        });

        globalShortcut.register('Alt+D', () => {
            overlay.reload();
        });
    }

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
})