const { registerConfigurationEvents } = require('./config/electron');
const { registerYearEvents } = require('./year/electron');
const {
    STATE_UNSET,
    STATE_STRESSED,
    STATE_FRUSTRATED,
    STATE_DEPRESSED,
    STATE_EXHAUSTED,
    STATE_NORMAL,
    STATE_GOOD,
    STATE_AMAZING,
    stateTexts,
} = require('./states');

/**
 * Register the electron-side data events.
 */
function registerDataEvents() {
    registerConfigurationEvents();
    registerYearEvents();
}

module.exports = {
    registerDataEvents,
    STATE_UNSET,
    STATE_STRESSED,
    STATE_FRUSTRATED,
    STATE_DEPRESSED,
    STATE_EXHAUSTED,
    STATE_NORMAL,
    STATE_GOOD,
    STATE_AMAZING,
    stateTexts,
};
