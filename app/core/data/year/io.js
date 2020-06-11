const { app } = require('electron');
const path = require('path');
const fs = require('fs');

const { AppYearsDefault } = require('./default');

/**
 * Get the years storage file path.
 */
function getYearsFilePath() {
    const dataPath = app.getPath('userData');
    const configPath = path.join(dataPath, 'config');
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath);
    }
    const configFile = path.join(configPath, 'years.json');
    return configFile;
}

/**
 * Save the years configuration to the file.
 * @param {Object} config - The years configuration object.
 */
function saveYears(config) {
    const cfg = getYearsFilePath();
    const data = JSON.stringify(config);
    fs.writeFileSync(cfg, data);
}

/**
 * Load the years configuration from the file.
 */
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
