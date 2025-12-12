import { Router } from "express";
import { FilterController } from "./filter.controller";

const router = Router();

router.get("/events", FilterController.events);
router.get("/applicants", FilterController.applicants);
router.get("/sessions", FilterController.sessions);

export default router;
