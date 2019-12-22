const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')

let win
let win_mr_add
let win_mr_data;

app.on('ready', () => 
{
    win = new BrowserWindow({
        show: false,
        width: 500,
        height: 280,
        maximizable: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: 'public/imgs/favicon.ico'
    })

    Menu.setApplicationMenu(null)
    win.loadFile('views/index.html')
    
    win.on('ready-to-show', () => { win.show() })
})

ipcMain.on('module-registration', (event, args) => 
{
    if(args == "window-close")
    {
        win_mr_add.close()
        win_mr_add = null
    }

    if(args == "window-open")
    {
        if(win_mr_add !== null && win_mr_add !== undefined){
            win_mr_add.focus()
            return
        }
    
        win_mr_add = new BrowserWindow({
            show: false,
            minWidth: 340,
            width: 340,
            minHeight: 500,
            height: 700,
            webPreferences: {
                nodeIntegration: true
            },
            parent: win,
            frame: false
        })

        win_mr_add.loadFile('views/member/registration.html')
    
        win_mr_add.on('ready-to-show', ()=>{ win_mr_add.show() })
        win_mr_add.on('closed', () => { win_mr_add = null })   
    }

    if(args == "open-upload-dialog")
    {
        dialog.showOpenDialog(win_mr_add, {
            propeties:['openFile', 'openDirectory'],
            filters: [{ name: 'Images', extensions: ['jpg', 'png', 'gif'] }]
        }).then(result => {
            event.reply('upload-fullpath', result.filePaths)
        }).catch(err => {
            console.error('error: ' + err)
        })
    }
})

ipcMain.on('module-member', (event, args) => 
{
    if(args == "window-close")
    {
        win_mr_data.close()
        win_mr_data = null
    }

    if(args == "window-open")
    {
        if(win_mr_data !== null && win_mr_data !== undefined){
            win_mr_data.focus()
            return
        }
    
        win_mr_data = new BrowserWindow({
            show: false,
            minWidth: 1024,
            width: 1024,
            minHeight: 620,
            height: 620,
            webPreferences: {
                nodeIntegration: true
            },
            parent: win
        })

        win_mr_data.loadFile('views/member/data.html')
    
        win_mr_data.on('ready-to-show', ()=>{ win_mr_data.show() })
        win_mr_data.on('closed', () => { win_mr_data = null })   
    }
})