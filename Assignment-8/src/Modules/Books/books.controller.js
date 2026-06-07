import { Router } from "express";
import * as booksService from "./books.service.js";

const router = Router();
router.post("/", booksService.insertOneBook);
router.post("/batch", booksService.insertMultipleBooks);
router.patch("/:title", booksService.updateBookYear);
router.get("/title", booksService.findBookByTitle);
router.get("/year", booksService.findBooksByYearRange);
router.get("/genre", booksService.findBooksByGenre);
router.get("/skip-limit", booksService.skipAndLimitBooks);
router.get("/year-integer", booksService.findYearAsInteger);
router.get("/exclude-genres", booksService.excludeGenres);
router.delete("/before-year", booksService.deleteOldBooks);

router.get("/aggregate1", booksService.aggregate1);
router.get("/aggregate2", booksService.aggregate2);
router.get("/aggregate3", booksService.aggregate3);
router.get("/aggregate4", booksService.aggregate4);

export default router;
