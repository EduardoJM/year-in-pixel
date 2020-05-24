const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    let yearListData = null;

    const buildYearList = () => {
        let html = '';
        for (let i = 0; i < yearListData.length; i += 1) {
            html += `<div class="year link" to="app/pages/Year/index.html" query='{ "index": ${i} }'>`
                  + `   <span>${yearListData[i].year}</span> ${yearListData[i].text}`
                  + '</div>';
        }
        document.getElementById('years-list').innerHTML = html;
        document.dispatchEvent(new CustomEvent('UpdateElectronLink'));
    };

    ipcRenderer.on('years-loaded', (event, arg) => {
        yearListData = arg;
        buildYearList();
    });
    ipcRenderer.send('load-years');
});
