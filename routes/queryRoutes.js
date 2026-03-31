import express from "express";
import { interpretQuery } from "../controllers/interpreterAgent.js";
import { optimizeAndExecute } from "../controllers/optimizerAgent.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userQuery } = req.body;
    const { interpretedSQL } = interpretQuery(userQuery);
    const { optimizedQuery, results } = await optimizeAndExecute(interpretedSQL);

    res.json({ interpretedSQL, optimizedQuery, results });
  } catch (err) {
    res.status(500).json({ error: "Query failed", details: err.message });
  }
});

export default router;
