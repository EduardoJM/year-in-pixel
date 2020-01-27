const { remote } = require('electron');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const { app } = remote;

class SettingsManager {
    constructor(autoinit) {
        this.listener = {
            updateColorLevels: [],
        };
        // this.listener['updateColorLevels'] = [];
        this.db = null;
        if (autoinit) {
            this.initialize();
        }
    }

    initialize() {
        this.defaults = {
            colors: [
                '#4527a0',
                '#ec407a',
                '#f44336',
                '#f57c00',
                '#ffd740',
                '#00c853',
                '#0277bd',
            ],
        };
        this.colors = null;
        // load sqlite
        const dataPath = app.getPath('userData');
        if (fs.existsSync(dataPath)) {
            const dbpath = path.join(dataPath, 'user.db');
            this.db = new sqlite3.Database(dbpath, (err) => {
                if (err) {
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
        this.executeListener('updateColorLevels');
    }

    executeListener(name) {
        if (Object.prototype.hasOwnProperty.call(this.listener, name)
            && this.listener[name].length > 0) {
            this.listener[name].forEach((element) => {
                element();
            });
        }
    }

    loadDatabaseUserInfo() {
        if (this.db === null || this.db === undefined) {
            return;
        }
        const query = 'SELECT * FROM colors';
        this.db.all(query, (err, rows) => {
            this.colors = this.defaults.colors;
            if (err) {
                return;
            }
            for (let i = 0; i < rows.length; i += 1) {
                this.colors[rows[i].id] = rows[i].color;
            }
            this.executeListener('updateColorLevels');
        });
    }

    resetDatabaseUserInfo() {
        this.colors = [
            '#4527a0',
            '#ec407a',
            '#f44336',
            '#f57c00',
            '#ffd740',
            '#00c853',
            '#0277bd',
        ];
        this.saveDatabaseUserInfo();
        this.executeListener('updateColorLevels');
    }

    saveDatabaseUserInfo() {
        if (this.db === null || this.db === undefined) {
            return;
        }
        const query = 'CREATE TABLE IF NOT EXISTS colors (id INT PRIMARY KEY, color CHAR[100])';
        this.db.run(query, (err) => {
            if (err) {
                return;
            }
            if (this.colors === null || this.colors === undefined) {
                this.colors = this.defaults.colors;
            }
            const stmt = this.db.prepare('INSERT OR REPLACE INTO colors VALUES (?, ?)');
            for (let i = 0; i < this.colors.length; i += 1) {
                stmt.run(i, this.colors[i]);
            }
        });
    }

    saveColorOnDatabase(level, color) {
        if (this.db === null || this.db === undefined) {
            return;
        }
        const query = 'CREATE TABLE IF NOT EXISTS colors (id INT PRIMARY KEY, color CHAR[100])';
        this.db.run(query, (err) => {
            if (err) {
                return;
            }
            if (this.colors === null || this.colors === undefined) {
                this.colors = this.defaults.colors;
            }
            this.colors[level] = color;
            const stmt = this.db.prepare('INSERT OR REPLACE INTO colors VALUES (?, ?)');
            stmt.run(level, color);
            this.executeListener('updateColorLevels');
        });
    }

    loadDatabasePixels(callback) {
        if (this.db === null || this.db === undefined) {
            return;
        }
        const query = 'SELECT * FROM pixels';
        this.db.all(query, (err, rows) => {
            if (err) {
                return;
            }
            const table = [];
            for (let i = 0; i < rows.length; i += 1) {
                if (!Object.prototype.hasOwnProperty.call(table, rows[i].month)) {
                    table[rows[i].month] = [];
                }
                table[rows[i].month][rows[i].day] = rows[i].level;
            }
            callback(table);
        });
    }

    saveDatabasePixels(table) {
        if (this.db === null || this.db === undefined) {
            return;
        }
        this.db.run('DROP TABLE IF EXISTS pixels', (err) => {
            if (err) {
                return;
            }
            const query = 'CREATE TABLE pixels (ID INTEGER PRIMARY KEY AUTOINCREMENT, month INTEGER, day INTEGER, level INTEGER)';
            this.db.run(query, (errCreate) => {
                if (errCreate) {
                    return;
                }
                const stmt = this.db.prepare('INSERT INTO pixels (month, day, level) VALUES (?, ?, ?)');
                for (let i = 0; i < table.length; i += 1) {
                    for (let j = 0; j < table[i].length; j += 1) {
                        const level = table[i][j];
                        stmt.run(i, j, level);
                    }
                }
                stmt.finalize();
            });
        });
    }

    addEventListener(name, event) {
        if (!Object.prototype.hasOwnProperty.call(this.listener, name)) {
            return;
        }
        this.listener[name].push(event);
    }

    removeEventListener(name, event) {
        if (!Object.prototype.hasOwnProperty.call(this.listener, name)) {
            return;
        }
        const index = this.listener[name].indexOf(event);
        this.listener[name] = this.listener[name].splice(index, 1);
    }

    getColor(level) {
        if (level < 0) {
            return '#FFF';
        }
        if (level > 6) {
            return '#FFF';
        }
        let color = this.defaults.colors[level];
        if (this.colors !== null && this.colors !== undefined && this.colors.length === 7) {
            color = this.colors[level];
        }
        return color;
    }
}

module.exports = SettingsManager;
