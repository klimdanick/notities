import sqlite from 'node:sqlite'

export function createUser(username: string, password: string) {
    const db = new sqlite.DatabaseSync("notes.db");

    try {
        const query = db.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)")
        query.run(username, password, "salt")
    } catch (err: any) {
        return err
    }

    db.close()
}

export function addUserToNode(username: string, uuid: string) {
    if (hasNoteAccess(username, uuid)) return
    const db = new sqlite.DatabaseSync("notes.db");

    try {
        const query = db.prepare("INSERT INTO usernote (username, uuid) VALUES (?, ?)")
        query.run(username, uuid)
    } catch (err: any) {
        return err
    }

    db.close()
}

export function hasNoteAccess(username: string, uuid: string) {
    const notes = notesFromUser(username)
    return notes.includes(uuid)
}

export function notesFromUser(username: string) {
    const db = new sqlite.DatabaseSync("notes.db");
    let results: any[] | null = []
    try {
        const query = db.prepare("SELECT UUID from usernote where username = ?")
        results = query.all(username)
        results = results.map(result => result.UUID)
    } catch (err: any) {
        console.log(err)
    }

    db.close()
    return results
}

export function usersFromNote(uuid: string) {
    const db = new sqlite.DatabaseSync("notes.db");
    let results: any[] = []
    try {
        const query = db.prepare("SELECT username from usernote where UUID = ?")
        results = query.all(uuid)
        results = results.map(result => result.UUID)
    } catch (err: any) {
        console.log(err)
    }

    db.close()
    return results
}