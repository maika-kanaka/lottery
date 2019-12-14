const { app, BrowserWindow, Menu } = require('electron')

let win

app.on('ready', () => {
    win = new BrowserWindow({
        show: false,
        width: 500,
        height: 280,
        resizable: false,
        maximizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'public/imgs/favicon.ico'
    })

    Menu.setApplicationMenu(null)
    win.loadFile('views/index.html')
    
    win.on('ready-to-show', () => { win.show() })
})