import sqlite3 from 'sqlite3'

export const createUser = (username: String, password: String) => {
    let db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message)
    })
    db.serialize(() => {
        let querry = db.prepare("INSERT INTO Users (username, password, salt) VALUES (?, ?, ?);")
        querry.run(username, password, 'salt')
    })
}

export const addUserToNote = (username: String, uuid: String) => {
    let db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message)
    })
    db.serialize(() => {
        let querry = db.prepare("INSERT INTO UserNote (username, uuid) VALUES (?, ?);")
        querry.run(username, uuid)
    })
}