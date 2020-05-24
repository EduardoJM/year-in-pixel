const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    shell,
} = require('electron');
const { registerDataEvents } = require('./core/data');

let win;

function createWindow() {
    // Criar uma janela de navegação.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    Menu.setApplicationMenu(null);

    // and load the index.html of the app.
    win.loadFile('app/pages/Home/index.html');

    // Open the DevTools.
    win.webContents.openDevTools();

    // Emitido quando a janela é fechada.
    win.on('closed', () => {
        // Elimina a referência do objeto da janela, geralmente você iria armazenar as janelas
        // em um array, se seu app suporta várias janelas, este é o momento
        // quando você deve excluir o elemento correspondente.
        win = null;
    });
}

registerDataEvents();

ipcMain.on('navigate-to', (event, { route, query }) => {
    if (route === '@exit') {
        app.quit();
        return;
    }
    if (route.startsWith('@external:')) {
        const url = route.replace('@external:', '');
        shell.openExternal(url);
        return;
    }
    if (query !== null && query !== undefined) {
        win.loadFile(route, { query });
        return;
    }
    win.loadFile(route);
});

// Este método será chamado quando o Electron tiver finalizado
// a inicialização e está pronto para criar a janela browser.
// Algumas APIs podem ser usadas somente depois que este evento ocorre.
app.on('ready', createWindow);

// Finaliza quando todas as janelas estiverem fechadas.
app.on('window-all-closed', () => {
    // No macOS é comum para aplicativos e sua barra de menu
    // permaneçam ativo até que o usuário explicitamente encerre com Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});
