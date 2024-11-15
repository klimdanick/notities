import { Router } from "express";
import {
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "../note_handlers";

const router = Router();

router.get("/notes", getNotes);
router.get("/note", getNote);
router.post("/note", createNote);
router.delete("/note", deleteNote);
router.post("/updateNote", updateNote);

export default router;
