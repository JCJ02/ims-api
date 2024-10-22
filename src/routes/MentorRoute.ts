import express from "express";
import MentorController from "../controllers/MentorController";

const mentorRoute = express.Router();
const mentorController = new MentorController();

mentorRoute.post("/create", mentorController.createMentor);
mentorRoute.put("/update/:id", mentorController.updateMentor);
mentorRoute.put("/delete/:id", mentorController.deleteMentor);

export default mentorRoute;