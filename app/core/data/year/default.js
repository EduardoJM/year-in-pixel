const { createYear } = require('./creator');

const AppYearsDefault = [
    createYear('Meu Ano', new Date(Date.now()).getFullYear()),
];

module.exports = {
    AppYearsDefault,
};
