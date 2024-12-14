import { Router } from "express";
import {
  addUsersToNote,
  createNote,
  deleteNote,
  getNote,
  getNotes,
  updateNote,
} from "../note_handlers";
import { login, createUser } from "../authentication";
import { getTimers, startTimer } from "../timer_handelers";

const router = Router();

router.get("/notes", getNotes);
router.get("/note", getNote);
router.post("/note", createNote);
router.delete("/note", deleteNote);
router.post("/updateNote", updateNote);
router.post("/login", login);
router.post("/createUser", createUser);
router.post("/addUsersToNote", addUsersToNote)
router.get("/getTimers", getTimers)
router.get("/startTimer", startTimer)

export default router;
