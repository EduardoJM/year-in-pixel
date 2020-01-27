const { remote } = require('electron');
const Picker = require('vanilla-picker');

const fade = require('../utils/vanillaFade.js');
const SettingsManager = require('../SettingsManager.js');

const configPageLoaded = () => {
    const colorPickerParent = document.querySelector('#cp-modal-picker');
    const picker = new Picker({
        parent: colorPickerParent,
        color: '#F00',
        popup: false,
    });
    let currentColorProp = null;
    // modal show
    const showModal = (query) => {
        const element = document.querySelector(query);
        if (element === null || element === undefined) {
            return;
        }
        fade('in', 300, element);
    };
    // modal-overlay's
    const modals = document.querySelectorAll('.modal-overlay');
    if (modals !== null && modals !== undefined) {
        modals.forEach((element) => {
            const m = element;
            m.addEventListener('click', (e) => {
                if (e.target === m) {
                    fade('out', 300, m);
                }
            });
        });
    }
    // modal-closer
    const closers = document.querySelectorAll('.modal-closer');
    if (closers !== null && closers !== undefined) {
        closers.forEach((element) => {
            const act = element;
            const modal = act.getAttribute('data-modal');
            if (modal === null || modal === undefined) {
                return;
            }
            act.addEventListener('click', () => {
                fade('out', 300, modal);
            });
        });
    }
    // settings
    const settings = new SettingsManager(false);
    const colorSquareClick = (e) => {
        currentColorProp = e.target;
        let level = currentColorProp.getAttribute('data-level');
        level = parseInt(level, 10);
        const color = settings.getColor(level);
        picker.setColor(color, true);
        showModal('#cp-modal');
    };
    settings.addEventListener('updateColorLevels', () => {
        for (let i = 0; i < 7; i += 1) {
            const query = `div[data-prop="color-level"][data-level="${i}"]`;
            const element = document.querySelector(query);
            const color = settings.getColor(i);
            element.style.backgroundColor = color;
        }
    });
    settings.initialize();
    for (let i = 0; i < 7; i += 1) {
        const query = `div[data-prop="color-level"][data-level="${i}"]`;
        const element = document.querySelector(query);
        element.addEventListener('click', colorSquareClick);
    }

    document.querySelector('#cp-modal .modal-ok').addEventListener('click', () => {
        if (currentColorProp === null || currentColorProp === undefined) {
            return;
        }
        let level = currentColorProp.getAttribute('data-level');
        level = parseInt(level, 10);
        const color = picker.color.hex.substr(0, 7); // remove the alpha
        currentColorProp.style.backgroundColor = color;
        settings.saveColorOnDatabase(level, color);
    });

    document.getElementById('back-button').addEventListener('click', () => {
        const window = remote.getCurrentWindow();
        window.loadFile('app/screens/home.html');
    });
    document.getElementById('reset-config').addEventListener('click', () => {
        settings.resetDatabaseUserInfo();
    });
};

module.exports = configPageLoaded;
