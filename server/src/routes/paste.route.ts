import { Router } from "express";
import { accessProtectedPaste, createPaste, deletePaste, getPaste, updatePaste } from "../controllers/paste.controller";

const pasteRouter = Router();


pasteRouter.post("/create-paste", createPaste);

pasteRouter.get("/get-paste/:slug", getPaste);

pasteRouter.get("/get-protected-paste/:slug", accessProtectedPaste);

pasteRouter.put("/update-paste/:slug", updatePaste);

pasteRouter.delete("/delete-paste/:slug", deletePaste);

export default pasteRouter;