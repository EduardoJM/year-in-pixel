const { ipcMain } = require('electron');
const { createYear } = require('./creator');
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
    ipcMain.on('new-year', (event, { title, year }) => {
        const years = loadYears();
        const newYears = [...years, createYear(title, year)];
        saveYears(newYears);
    });
}

module.exports = {
    registerYearEvents,
};
