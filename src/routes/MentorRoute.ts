import express from "express";
import MentorController from "../controllers/MentorController";
import authenticationMiddleware from "../middlewares/AuthenticationMiddleware";

const mentorRoute = express.Router();
const mentorController = new MentorController();

mentorRoute.post("/", authenticationMiddleware, mentorController.create);
mentorRoute.put("/:id", authenticationMiddleware, mentorController.update);
mentorRoute.delete("/:id", authenticationMiddleware, mentorController.delete);
mentorRoute.get("/", authenticationMiddleware, mentorController.list);
mentorRoute.get("/:id", authenticationMiddleware, mentorController.get);
mentorRoute.put("/archive/:id", authenticationMiddleware, mentorController.archive);
mentorRoute.get("/retrieve/archive-list", authenticationMiddleware, mentorController.archiveList);

export default mentorRoute;