import { Router, type IRouter } from "express";
import healthRouter from "./health";
import dashboardRouter from "./dashboard";
import vehiclesRouter from "./vehicles";
import incidentsRouter from "./incidents";
import intelligenceRouter from "./intelligence";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dashboardRouter);
router.use(vehiclesRouter);
router.use(incidentsRouter);
router.use(intelligenceRouter);

export default router;
