const STATE_UNSET = -1;
const STATE_STRESSED = 0;
const STATE_FRUSTRATED = 1;
const STATE_DEPRESSED = 2;
const STATE_EXHAUSTED = 3;
const STATE_NORMAL = 4;
const STATE_GOOD = 5;
const STATE_AMAZING = 6;

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
