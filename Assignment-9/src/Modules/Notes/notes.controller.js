import { Router } from "express";
import * as notesService from "./notes.service.js";
import { auth } from "../../Middleware/auth.middleware.js";

const router = Router();

router.use(auth);

router.post("/", notesService.createNote);
router.patch("/all", notesService.updateAllTitles);
router.patch("/:noteId", notesService.updateSingleNote);
router.put("/replace/:noteId", notesService.replaceNote);
router.delete("/all", notesService.deleteAllNotes);
router.delete("/:noteId", notesService.deleteSingleNote);
router.get("/paginate-sort", notesService.getPaginatedNotes);
router.get("/note-by-content", notesService.getNoteByContent);
router.get("/note-with-user", notesService.getNotesWithUser);
router.get("/aggregate", notesService.getNotesAggregate);
router.get("/:id", notesService.getNoteById);

export default router;
