import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { enhanceJobDescription, enhanceProfessionalSummary, enhanceProjectDescription, uploadResume, checkATS, improveResumeATS } from "../controllers/aiController.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const aiRouter = express.Router();

aiRouter.post('/enhance-pro-sum', protect, enhanceProfessionalSummary)
aiRouter.post('/enhance-job-desc', protect, enhanceJobDescription)
aiRouter.post('/enhance-project-desc', protect, enhanceProjectDescription)
aiRouter.post('/upload-resume', protect, uploadResume)

aiRouter.post('/check-ats', protect, upload.single('resumePdf'), checkATS)
aiRouter.post('/improve-resume', protect, upload.single('resumePdf'), improveResumeATS)

export default aiRouter
