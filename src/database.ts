import { createHash } from 'node:crypto';
import sqlite from 'node:sqlite'
import * as fs from 'fs'
import path from 'path'
import { Token } from './types';


const db = new sqlite.DatabaseSync("notes.db");
db.close(); // close becouse a function can not open it when it is already open

export function addUserToDB(username: string, password: string) {
    db.open();

    try {
        const md5hash = createHash('md5')
        const salt = md5hash.update(new Date().toISOString()).digest('hex')
        password = hashPassword(password, salt)

        const query = db.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)")
        query.run(username, password, salt)
    } catch (err: any) {
        db.close();
        return err
    }

    db.close()
}

export function addUserToNoteInDB(username: string, uuid: string) {

    // only add the user if it does not have access already
    if (hasNoteAccess(username, uuid)) return

    db.open();

    try {
        const query = db.prepare("INSERT INTO usernote (username, uuid) VALUES (?, ?)")
        query.run(username, uuid)
    } catch (err: any) {
        db.close();
        return err
    }

    db.close()
}

export function hasNoteAccess(username: string, uuid: string) {
    const notes = notesFromUser(username)
    return notes.includes(uuid)
}

export function notesFromUser(username: string) {
    db.open();
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
    db.open();
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

export function doesUsernameExist(username: string, callback?: (err: Error) => void) {
    db.open();
    let results: any[] = []
    try {
        const query = db.prepare("SELECT username from users where username = ?")
        results = query.all(username)
    } catch (err: any) {
        if (!callback) console.log(err)
        else callback(err);
        db.close();
        return false
    }
    db.close();

    if (results.length <= 0) {
        return false
    }
    return true;
}

export function isPasswordValid(username: string, password: string, callback?: (err: Error) => void) {
    db.open();
    let results: any[] = []
    try {
        const query = db.prepare("SELECT salt, password from users where username = ?")
        results = query.all(username)
    } catch (err: any) {
        if (!callback) console.log(err)
        else callback(err);
        db.close();
        return false
    }
    db.close();

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
    db.open();
    try {
        const query = db.prepare("DELETE FROM usernote WHERE UUID = ?")
        query.run(uuid)
    } catch (err) {
        db.close();
        return err
    }
    db.close();
}

export function purgeDb() {
    db.open();
    let results: any[] = []

    try {
        const query = db.prepare("SELECT UUID FROM usernote")
        results = query.all()
        results = results.map(result => result.UUID)
        console.log("Purging database...")
        let purgeAmount = 0
        db.close()
        for (const file of results) {
            const filePath = path.join(__dirname, '../', 'notes/', `${file}.json`)
            if (!fs.existsSync(filePath)) {
                console.log(`Deleting file: "${file}" from db`)
                deleteNoteFromDB(file)
                purgeAmount++
            }
        }
        return `Purged ${purgeAmount} files!`
    } catch (err: any) {
        return err
    }

}


export function addTokenToDB(token: Token) {
    db.open();
    try {
        const query = db.prepare("INSERT INTO tokens (username, expiration, token) VALUES (?, ?, ?)")
        query.run(token.username, token.expiration.toISOString(), token.token)
    } catch (err: any) {
        return err
    }

    db.close()
}

// isTokenValid returns the username when provided token is valid. Otherwise returns false
export function isTokenValid(token: string, callback?: (err: Error) => void): Token | null {
    db.open();

    let results: any[] = []
    try {
        const query = db.prepare("SELECT expiration, username from tokens where token = ?")
        results = query.all(token)
    } catch (err: any) {
        if (!callback) console.log(err)
        else callback(err);
        db.close();
        return null
    }
    db.close();

    // check if token exists
    if (results.length <= 0) {
        if (callback) callback(new Error("Token not found!"))
        return null
    }

    // check if token is not expired
    const expiration = new Date(results[0].expiration)
    const username = results[0].username
    if (expiration >= new Date())
        return { token, expiration, username }
    else
        return null
}