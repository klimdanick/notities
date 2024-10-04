import sqlite3 from 'sqlite3'

export const createUser = (username: String, password: String) => {
    let db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message);
        console.log('Connected to the database.');
    })
    db.serialize(() => {
        let querry = db.prepare("INSERT INTO user (username, password, salt) VALUES (?, ?, ?);")
        querry.run(username, password, 'salt');
    })
}