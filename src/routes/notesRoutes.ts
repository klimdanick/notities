import { Router } from 'express'
import { createNote, deleteNote, getNotes } from '../note_handlers'

const router = Router()

router.get('/notes', getNotes)
router.get('/note', getNotes)
router.post('/note', createNote)
router.delete('/notes', deleteNote)

export default router
