import { Router, type IRouter } from "express";
import {
  GetRouteRecommendationsQueryParams,
  GetRouteRecommendationsResponse,
  GetWeatherSignalsResponse,
  ListAlertsResponse,
  GetWeeklyReportResponse,
} from "@workspace/api-zod";
import { dataSource, incidents, simulatedSource } from "../lib/ner-link-data";

const router: IRouter = Router();

router.get("/routes/recommendations", (req, res) => {
  const query = GetRouteRecommendationsQueryParams.parse(req.query);
  const priorityNote =
    query.cargoPriority === "critical"
      ? "Critical cargo receives the strongest disruption avoidance weighting."
      : "The recommendation balances travel time with current disruption risk.";
  const recommendations = [
    {
      id: "route-001",
      name: "Corridor A",
      via: `${query.origin} → Dimapur → ${query.destination}`,
      distanceKm: 292,
      durationMinutes: 470,
      riskScore: query.cargoPriority === "critical" ? 0.22 : 0.28,
      riskLabel: "low" as const,
      priorityFit: 94,
      reason: `${priorityNote} Avoids the Peren slope watch zone.`,
      source: simulatedSource,
    },
    {
      id: "route-002",
      name: "Corridor B",
      via: `${query.origin} → Silchar → ${query.destination}`,
      distanceKm: 256,
      durationMinutes: 418,
      riskScore: 0.51,
      riskLabel: "moderate" as const,
      priorityFit: 77,
      reason: "Faster under dry conditions, but exposed to Barak valley flood signals.",
      source: simulatedSource,
    },
    {
      id: "route-003",
      name: "Corridor C",
      via: `${query.origin} → Jorhat → ${query.destination}`,
      distanceKm: 334,
      durationMinutes: 535,
      riskScore: 0.67,
      riskLabel: "high" as const,
      priorityFit: 53,
      reason: "Longest option with multiple rainfall-sensitive segments.",
      source: simulatedSource,
    },
  ];
  res.json(GetRouteRecommendationsResponse.parse(recommendations));
});

router.get("/weather", (_req, res) => {
  const weather = [
    {
      region: "Peren",
      condition: "Heavy rain",
      rainfallMm: 86,
      riskLevel: "severe" as const,
      forecast: "Slope movement likely through 20:00",
      source: dataSource("SIMULATED", "Regional weather adapter fallback"),
    },
    {
      region: "Barak Valley",
      condition: "Intermittent rain",
      rainfallMm: 44,
      riskLevel: "high" as const,
      forecast: "Low crossings under watch",
      source: dataSource("SIMULATED", "Regional weather adapter fallback"),
    },
    {
      region: "Dibrugarh",
      condition: "Cloudy",
      rainfallMm: 12,
      riskLevel: "moderate" as const,
      forecast: "Normal logistics conditions",
      source: dataSource("SIMULATED", "Regional weather adapter fallback"),
    },
  ];
  res.json(GetWeatherSignalsResponse.parse(weather));
});

router.get("/alerts", (_req, res) => {
  const alerts = [
    {
      id: "alert-001",
      title: "Avoid Peren bend for critical cargo",
      detail: "Use Corridor A until field verification closes the landslide watch.",
      severity: "critical" as const,
      area: "NH-29, Peren",
      timestamp: incidents[0].reportedAt,
      acknowledged: false,
      source: incidents[0].source,
    },
    {
      id: "alert-002",
      title: "Vehicle telemetry gap",
      detail: "TR-01-E-9084 has not checked in for 42 minutes.",
      severity: "high" as const,
      area: "Agartala → Aizawl",
      timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
      acknowledged: false,
      source: simulatedSource,
    },
    {
      id: "alert-003",
      title: "Weather adapter is simulated",
      detail: "Connect a live provider before using weather signals for operational dispatch.",
      severity: "medium" as const,
      area: "All regions",
      timestamp: new Date().toISOString(),
      acknowledged: false,
      source: simulatedSource,
    },
  ];
  res.json(ListAlertsResponse.parse(alerts));
});

router.get("/reports/weekly", (_req, res) => {
  const report = {
    weekLabel: "31 Aug – 06 Sep 2026",
    averageDisruptionIndex: 38,
    incidentCount: 23,
    deliveriesCompleted: 117,
    highRiskHours: 29,
    trend: [
      { day: "Mon", index: 32, incidents: 2 },
      { day: "Tue", index: 28, incidents: 3 },
      { day: "Wed", index: 42, incidents: 5 },
      { day: "Thu", index: 46, incidents: 4 },
      { day: "Fri", index: 39, incidents: 3 },
      { day: "Sat", index: 35, incidents: 3 },
      { day: "Sun", index: 38, incidents: 3 },
    ],
    source: simulatedSource,
  };
  res.json(GetWeeklyReportResponse.parse(report));
});

export default router;