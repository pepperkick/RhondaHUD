const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let url = "http://google.com"

app.on('ready', () => {
    let window = new BrowserWindow({width: 800, height: 600})
    
    window.loadURL(url)
})