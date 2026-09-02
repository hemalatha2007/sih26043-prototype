import "dotenv/config";
import express from "express";
import cors from "cors";
import problemsRouter from "./routes/problems";
import tasksRouter from "./routes/tasks";
import universitiesRouter from "./routes/universities";
import authRouter from "./routes/auth.routes";
import dashboardRouter from "./routes/dashboard.routes";
import analyticsRouter from "./routes/analytics.routes";
import notificationsRouter from "./routes/notifications.routes";
import profileRouter from "./routes/profile.routes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.use("/api/auth", authRouter);
app.use("/api/problems", problemsRouter);
app.use("/api/universities", universitiesRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/analytics", analyticsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/profile", profileRouter);
app.use("/api", tasksRouter); // exposes /api/problems/:problemId/tasks and /api/tasks/:id

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => console.log(`SIH26043 API listening on http://localhost:${PORT}`));
