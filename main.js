const {app, ipcMain, BrowserWindow, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev')
let mainWindow;

app.on('ready', () => {

    Menu.setApplicationMenu(null);

    mainWindow = new BrowserWindow({
        width: 1180,
        height: 800,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
        }
    })
    const urlLocation = isDev ? 'http://localhost:3000' : path.join(__dirname, "./build/index.html");

    mainWindow.loadURL(urlLocation)
    // mainWindow.webContents.openDevTools();
    
})
ipcMain.on('download', (event, args) => { 
    //会触发will-download事件 win.webContents.downloadURL(args)
    mainWindow.webContents.downloadURL(args);
}) 