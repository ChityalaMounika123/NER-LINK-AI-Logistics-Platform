import { Router, type IRouter } from "express";
import {
  CreateIncidentBody,
  CreateIncidentResponse,
  ListIncidentsQueryParams,
  ListIncidentsResponse,
} from "@workspace/api-zod";
import { dataSource, incidents } from "../lib/ner-link-data";

const router: IRouter = Router();

router.get("/incidents", (req, res) => {
  const query = ListIncidentsQueryParams.parse(req.query);
  const result = query.severity
    ? incidents.filter((incident) => incident.severity === query.severity)
    : incidents;
  res.json(ListIncidentsResponse.parse(result));
});

router.post("/incidents", (req, res) => {
  const parsed = CreateIncidentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const incident = {
    id: `inc-${String(incidents.length + 1).padStart(3, "0")}`,
    ...parsed.data,
    reportedBy: "Current field officer",
    reportedAt: new Date().toISOString(),
    status: "open" as const,
    source: dataSource("FIELD", "New field report"),
  };
  incidents.unshift(incident);
  res.status(201).json(CreateIncidentResponse.parse(incident));
});

export default router;