import express from "express";
import MentorController from "../controllers/MentorController";

const mentorRoute = express.Router();
const mentorController = new MentorController();


export default mentorRoute;