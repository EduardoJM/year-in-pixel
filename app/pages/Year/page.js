const { ipcRenderer } = require('electron');
const { toggleModal, closeModalIfOpened } = require('../../core/components/Modal');
const { stateTexts } = require('../../core/data');

document.addEventListener('DOMContentLoaded', () => {
    const getCurrentYear = () => {
        const queries = window.location.search.replace('?', '').split('&');
        for (let i = 0; i < queries.length; i += 1) {
            const params = queries[i].split('=');
            if (params[0] === 'index') {
                return parseInt(params[1], 10);
            }
        }
        return Number.NaN;
    };
    const yearIndex = getCurrentYear();
    if (Number.isNaN(yearIndex) || yearIndex < 0) {
        ipcRenderer.send('navigate-to', 'app/pages/Home/index.html');
    }
    let yearListData = null;
    let yearData = null;
    let appConfig = null;
    let currentChangingCell = null;

    const buildModalData = () => {
        const states = Object.keys(stateTexts);
        let html = '';
        for (let i = 0; i < states.length; i += 1) {
            const state = states[i];
            let color = '#FFF';
            if (Object.prototype.hasOwnProperty.call(appConfig.colors, state)) {
                color = appConfig.colors[state];
            }
            const texts = stateTexts[state].join('<br/>');
            html += `<div class="list-item" data-level="${state}">`
                  + `   <div class="list-item-color color-level-${state}" style="background-color: ${color}">`
                  + '   </div>'
                  + '   <div class="list-item-text">'
                  + `       ${texts}`
                  + '   </div>'
                  + '</div>';
        }
        document.querySelector('#selector-dialog .list').innerHTML = html;
    };

    const buildTable = () => {
        const outputs = yearData.data.map((month, index) => {
            const keys = Object.keys(month.states);
            let days = '';
            for (let i = 0; i < keys.length; i += 1) {
                if (Object.prototype.hasOwnProperty.call(month.states, keys[i])) {
                    const day = month.states[keys[i]];
                    let color = '#FFF';
                    if (Object.prototype.hasOwnProperty.call(appConfig.colors, day.state)) {
                        color = appConfig.colors[day.state];
                    }
                    days += '<div class="row">'
                          + `    <div class="color" data-level="${day.state}" data-day="${day.day}" data-month="${index}" style="background-color: ${color}"></div>`
                          + '</div>';
                }
            }
            let { name } = month;
            if (Object.prototype.hasOwnProperty.call(appConfig.months, name)) {
                name = appConfig.months[name];
            }
            const output = `<div class="column"><div class="row heading">${name}</div>`
                         + `    ${days}`
                         + '</div>';
            return { html: output, days: month.days };
        });
        let max = -1;
        let html = '';
        for (let i = 0; i < outputs.length; i += 1) {
            html += outputs[i].html;
            if (outputs[i].days > max) {
                max = outputs[i].days;
            }
        }
        let leftCol = '<div class="column days-num">'
                    + '     <div class="row">'
                    + '     </div>';
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
        toggleModal('selector-dialog', 'flex');
    };

    const bindTableEvents = () => {
        const selector = '.column:not(.days-num) .row:not(.heading) .color';
        document.querySelectorAll(selector).forEach((element) => {
            element.addEventListener('click', colorButtonClick);
        });
    };

    const saveYearData = () => {
        ipcRenderer.send('save-years', yearListData);
    };

    const bindLocalEvents = () => {
        document.querySelector('#selector-dialog #selector-cancel-button').addEventListener('click', () => {
            closeModalIfOpened('selector-dialog', 'flex');
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
                const state = parseInt(target.getAttribute('data-level'), 10);
                const day = parseInt(currentChangingCell.getAttribute('data-day'), 10);
                const month = parseInt(currentChangingCell.getAttribute('data-month'), 10);
                if (Number.isNaN(state) || Number.isNaN(day) || Number.isNaN(month)) {
                    return;
                }
                yearData.data[month].states[day].state = state;
                let color = '#FFF';
                if (Object.prototype.hasOwnProperty.call(appConfig.colors, state)) {
                    color = appConfig.colors[state];
                }
                currentChangingCell.style.backgroundColor = color;
                currentChangingCell.parentElement.setAttribute('data-level', state);
                saveYearData();
                closeModalIfOpened('selector-dialog', 'flex');
            });
        });
    };

    ipcRenderer.on('years-loaded', (event, arg) => {
        if (yearIndex >= arg.length) {
            ipcRenderer.send('navigate-to', 'app/pages/Home/index.html');
            return;
        }
        yearListData = arg;
        yearData = arg[yearIndex];
        buildTable();
        bindTableEvents();
    });
    ipcRenderer.on('config-loaded', (event, cfg) => {
        appConfig = cfg;
        ipcRenderer.send('load-years');
        buildModalData();
        bindLocalEvents();
    });
    ipcRenderer.send('load-config');
});
