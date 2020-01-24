const year = [];
year[0] = {
    name: "J",
    days: 31
};
year[1] = {
    name: "F",
    days: 28
};
year[2] = {
    name: "M",
    days: 31
};
year[3] = {
    name: "A",
    days: 30
};
year[4] = {
    name: "M",
    days: 31
};
year[5] = {
    name: "J",
    days: 30
};
year[6] = {
    name: "J",
    days: 31
};
year[7] = {
    name: "A",
    days: 31
};
year[8] = {
    name: "S",
    days: 30
};
year[9] = {
    name: "O",
    days: 31
};
year[10] = {
    name: "N",
    days: 30
};
year[11] = {
    name: "D",
    days: 31
};

document.addEventListener('DOMContentLoaded', function(){
    const settings = new SettingsManager(false);
    let currentChangingCell = null;
    let dialogClosing = false;
    let dialogOpening = false;

    const buildTable = () => {
        let html = '';
        let max = -1;
        for(let i = 0; i < year.length; i++){
            html += '<div class="column"><div class="row heading">' + year[i].name + '</div>';
            for(let j = 0; j < year[i].days; j++){
                html += '<div class="row" data-level="-1" data-day="' + j + '" data-mouth="' + i + '"><div class="color"></div></div>';
            }
            if(year[i].days > max){
                max = year[i].days;
            }
            html += "</div>";
        }
        let leftCol = '<div class="column days-num"><div class="row"></div>';
        for(let i = 0; i < max; i++){
            leftCol += '<div class="row">' + (i + 1).toString() + '</div>';
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
        document.querySelectorAll(".column:not(.days-num) .row:not(.heading) .color").forEach(element => {
            element.addEventListener("click", colorButtonClick);
        });
    };

    buildTable();
    bindEvents();

    const updateColorLevels = () => {
        for(let i = 0; i < 7; i++){
            const cl = '.color-level-' + i.toString();
            const color = settings.getColor(i);
            document.querySelectorAll(cl).forEach(element => {
                element.style.backgroundColor = color;
            });
        }
    };

    const savePixels = () => {
        let table = [];
        for(let i = 0; i < year.length; i++){
            table[i] = [];
            for(let j = 0; j < year[i].days; j++){
                const month = i;
                const day = j;
                const query = ".row[data-mouth='" + month + "'][data-day='" + day + "']";
                const el = document.querySelector(query);
                let lvl = el.getAttribute("data-level");
                if(lvl === null || lvl === undefined){
                    lvl = -1;
                } else {
                    lvl = parseInt(lvl);
                    if(Number.isNaN(lvl)){
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
        for(let i = 0; i < table.length; i++){
            for(let j = 0; j < table[i].length; j++){
                const month = i;
                const day = j;
                const level = table[i][j];
                //console.log(level);
                const query = ".row[data-mouth='" + month + "'][data-day='" + day + "']";
                const element = document.querySelector(query);
                let color = "#FFF";
                if(level >= 0 && level < 7){
                    color = settings.getColor(level);
                }
                element.querySelector(".color").style.backgroundColor = color;
                element.setAttribute("data-level", level);
            }
        }
    });

    document.querySelector("#selector-dialog #selector-cancel-button").addEventListener('click', function() {
        const dlg = document.getElementById('selector-dialog');
        const opened = dlg.style.display === 'flex';
        if(opened){
            toggleColorSelectorDialog();
        }
    });
    document.querySelectorAll("#selector-dialog .list-item").forEach(element => {
        element.addEventListener('click', e => {
            if(currentChangingCell === null || currentChangingCell === undefined){
                return;
            }
            let target = e.target;
            while(target !== null && target !== undefined && !target.classList.contains("list-item")){
                target = target.parentElement;
            }
            if(target === null || target === undefined || !target.classList.contains("list-item")){
                return;
            }
            let level = target.getAttribute('data-level');
            level = parseInt(level);
            if(Number.isNaN(level)){
                return;
            }
            currentChangingCell.style.backgroundColor = settings.getColor(level);
            currentChangingCell.parentElement.setAttribute('data-level', level);
            toggleColorSelectorDialog();
        });
    });

    const toggleColorSelectorDialog = () => {
        if(dialogClosing || dialogOpening){
            return;
        }
        const dlg = document.getElementById('selector-dialog');
        const opened = dlg.style.display === 'flex';
        dialogClosing = false;
        dialogOpening = false;
        if(!opened){
            dlg.style.display = 'flex';
            dialogOpening = true;
        }
        else {
            dialogClosing = true;
        }
        const time = 200;
        const count = 10;
        const interval = time / count;
        let iteration = 0;
        const changeOpacity = () => {
            let opacity = 1 / count * iteration;
            if(opened){
                opacity = (1 - opacity);
            }
            dlg.style.opacity = opacity;
            iteration++;
            if(iteration < count){
                setTimeout(changeOpacity, interval);
            } else {
                if(opened){
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

    document.getElementById('save-button').addEventListener("click", () => {
        savePixels();
    });
});