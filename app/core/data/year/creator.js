const { STATE_UNSET } = require('../states');

/**
 * Determine if an year is a leap year.
 *
 * @param {number} year - the year to check if is a leap year.
 */
function isLeapYear(year) {
    /*
     * Algorithm taken from: https://en.wikipedia.org/wiki/Leap_year
     */
    if (year % 4 !== 0) {
        return false;
    }
    if (year % 100 !== 0) {
        return true;
    }
    if (year % 400 !== 0) {
        return false;
    }
    return true;
}

/**
 * Create month states for the determinated days count.
 *
 * @param {number} days - the month days count.
 */
function createMonthStates(days) {
    const states = {};
    for (let i = 1; i <= days; i += 1) {
        states[i] = { day: i, state: STATE_UNSET };
    }
    return states;
}

/**
 * Create year data for store a new year.
 *
 * @param {number} year - the year to create data.
 */
function createYearData(year) {
    const leap = isLeapYear(year);
    const yearData = [
        { name: 'january', days: 31, states: createMonthStates(31) },
        { name: 'february', days: leap ? 29 : 28, states: createMonthStates(leap ? 29 : 28) },
        { name: 'march', days: 31, states: createMonthStates(31) },
        { name: 'april', days: 30, states: createMonthStates(30) },
        { name: 'may', days: 31, states: createMonthStates(31) },
        { name: 'june', days: 30, states: createMonthStates(30) },
        { name: 'july', days: 31, states: createMonthStates(31) },
        { name: 'august', days: 31, states: createMonthStates(31) },
        { name: 'september', days: 30, states: createMonthStates(30) },
        { name: 'october', days: 31, states: createMonthStates(31) },
        { name: 'november', days: 30, states: createMonthStates(30) },
        { name: 'december', days: 31, states: createMonthStates(31) },
    ];
    return yearData;
}

/**
 * Create complete year information for a new year.
 * @param {string} text - the display title of the year.
 * @param {number} year - the year to create data.
 */
function createYear(text, year) {
    const data = {
        text,
        year,
        data: createYearData(year),
    };
    return data;
}

module.exports = {
    isLeapYear,
    createYear,
    createYearData,
};
