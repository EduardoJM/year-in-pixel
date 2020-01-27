const { remote, shell } = require('electron');

const aboutPageLoaded = () => {
    document.getElementById('back-button').addEventListener('click', () => {
        const window = remote.getCurrentWindow();
        window.loadFile('app/screens/home.html');
    });
    const links = document.querySelectorAll('a.default-browser');
    if (links !== null && links !== undefined) {
        links.forEach((element) => {
            const a = element;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const link = e.target.href;
                shell.openExternal(link);
            });
        });
    }
};

module.exports = aboutPageLoaded;
