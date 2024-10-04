import sqlite3 from 'sqlite3'

export const createUser = (username: String, password: String) => {
    let db = new sqlite3.Database(':main:')
    db.serialize(() => {
        let querry = db.prepare("INSERT INTO user (username, password, salt) VALUES (?, ?, ?);")
        querry.run(username, password, 'salt');
    })
    db.close();
}