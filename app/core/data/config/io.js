const { app } = require('electron');
const fs = require('fs');
const path = require('path');

const { AppDefaultConfiguration } = require('./default');

/**
 * Get the user data path.
 */
function getUserDataPath() {
    return app.getPath('userData');
}

/**
 * Get the user configuration file path.
 */
function getConfigFilePath() {
    const dataPath = getUserDataPath();
    const configPath = path.join(dataPath, 'config');
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath);
    }
    const configFile = path.join(configPath, 'cfg.json');
    return configFile;
}

/**
 * Save user configuration to the file.
 * @param {Object} config - the configurations object.
 */
function saveConfig(config) {
    const cfg = getConfigFilePath();
    const data = JSON.stringify(config);
    fs.writeFileSync(cfg, data);
}

/**
 * Load user configuration from the file.
 */
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
