import express from "express";
import MentorController from "../controllers/MentorController";
import authMiddleware from "../middleware/AuthMiddleware";

const mentorRoute = express.Router();
const mentorController = new MentorController();

mentorRoute.post("/", authMiddleware, mentorController.create);
mentorRoute.put("/:id", authMiddleware, mentorController.update);
mentorRoute.delete("/:id", authMiddleware, mentorController.delete);
mentorRoute.get("/", authMiddleware, mentorController.list);
mentorRoute.get("/:id", authMiddleware, mentorController.get);
mentorRoute.put("/archive/:id", authMiddleware, mentorController.archive);
mentorRoute.get("/retrieve/archive-list", authMiddleware, mentorController.archiveList);

export default mentorRoute;