import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Note } from './types'
import path from 'path'
import * as fs from 'fs'
import { notesFromUser } from './database'

export const getNotes = (req: Request, res: Response) => {
    if (!req.query.username) {
        res.status(400).json({ error: 'No username provided' })
        return
    }
    const username = req.query.username as string

    const allowedNoteIds = notesFromUser(username)
    if (!allowedNoteIds) {
        res.status(404).json({ error: 'No notes found' })
        return
    }
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
    res.json({ message: `Note ${req.params.id}` })
}   
export const createNote = (req: Request, res: Response) => {
    const id = uuidv4()
    if (!req.body.title) {
        res.status(400).send('Enter a title!')
    }

    const note: Note = {
        id: id,
        title: req.body.title,
        content: req.body.content,
        created_at: new Date().toISOString(),
    }

    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)

    fs.writeFile(filePath, JSON.stringify(note, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to write to file' })
        }
        res.status(200).json({ message: `Note created ${id}`, note: note })
    })
}

export const updateNote = (req: Request, res: Response) => {
    res.json({ message: `Note ${req.params.id} updated` })
}

export const deleteNote = (req: Request, res: Response) => {
    const id = req.params.id
    if (!id) {
        res.status(400).send('Not a vallid id')
    }

    // check if user may acces this file
    const filePath = path.join(__dirname, '../', 'notes', `${id}.json`)
    fs.unlinkSync(filePath)
    res.json({ message: `Note ${req.params.id} deleted` })
}
