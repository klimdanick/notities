import { createHash } from 'node:crypto';
import sqlite from 'node:sqlite'
import * as fs from 'fs'
import path from 'path'


export function createUser(username: string, password: string) {
    const db = new sqlite.DatabaseSync("notes.db");

    try {
        const md5hash = createHash('md5')
        const salt = md5hash.update(new Date().toISOString()).digest('hex')
        password = hashPassword(password, salt)

        const query = db.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)")
        query.run(username, password, salt)
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
    let results: any[] = []
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

export function isPasswordValid(username: string, password: string, callback?: (err: Error) => void) {
    const db = new sqlite.DatabaseSync("notes.db");
    let results: any[] = []
    try {
        const query = db.prepare("SELECT salt, password from users where username = ?")
        results = query.all(username)
    } catch (err: any) {
        if (!callback) console.log(err)
        else callback(err);
        return false
    }
    if (results.length <= 0) {
        if (callback) callback(new Error("User not found!"))
        return false
    }

    const salt = results[0].salt
    const databasePassword = results[0].password
    password = hashPassword(password, salt)
    return databasePassword == password
}

function hashPassword(password: string, salt: string) {
    const hash = (password: string) => {
        const sha256hash = createHash('sha256')
        return sha256hash.update(password).digest('hex')
    }

    password = hash(password)
    password = hash(password + salt)
    return password
}

export function deleteNoteFromDB(uuid: string) {
    const db = new sqlite.DatabaseSync("notes.db");
    try {
        const query = db.prepare("DELETE FROM usernote WHERE UUID = ?")
        query.run(uuid)
    } catch (err) {
        return err
    }
}

export function purgeDb() {
    const db = new sqlite.DatabaseSync("notes.db");
    let results: any[] = []

    try {
        const query = db.prepare("SELECT UUID FROM usernote")
        results = query.all()
        results = results.map(result => result.UUID)
        console.log("Purging database...")
        let purgeAmount = 0
        for (const file of results) {
            const filePath = path.join(__dirname, '../', 'notes/', `${file}.json`)
            if (!fs.existsSync(filePath)) {
                console.log(`Deleting file: "${file}" from db`)
                deleteNoteFromDB(file)
                purgeAmount++
            }
        }
        console.log(`Purged ${purgeAmount} files!`)
    } catch (err: any) {
        return err
    }

    db.close()

}