const {
    STATE_UNSET,
    STATE_STRESSED,
    STATE_FRUSTRATED,
    STATE_DEPRESSED,
    STATE_EXHAUSTED,
    STATE_NORMAL,
    STATE_GOOD,
    STATE_AMAZING,
} = require('../states');

const AppDefaultConfiguration = {
    colors: {
        [STATE_UNSET]: 'transparent',
        [STATE_STRESSED]: '#4527a0',
        [STATE_FRUSTRATED]: '#ec407a',
        [STATE_DEPRESSED]: '#f44336',
        [STATE_EXHAUSTED]: '#f57c00',
        [STATE_NORMAL]: '#ffd740',
        [STATE_GOOD]: '#00c853',
        [STATE_AMAZING]: '#0277bd',
    },
    months: {
        january: 'J',
        february: 'F',
        march: 'M',
        april: 'A',
        may: 'M',
        june: 'J',
        july: 'J',
        august: 'A',
        september: 'S',
        october: 'O',
        november: 'N',
        december: 'D',
    },
};

module.exports = {
    AppDefaultConfiguration,
};
