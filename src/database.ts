import sqlite3 from 'sqlite3'

export const createUser = (username: String, password: String) => {
    const db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message)
    })
    db.serialize(() => {
        let querry = db.prepare("INSERT INTO Users (username, password, salt) VALUES (?, ?, ?);")
        querry.run(username, password, 'salt')
    })
    db.close()
}

export const addUserToNote = (username: String, uuid: String) => {
    const db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message)
    })
    db.serialize(() => {
        let querry = db.prepare("INSERT INTO UserNote (username, uuid) VALUES (?, ?);")
        querry.run(username, uuid)
    })
    db.close()
}

export const NotesFromUser = (username: string) => {
    let notes: string[] = [];
    const db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message)
    })
    db.serialize(() => {
        let querry = db.prepare('SELECT uuid FROM UserNote WHERE username = "?";')
        querry.each(username, (err, row: any) => {
            notes.push(row.uuid)
        })
    })
    db.close()
    return notes
}

export const UserHasNoteAccess = (username: string, uuid: string) => {
    let access: boolean = false;
    const db = new sqlite3.Database('notes.db', sqlite3.OPEN_READWRITE, (err) => {
        if (err) console.error(err.message)
    })
    db.serialize(() => {
        let querry = db.prepare('SELECT uuid FROM UserNote WHERE username = "?";')
        querry.each(username, (err, row: any) => {
            if (row.uuid == uuid) access = true
        })
    })
    db.close()
    return access
}