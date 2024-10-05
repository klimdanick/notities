import sqlite3 from 'sqlite3'

type UserNote = {
    username: string
    UUID: string
}
export const createUser = (
    username: string,
    password: string,
    callback: (err: Error | null) => void
) => {
    const db = new sqlite3.Database(
        'notes.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message)
                callback(err)
                return
            }
        }
    )

    db.serialize(() => {
        // Check if the user already exists
        db.get(
            'SELECT username FROM Users WHERE username = ?',
            [username],
            (err, row) => {
                if (err) {
                    console.error(err.message)
                    callback(err)
                    return
                }
                if (!row) {
                    const query = db.prepare(
                        'INSERT INTO Users (username, password, salt) VALUES (?, ?, ?);'
                    )
                    query.run(
                        username,
                        password,
                        'salt',
                        (err: Error | null) => {
                            query.finalize()
                            if (err) {
                                console.error(err.message)
                                callback(err)
                            } else {
                                callback(null)
                            }
                        }
                    )
                } else {
                    console.log('User already exists.')
                    callback(new Error('User already exists.'))
                }
            }
        )
    })

    // Move db.close() inside the callback of the query
    db.close()
}

export const addUserToNote = (
    username: string,
    uuid: string,
    callback: (err: Error | null) => void
) => {
    const db = new sqlite3.Database(
        'notes.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message)
                callback(err)
                return
            }
        }
    )

    db.serialize(() => {
        const query = db.prepare(
            'INSERT INTO UserNote (username, uuid) VALUES (?, ?);'
        )
        query.run(username, uuid, (err: Error | null) => {
            query.finalize()
            if (err) {
                console.error(err.message)
                callback(err)
            } else {
                callback(null)
            }
        })
    })

    db.close()
}

export const NotesFromUser = (
    username: string,
    callback: (notes: string[] | null, err: Error | null) => void
) => {
    const notes: string[] = []
    const db = new sqlite3.Database(
        'notes.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message)
                callback(null, err)
                return
            }
        }
    )

    db.serialize(() => {
        const query = db.prepare('SELECT * FROM UserNote WHERE username = ?;')
        query.each(
            username,
            (err, row: UserNote) => {
                if (err) {
                    console.log(err)
                    callback(null, err)
                    return
                }
                notes.push(row.UUID)
            },
            () => {
                query.finalize()
                callback(notes, null)
            }
        )
    })

    db.close()
}

export const UserHasNoteAccess = (
    username: string,
    uuid: string,
    callback: (access: boolean) => void
) => {
    const db = new sqlite3.Database(
        'notes.db',
        sqlite3.OPEN_READWRITE,
        (err) => {
            if (err) {
                console.error(err.message)
                callback(false)
                return
            }
        }
    )

    const query = 'SELECT * FROM UserNote WHERE username = ?;'
    db.get(query, [username], (err, row: UserNote) => {
        if (err) {
            console.log(err)
            callback(false)
        } else {
            callback(row && row.UUID === uuid)
        }

        db.close()
    })
}
