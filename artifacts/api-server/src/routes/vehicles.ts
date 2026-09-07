import { Router, type IRouter } from "express";
import {
  CreateVehicleBody,
  CreateVehicleResponse,
  ListVehiclesQueryParams,
  ListVehiclesResponse,
  UpdateVehicleStatusBody,
  UpdateVehicleStatusParams,
  UpdateVehicleStatusResponse,
} from "@workspace/api-zod";
import { dataSource, vehicles } from "../lib/ner-link-data";

const router: IRouter = Router();

router.get("/vehicles", (req, res) => {
  const query = ListVehiclesQueryParams.parse(req.query);
  const result = query.status
    ? vehicles.filter((vehicle) => vehicle.status === query.status)
    : vehicles;
  res.json(ListVehiclesResponse.parse(result));
});

router.post("/vehicles", (req, res) => {
  const parsed = CreateVehicleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const vehicle = {
    id: `veh-${String(vehicles.length + 1).padStart(3, "0")}`,
    ...parsed.data,
    status: "idle" as const,
    eta: "Pending dispatch",
    lat: 26.1445,
    lng: 91.7362,
    riskScore: 0.25,
    lastSeen: new Date().toISOString(),
    source: dataSource("FIELD", "Newly registered field vehicle"),
  };
  vehicles.push(vehicle);
  res.status(201).json(CreateVehicleResponse.parse(vehicle));
});

router.patch("/vehicles/:vehicleId/status", (req, res) => {
  const params = UpdateVehicleStatusParams.safeParse(req.params);
  const body = UpdateVehicleStatusBody.safeParse(req.body);
  if (!params.success || !body.success) {
    res.status(400).json({ error: "Invalid vehicle status update" });
    return;
  }

  const vehicle = vehicles.find((item) => item.id === params.data.vehicleId);
  if (!vehicle) {
    res.status(404).json({ error: "Vehicle not found" });
    return;
  }

  vehicle.status = body.data.status;
  vehicle.lastSeen = new Date().toISOString();
  res.json(UpdateVehicleStatusResponse.parse(vehicle));
});

export default router;