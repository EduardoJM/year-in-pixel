const year = [];
year[0] = {
    name: 'J',
    days: 31,
};
year[1] = {
    name: 'F',
    days: 28,
};
year[2] = {
    name: 'M',
    days: 31,
};
year[3] = {
    name: 'A',
    days: 30,
};
year[4] = {
    name: 'M',
    days: 31,
};
year[5] = {
    name: 'J',
    days: 30,
};
year[6] = {
    name: 'J',
    days: 31,
};
year[7] = {
    name: 'A',
    days: 31,
};
year[8] = {
    name: 'S',
    days: 30,
};
year[9] = {
    name: 'O',
    days: 31,
};
year[10] = {
    name: 'N',
    days: 30,
};
year[11] = {
    name: 'D',
    days: 31,
};

const SettingsManager = require('./../SettingsManager');

const yearPageLoaded = () => {
    const settings = new SettingsManager(false);
    let currentChangingCell = null;
    let dialogClosing = false;
    let dialogOpening = false;

    /**
     * toggle the color selector dialog.
     */
    const toggleColorSelectorDialog = () => {
        if (dialogClosing || dialogOpening) {
            return;
        }
        const dlg = document.getElementById('selector-dialog');
        const opened = dlg.style.display === 'flex';
        dialogClosing = false;
        dialogOpening = false;
        if (!opened) {
            dlg.style.display = 'flex';
            dialogOpening = true;
        } else {
            dialogClosing = true;
        }
        const time = 200;
        const count = 10;
        const interval = time / count;
        let iteration = 0;
        const changeOpacity = () => {
            let opacity = (1 / count) * iteration;
            if (opened) {
                opacity = (1 - opacity);
            }
            dlg.style.opacity = opacity;
            iteration += 1;
            if (iteration < count) {
                setTimeout(changeOpacity, interval);
            } else {
                if (opened) {
                    dlg.style.opacity = 0;
                    dlg.style.display = 'none';
                } else {
                    dlg.style.opacity = 1;
                }
                dialogClosing = false;
                dialogOpening = false;
            }
        };
        setTimeout(changeOpacity, interval);
    };

    /**
     * build the days flex table.
     */
    const buildTable = () => {
        let html = '';
        let max = -1;
        for (let i = 0; i < year.length; i += 1) {
            html += `<div class="column"><div class="row heading">${year[i].name}</div>`;
            for (let j = 0; j < year[i].days; j += 1) {
                html += `<div class="row" data-level="-1" data-day="${j}" data-mouth="${i}"><div class="color"></div></div>`;
            }
            if (year[i].days > max) {
                max = year[i].days;
            }
            html += '</div>';
        }
        let leftCol = '<div class="column days-num"><div class="row"></div>';
        for (let i = 0; i < max; i += 1) {
            const num = (i + 1);
            leftCol += `<div class="row">${num}</div>`;
        }
        leftCol += '</div>';
        document.getElementById('pixels-box').innerHTML = leftCol + html;
    };

    const colorButtonClick = (e) => {
        const el = e.target;
        currentChangingCell = el;
        toggleColorSelectorDialog();
    };

    const bindEvents = () => {
        const selector = '.column:not(.days-num) .row:not(.heading) .color';
        document.querySelectorAll(selector).forEach((element) => {
            element.addEventListener('click', colorButtonClick);
        });
    };

    buildTable();
    bindEvents();

    const updateColorLevels = () => {
        for (let i = 0; i < 7; i += 1) {
            const cl = `.color-level-${i}`;
            const color = settings.getColor(i);
            document.querySelectorAll(cl).forEach((element) => {
                const item = element;
                item.style.backgroundColor = color;
            });
        }
    };

    const savePixels = () => {
        const table = [];
        for (let i = 0; i < year.length; i += 1) {
            table[i] = [];
            for (let j = 0; j < year[i].days; j += 1) {
                const month = i;
                const day = j;
                const query = `.row[data-mouth="${month}"][data-day="${day}"]`;
                const el = document.querySelector(query);
                let lvl = el.getAttribute('data-level');
                if (lvl === null || lvl === undefined) {
                    lvl = -1;
                } else {
                    lvl = parseInt(lvl, 10);
                    if (Number.isNaN(lvl)) {
                        lvl = -1;
                    }
                }
                table[month][day] = lvl;
            }
        }
        settings.saveDatabasePixels(table);
    };

    settings.addEventListener('updateColorLevels', updateColorLevels);
    settings.initialize();
    settings.loadDatabasePixels((table) => {
        for (let i = 0; i < table.length; i += 1) {
            for (let j = 0; j < table[i].length; j += 1) {
                const month = i;
                const day = j;
                const level = table[i][j];
                const query = `.row[data-mouth="${month}"][data-day="${day}"]`;
                const element = document.querySelector(query);
                let color = '#FFF';
                if (level >= 0 && level < 7) {
                    color = settings.getColor(level);
                }
                element.querySelector('.color').style.backgroundColor = color;
                element.setAttribute('data-level', level);
            }
        }
    });

    document.querySelector('#selector-dialog #selector-cancel-button').addEventListener('click', () => {
        const dlg = document.getElementById('selector-dialog');
        const opened = dlg.style.display === 'flex';
        if (opened) {
            toggleColorSelectorDialog();
        }
    });
    document.querySelectorAll('#selector-dialog .list-item').forEach((element) => {
        element.addEventListener('click', (e) => {
            if (currentChangingCell === null || currentChangingCell === undefined) {
                return;
            }
            let { target } = e;
            while (target !== null && target !== undefined && !target.classList.contains('list-item')) {
                target = target.parentElement;
            }
            if (target === null || target === undefined || !target.classList.contains('list-item')) {
                return;
            }
            let level = target.getAttribute('data-level');
            level = parseInt(level, 10);
            if (Number.isNaN(level)) {
                return;
            }
            currentChangingCell.style.backgroundColor = settings.getColor(level);
            currentChangingCell.parentElement.setAttribute('data-level', level);
            toggleColorSelectorDialog();
        });
    });

    document.getElementById('save-button').addEventListener('click', () => {
        savePixels();
    });
};

module.exports = yearPageLoaded;
