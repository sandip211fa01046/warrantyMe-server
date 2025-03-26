import express from "express";
import { createLetter, uploadToDrive } from "../Controller/letterController";
const router = express.Router();

router.post("/create", createLetter);
router.post("/upload", uploadToDrive);

export default router;
