import { Request, Response } from 'express'

export const getNotes = (req: Request, res: Response) => {
    res.json({ message: 'All notes' })
}

export const createNote = (req: Request, res: Response) => {
    res.json({ message: 'Note created' })
}

export const updateNote = (req: Request, res: Response) => {
    res.json({ message: `Note ${req.params.id} updated` })
}

export const deleteNote = (req: Request, res: Response) => {
    res.json({ message: `Note ${req.params.id} deleted` })
}
