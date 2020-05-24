const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const { AppDefaultConfiguration } = require('./default');

function getUserDataPath() {
    return app.getPath('userData');
}

function getConfigFilePath() {
    const dataPath = getUserDataPath();
    const configPath = path.join(dataPath, 'config');
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath);
    }
    const configFile = path.join(configPath, 'cfg.json');
    return configFile;
}

function saveConfig(config) {
    const cfg = getConfigFilePath();
    const data = JSON.stringify(config);
    fs.writeFileSync(cfg, data);
}

function loadConfig() {
    const cfg = getConfigFilePath();
    if (!fs.existsSync(cfg)) {
        saveConfig(AppDefaultConfiguration);
        return AppDefaultConfiguration;
    }
    try {
        const rawData = fs.readFileSync(cfg);
        const config = JSON.parse(rawData);
        return config;
    } catch (e) {
        return AppDefaultConfiguration;
    }
}

module.exports = {
    loadConfig,
    saveConfig,
};
