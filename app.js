// dependencies
const { app, BrowserWindow } = require('electron');
const xmppClient = require('./lib/js/xmpp-client');

// connect to server
xmppClient.connect();

// bind main window
let win;

function createWindow() {

  win = new BrowserWindow({
    width: 800,
    height: 660
  });

  win.loadFile('lib/view/index.html');

  // open devTools
  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

// create window
app.on('ready', createWindow);

// close window
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// maximize window
app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});