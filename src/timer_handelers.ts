import { Request, Response } from 'express'
import { Note, Token } from './types'
import { addUserToDB, addUserToNoteInDB, deleteNoteFromDB, hasNoteAccess, isTokenValid, notesFromUser } from './database'

export const getTimers = (req: Request, res: Response) => {

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
    
    
    res.status(200).send();
}

export const startTimer = (req: Request, res: Response) => {

    const username = req.token.username
    const noteId = req.query.id as string
    const timerId = req.query.timer as string

    if (!noteId) {
        res.status(400).json({ error: 'No id provided' })
        return
    }
    if (!timerId) {
        res.status(400).json({ error: 'No timer provided' })
        return
    }

    if (!hasNoteAccess(username, noteId)) {
        res.status(403).json({ error: 'You do not have access to this note' })
        return
    }
    
    res.status(200).send();
}