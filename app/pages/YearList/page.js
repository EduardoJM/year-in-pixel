const { ipcRenderer } = require('electron');
const { toggleModal, closeModalIfOpened } = require('../../core/components/Modal');

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

    document.getElementById('new-year-button').addEventListener('click', () => {
        toggleModal('year-titlte-dialog', 'flex');
    });
    document.getElementById('year-title-cancel-button').addEventListener('click', () => {
        closeModalIfOpened('year-titlte-dialog', 'flex');
    });
    document.getElementById('year-title-add-button').addEventListener('click', () => {
        const title = document.getElementById('title').value;
        let year = parseInt(document.getElementById('year').value, 10);
        if (Number.isNaN(year)) {
            year = new Date(Date.now()).getFullYear();
        }
        ipcRenderer.send('new-year', { title, year });
        closeModalIfOpened('year-titlte-dialog', 'flex');
        ipcRenderer.send('load-years');
    });
});
