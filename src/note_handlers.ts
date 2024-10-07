import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Note } from './types'
import path from 'path'
import * as fs from 'fs'
import { addUserToNode, deleteNoteFromDB, hasNoteAccess, notesFromUser } from './database'


export const getNotes = (req: Request, res: Response) => {
    if (!req.query.username) {
        res.status(400).json({ error: 'No username provided' })
        return
    }
    const username = req.query.username as string
    const allowedNoteIds = notesFromUser(username)
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
    if (!req.query.id || !req.query.username) {
        res.status(400).json({ error: 'No username or id provided' })
        return
    }
    const id = req.query.id as string
    const username = req.query.username as string
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
    if (!req.body.username) {
        res.status(400).send('Enter a username!')
        return
    }

    const id = uuidv4()
    const username = req.body.username
    const note: Note = {
        id: id,
        title: req.body.title,
        content: {},
        created_at: new Date().toISOString(),
    }

    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)

    fs.writeFile(filePath, JSON.stringify(note, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write to file' })
        }
    })
    addUserToNode(username, id)
    res.status(200).json({ message: `Note created ${id}`, note: note })
}


export const updateNote = (req: Request, res: Response) => {
    if (!req.body.username || !req.body.id) {
        res.status(400).json({ error: 'No username or id provided' })
        return
    }
    const username = req.body.username
    const id = req.body.id
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
    if (!req.body.username || !req.body.id) {
        res.status(400).json({ error: 'No username provided' })
        return
    }
    const username = req.body.username
    const id = req.body.id

    if (!hasNoteAccess(username, id)) {
        res.status(403).json({ error: 'You do not have access to this note' })
        return
    }

    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)
    fs.unlinkSync(filePath)

    deleteNoteFromDB(id)
    res.status(200).json({ message: `Note ${id} deleted` })
}
