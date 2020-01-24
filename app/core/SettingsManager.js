class SettingsManager {
    constructor(autoinit){
        this.listener = [];
        this.listener["updateColorLevels"] = [];
        this.db = null;
        if(autoinit){
            this.initialize();
        }
    }

    initialize() {
        this.defaults = {
            colors: [
                "#4527a0",
                "#ec407a",
                "#f44336",
                "#f57c00",
                "#ffd740",
                "#00c853",
                "#0277bd"
            ]
        };
        // load sqlite
        if(this.listener.hasOwnProperty("updateColorLevels") && this.listener["updateColorLevels"].length > 0){
            this.listener["updateColorLevels"].forEach(element => {
                element();
            });
        };
    }

    addEventListener(name, event){
        if(!this.listener.hasOwnProperty(name)){
            return;
        }
        this.listener[name].push(event);
    }

    removeEventListener(name, event){
        if(!this.listener.hasOwnProperty(name)){
            return;
        }
        const index = this.listener[name].indexOf(event);
        this.listener[name] = this.listener[name].splice(index, 1);
    }

    getColor(level) {
        if(level < 0){
            throw new Error("invalid color level.");
        }
        if(level > 6){
            throw new Error("invalid color level.");
        }
        let color = this.defaults.colors[level];
        /*if(this.db !== null){
            // parse from db
        }*/
        return color;
    }
}

module.exports = SettingsManager;