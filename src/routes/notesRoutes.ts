import { Router } from 'express'
import { createNote, deleteNote, getNote, getNotes } from '../note_handlers'

const router = Router()

router.get('/notes', getNotes)
router.get('/note', getNote)
router.post('/note', createNote)
router.delete('/notes', deleteNote)

export default router
