import { Router } from "express";
import * as collectionsService from "./collections.service.js";

const router = Router();
router.post("/books", collectionsService.createExplicitBooks);
router.post("/authors", collectionsService.createImplicitAuthors);
router.post("/logs/capped", collectionsService.createCappedLogs);
router.post("/books/index", collectionsService.createBooksIndex);

export default router;
