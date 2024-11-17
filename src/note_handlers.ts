import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Note, Token } from './types'
import path from 'path'
import * as fs from 'fs'
import { addUserToDB, addUserToNoteInDB, deleteNoteFromDB, hasNoteAccess, isTokenValid, notesFromUser } from './database'
import { request } from 'http'

export const getNotes = (req: Request, res: Response) => {


    const allowedNoteIds = notesFromUser(req.token.username)
    let notes = []

    for (const id of allowedNoteIds) {
        const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)
        const fileContent = fs.readFileSync(filePath)
        const note: Note = JSON.parse(fileContent.toString())
        notes.push(note)
    }
    res.status(200).json(notes)
}


export const getNote = (req: Request, res: Response) => {
    const username = req.token.username
    const id = req.query.id as string

    if (!id) {
        res.status(400).json({ error: 'No id provided' })
        return
    }

    if (!hasNoteAccess(username, id)) {
        res.status(403).json({ error: 'You do not have access to this note' })
        return
    }
    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)
    const fileContent = fs.readFileSync(filePath)
    const note: Note = JSON.parse(fileContent.toString())
    res.status(200).json(note)
}


export const createNote = (req: Request, res: Response) => {
    if (!req.body.title) {
        res.status(400).send('Enter a title!')
        return
    }

    const id = uuidv4()
    const username = req.token.username
    const note: Note = {
        id: id,
        title: req.body.title,
        content: "",
        created_at: new Date().toISOString(),
        users: [username]
    }

    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)

    fs.writeFile(filePath, JSON.stringify(note, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write to file' })
        }
    })
    addUserToNoteInDB(username, id)
    res.status(200).json({ message: `Note created ${id}`, note: note })
}


export const updateNote = (req: Request, res: Response) => {
    const username = req.token.username
    const id = req.body.id

    if (!id) {
        res.status(400).json({ error: 'No id provided' })
        return
    }

    if (!hasNoteAccess(username, id)) {
        res.status(403).json({ error: 'You do not have access to this note' })
        return
    }

    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)
    const fileContent = fs.readFileSync(filePath)
    const note: Note = JSON.parse(fileContent.toString())
    note.title = req.body.title || note.title
    note.content = req.body.content || note.content
    note.updated_at = new Date().toISOString()

    fs.writeFile(filePath, JSON.stringify(note, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write to file' })
        }
    })
    res.json({ message: `Note ${id} updated` })
}


export const deleteNote = (req: Request, res: Response) => {
    const username = req.token.username
    const id = req.body.id

    if (!id) {
        res.status(400).json({ error: 'No id provided' })
        return
    }

    if (!hasNoteAccess(username, id)) {
        res.status(403).json({ error: 'You do not have access to this note' })
        return
    }

    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)
    fs.unlinkSync(filePath)

    deleteNoteFromDB(id)
    res.status(200).json({ message: `Note ${id} deleted` })
}

export const addUsersToNote = (req: Request, res: Response) => {
    const username = req.token.username
    const id: string = req.body.id
    const usersToAdd: [string] = req.body.usersToAdd

    if (!id) {
        res.status(400).json({ error: 'No id provided' })
        return
    }

    if (!usersToAdd) {
        res.status(400).json({ error: 'No user provided' })
        return
    }

    if (!hasNoteAccess(username, id)) {
        res.status(403).json({ error: 'You do not have access to this note' })
        return
    }

    for (let i = 0; i < usersToAdd.length; i++)
        addUserToNoteInDB(usersToAdd[i], id)

    res.status(200).send("succes")

}