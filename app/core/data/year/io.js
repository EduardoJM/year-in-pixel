const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const { AppYearsDefault } = require('./default');

function getYearsFilePath() {
    const dataPath = app.getPath('userData');
    const configPath = path.join(dataPath, 'config');
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath);
    }
    const configFile = path.join(configPath, 'years.json');
    return configFile;
}

function saveYears(config) {
    const cfg = getYearsFilePath();
    const data = JSON.stringify(config);
    fs.writeFileSync(cfg, data);
}

function loadYears() {
    const cfg = getYearsFilePath();
    if (!fs.existsSync(cfg)) {
        saveYears(AppYearsDefault);
        return AppYearsDefault;
    }
    try {
        const rawData = fs.readFileSync(cfg);
        const years = JSON.parse(rawData);
        return years;
    } catch (e) {
        return AppYearsDefault;
    }
}

module.exports = {
    loadYears,
    saveYears,
};
