document.addEventListener('DOMContentLoaded', () => {
    // eslint-disable-next-line global-require
    const { ipcRenderer } = require('electron');
    const parsed = [];
    const ApplyLinks = () => {
        const links = document.querySelectorAll('.link[to]');
        links.forEach((item) => {
            if (parsed.includes(item)) {
                return;
            }
            parsed.push(item);
            item.addEventListener('click', () => {
                const to = item.getAttribute('to');
                const query = item.getAttribute('query');
                const data = { route: to };
                if (query !== null && query !== undefined) {
                    data.query = JSON.parse(query);
                }
                ipcRenderer.send('navigate-to', data);
            });
        });
    };
    ApplyLinks();
    document.addEventListener('UpdateElectronLink', ApplyLinks);
});
