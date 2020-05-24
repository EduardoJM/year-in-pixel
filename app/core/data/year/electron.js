const { ipcMain } = require('electron');

const { loadYears, saveYears } = require('./io');

function registerYearEvents() {
    ipcMain.on('load-years', (event) => {
        const cfg = loadYears();
        event.sender.send('years-loaded', cfg);
    });
    ipcMain.on('save-years', (event, object) => {
        saveYears(object);
        event.sender.send('years-saved');
    });
}

module.exports = {
    registerYearEvents,
};
