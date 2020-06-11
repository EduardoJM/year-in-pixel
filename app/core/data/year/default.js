const { createYear } = require('./creator');

/**
 * App years default configuration.
 */
const AppYearsDefault = [
    createYear('Meu Ano', new Date(Date.now()).getFullYear()),
];

module.exports = {
    AppYearsDefault,
};
