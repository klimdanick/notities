import { Router } from 'express'
import { createNote, deleteNote, getNotes } from '../note_handlers'

const router = Router()

router.get('/notes', getNotes)
router.get('/note:id', getNotes)
router.post('/note:id', createNote)
router.delete('/notes/:id', deleteNote)

export default router
