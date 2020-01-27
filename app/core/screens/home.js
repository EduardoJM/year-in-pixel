const { remote } = require('electron');

const homePageLoaded = () => {
    document.querySelectorAll('.command').forEach((element) => {
        const item = element;
        item.addEventListener('click', () => {
            const commandAction = item.getAttribute('data-command');
            if (commandAction === undefined || commandAction === null) {
                return;
            }
            if (commandAction === 'file-link') {
                const url = item.getAttribute('data-file');
                if (url === undefined || url === null) {
                    return;
                }
                const window = remote.getCurrentWindow();
                window.loadFile(url);
            } else if (commandAction === 'exit') {
                const window = remote.getCurrentWindow();
                window.close();
            }
        });
    });
};

module.exports = homePageLoaded;
