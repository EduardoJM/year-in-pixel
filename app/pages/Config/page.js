const { ipcRenderer } = require('electron');
const Picker = require('vanilla-picker');
const { toggleModal, closeModalIfOpened } = require('../../core/components/Modal');
const { stateTexts } = require('../../core/data');

document.addEventListener('DOMContentLoaded', () => {
    const colorPickerParent = document.querySelector('#cp-modal-picker');
    const picker = new Picker({
        parent: colorPickerParent,
        color: '#F00',
        popup: false,
    });
    let currentColorProp = null;
    let appConfig = null;

    const buildConfigurationsTable = () => {
        // colors
        let html = '<h3 class="config-title">Configurações de Cores</h3>';
        const states = Object.keys(stateTexts);
        for (let i = 0; i < states.length; i += 1) {
            const state = states[i];
            let color = '#FFF';
            if (Object.prototype.hasOwnProperty.call(appConfig.colors, state)) {
                color = appConfig.colors[state];
            }
            const texts = `Cor ${i + 1}<br/>${stateTexts[state].join('<br/>')}`;
            html += '<div class="config-item">'
                  + '   <div class="config-item-text">'
                  + `       ${texts}`
                  + '   </div>'
                  + '   <div class="config-item-prop">'
                  + `       <div style="background-color: ${color}" data-prop="color-level" data-level="${state}" class="color-square"></div>`
                  + '   </div>'
                  + '</div>';
        }
        html += '<div class="config-item">'
              + '   <div class="config-item-text">'
              + '       Resetar cores'
              + '   </div>'
              + '   <div class="config-item-prop">'
              + '       <a class="config-button" id="reset-color-config">Resetar</a>'
              + '   </div>'
              + '</div>';
        document.getElementById('config-wrapper').innerHTML = html;
    };

    const colorSquareClick = (e) => {
        currentColorProp = e.target;
        const state = parseInt(currentColorProp.getAttribute('data-level'), 10);
        let color = '#FFF';
        if (Object.prototype.hasOwnProperty.call(appConfig.colors, state)) {
            color = appConfig.colors[state];
        }
        picker.setColor(color, true);
        toggleModal('color-picker-modal', 'flex');
    };

    const bindEvents = () => {
        // configuration events
        const query = 'div[data-prop="color-level"]';
        const elements = document.querySelectorAll(query);
        elements.forEach((element) => {
            element.addEventListener('click', colorSquareClick);
        });
        // color picker modal events
        document.querySelector('#color-picker-ok-button').addEventListener('click', () => {
            if (currentColorProp === null || currentColorProp === undefined) {
                return;
            }
            const state = parseInt(currentColorProp.getAttribute('data-level'), 10);
            const color = picker.color.hex.substr(0, 7); // remove the alpha
            currentColorProp.style.backgroundColor = color;
            appConfig.colors[state] = color;
            ipcRenderer.send('save-config', appConfig);
            closeModalIfOpened('color-picker-modal', 'flex');
        });
        document.querySelector('#color-picker-cancel-button').addEventListener('click', () => {
            closeModalIfOpened('color-picker-modal', 'flex');
        });
    };

    ipcRenderer.on('config-loaded', (event, cfg) => {
        appConfig = cfg;
        buildConfigurationsTable();
        bindEvents();
    });
    ipcRenderer.send('load-config');
});
