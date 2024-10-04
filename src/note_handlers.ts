import { Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'
import { Note } from './types'
import path from 'path'
import * as fs from 'fs'

export const getNotes = (req: Request, res: Response) => {
    res.json({ message: 'All notes' })
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

    fs.writeFile(filePath, JSON.stringify(req.body.content, null, 2), (err) => {
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
    res.json({ message: `Note ${req.params.id} deleted` })
}
