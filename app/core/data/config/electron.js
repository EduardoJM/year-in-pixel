const { ipcMain } = require('electron');

const { loadConfig, saveConfig } = require('./io');

/**
 * Register the electron-side configuration events.
 */
function registerConfigurationEvents() {
    ipcMain.on('load-config', (event) => {
        const cfg = loadConfig();
        event.sender.send('config-loaded', cfg);
    });
    ipcMain.on('save-config', (event, object) => {
        saveConfig(object);
        event.sender.send('config-saved');
    });
}

module.exports = {
    registerConfigurationEvents,
};
