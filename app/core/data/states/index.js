/**
 * Unseted day state.
 */
const STATE_UNSET = -1;
/**
 * Stressed day state.
 */
const STATE_STRESSED = 0;
/**
 * Frustrated day state.
 */
const STATE_FRUSTRATED = 1;
/**
 * Depressed day state.
 */
const STATE_DEPRESSED = 2;
/**
 * Exhausted day state.
 */
const STATE_EXHAUSTED = 3;
/**
 * Normal day state.
 */
const STATE_NORMAL = 4;
/**
 * Good day state.
 */
const STATE_GOOD = 5;
/**
 * Amazing day state.
 */
const STATE_AMAZING = 6;

/**
 * Day states display texts.
 */
const stateTexts = {
    [STATE_UNSET]: ['Remover Coloração'],
    [STATE_STRESSED]: ['Estresado', 'Dia frenético'],
    [STATE_FRUSTRATED]: ['Frustrado', 'Dia irritante'],
    [STATE_DEPRESSED]: ['Deprimido', 'Dia triste'],
    [STATE_EXHAUSTED]: ['Exausto', 'Dia cansativo'],
    [STATE_NORMAL]: ['Normal', 'Dia comum'],
    [STATE_GOOD]: ['Muito bem', 'Dia feliz'],
    [STATE_AMAZING]: ['Incrível', 'Dia fantástico'],
};

module.exports = {
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
