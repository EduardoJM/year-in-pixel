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
        { name: 'J', days: 31, states: createMonthStates(31) },
        { name: 'F', days: leap ? 29 : 28, states: createMonthStates(leap ? 29 : 28) },
        { name: 'M', days: 31, states: createMonthStates(31) },
        { name: 'A', days: 30, states: createMonthStates(30) },
        { name: 'M', days: 31, states: createMonthStates(31) },
        { name: 'J', days: 30, states: createMonthStates(30) },
        { name: 'J', days: 31, states: createMonthStates(31) },
        { name: 'A', days: 31, states: createMonthStates(31) },
        { name: 'S', days: 30, states: createMonthStates(30) },
        { name: 'O', days: 31, states: createMonthStates(31) },
        { name: 'N', days: 30, states: createMonthStates(30) },
        { name: 'D', days: 31, states: createMonthStates(31) },
    ];
    return yearData;
}

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
