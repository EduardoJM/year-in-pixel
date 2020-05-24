const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.link[to]');
    links.forEach((item) => {
        item.addEventListener('click', () => {
            const to = item.getAttribute('to');
            ipcRenderer.send('navigate-to', { route: to });
        });
    });
});
