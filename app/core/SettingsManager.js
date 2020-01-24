const remote = require('electron').remote;
const app = remote.app;
const fs = require("fs");
const sqlite3 = require('sqlite3').verbose();
const path = require("path");

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
        this.colors = null;
        // load sqlite
        const dataPath = app.getPath('userData');
        if (fs.existsSync(dataPath)) {
            const dbpath = path.join(dataPath, 'user.db');
            this.db = new sqlite3.Database(dbpath, err => {
                if(err){
                    console.error(err);
                    this.db = null;
                }
                this.db.run('PRAGMA synchronous=OFF');
                this.db.run('PRAGMA count_changes=OFF');
                this.db.run('PRAGMA journal_mode=MEMORY');
                this.db.run('PRAGMA temp_store=MEMORY');
                this.loadDatabaseUserInfo();
            });
        }
        // raise event listener to update color levels
        this.executeListener("updateColorLevels");
    }

    executeListener(name){
        if(this.listener.hasOwnProperty(name) && this.listener[name].length > 0){
            this.listener[name].forEach(element => {
                element();
            });
        };
    }

    loadDatabaseUserInfo(){
        if(this.db === null || this.db === undefined){
            return;
        }
        const query = "SELECT * FROM colors";
        this.db.all(query, (err, rows) => {
            if(err){
                console.error(err);
                return;
            }
            this.colors = [];
            for(let i = 0; i < rows.length; i++){
                this.colors[rows[i].id] = rows[i].color;
            }
            this.executeListener("updateColorLevels");
        });
    }

    saveDatabaseUserInfo(){
        if(this.db === null || this.db === undefined){
            return;
        }
        const query = "CREATE TABLE IF NOT EXISTS colors (id INT PRIMARY KEY, color CHAR[100])";
        this.db.run(query, (err) => {
            if(err){
                console.error(err);
                return;
            }
            if(this.colors === null || this.colors === undefined){
                this.colors = this.defaults.colors;
            }
            const stmt = this.db.prepare("INSERT OR REPLACE INTO colors VALUES (?, ?)");
            for(let i = 0; i < this.colors.length; i++){
                stmt.run(i, this.colors[i]);
            }
        });
    }

    loadDatabasePixels(callback) {
        if(this.db === null || this.db === undefined){
            return;
        }
        const query = "SELECT * FROM pixels";
        this.db.all(query, (err, rows) => {
            if(err){
                console.error(err);
                return;
            }
            console.log(rows.length);
            let table = [];
            for(let i = 0; i < rows.length; i++){
                //console.log(rows[i]);
                if(!table.hasOwnProperty(rows[i].month)){
                    table[rows[i].month] = [];
                }
                table[rows[i].month][rows[i].day] = rows[i].level;
            }
            callback(table);
        });
    }

    saveDatabasePixels(table){
        if(this.db === null || this.db === undefined){
            return;
        }
        this.db.run("DROP TABLE IF EXISTS pixels", (err) => {
            if(err){
                console.error(err);
                return;
            }
            const query = "CREATE TABLE pixels (ID INTEGER PRIMARY KEY AUTOINCREMENT, month INTEGER, day INTEGER, level INTEGER)";
            this.db.run(query, (err) => {
                if(err){
                    console.error(err);
                    return;
                }
                const stmt = this.db.prepare("INSERT INTO pixels (month, day, level) VALUES (?, ?, ?)");
                //let num = 0;
                //let arr = [];
                //let states = [];
                for(let i = 0; i < table.length; i++){
                    //console.log("Month: " + i);
                    for(let j = 0; j < table[i].length; j++){
                        //console.log("Day: " + j);
                        const level = table[i][j];
                        //arr.push([i, j, level]);
                        //arr.push(i);
                        //arr.push(j);
                        //arr.push(level);
                        //states.push("(?, ?, ?)");
                        //console.log("Level: " + level);
                        stmt.run(i, j, level);
                        //const iq = "INSERT INTO pixels (month, day, level) VALUES (?, ?, ?)";
                        //this.db.run(iq, [i, j, level]);
                        //num++;
                    }
                }
                //const placeholders = states.join(",");
                //let sql = 'INSERT INTO pixels(month, day, level) VALUES ' + placeholders;
                /*this.db.run(sql, arr, function(err) {
                    if (err) {
                        return console.error(err.message);
                    }
                    console.log(`Rows inserted ${this.changes}`);
                });                  */
                stmt.finalize();
                //console.log(num);
            });
        });
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
        if(this.colors !== null && this.colors !== undefined && this.colors.length === 7){
            color = this.colors[level];
        }
        return color;
    }
}

module.exports = SettingsManager;