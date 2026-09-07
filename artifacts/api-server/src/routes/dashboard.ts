import { Router, type IRouter } from "express";
import {
  GetDashboardActivityResponse,
  GetDashboardSummaryResponse,
} from "@workspace/api-zod";
import { incidents, simulatedSource, vehicles } from "../lib/ner-link-data";

const router: IRouter = Router();

router.get("/dashboard/summary", (_req, res) => {
  const summary = {
    activeVehicles: vehicles.filter((vehicle) => vehicle.status !== "offline").length,
    vehiclesMoving: vehicles.filter((vehicle) => vehicle.status === "moving").length,
    criticalIncidents: incidents.filter((incident) => incident.severity === "critical").length,
    roadsAtRisk: 7,
    deliveriesOnTime: 82.4,
    disruptionIndex: 41,
    source: simulatedSource,
  };
  res.json(GetDashboardSummaryResponse.parse(summary));
});

router.get("/dashboard/activity", (_req, res) => {
  const activity = [
    {
      id: "activity-001",
      type: "incident" as const,
      title: "Critical incident flagged",
      detail: "Landslide risk near Peren bend needs verification.",
      timestamp: incidents[0].reportedAt,
      severity: "critical" as const,
      source: incidents[0].source,
    },
    {
      id: "activity-002",
      type: "vehicle" as const,
      title: "Vehicle route delayed",
      detail: `${vehicles[1].registration} is 38 minutes behind its expected corridor.`,
      timestamp: vehicles[1].lastSeen,
      severity: "high" as const,
      source: vehicles[1].source,
    },
    {
      id: "activity-003",
      type: "weather" as const,
      title: "Rainfall signal updated",
      detail: "Barak valley crossings have moved into the high-risk watch band.",
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      severity: "high" as const,
      source: simulatedSource,
    },
    {
      id: "activity-004",
      type: "route" as const,
      title: "Priority route recommended",
      detail: "Critical cargo route recalculated around Peren.",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      severity: "info" as const,
      source: simulatedSource,
    },
  ];
  res.json(GetDashboardActivityResponse.parse(activity));
});

export default router;