// backend/loggerAgent.js
import fs from "fs";
import path from "path";

const logPath = path.resolve("./queryLogs.txt");

export function loggerAgent(entry) {
  const log = `[${new Date().toLocaleString()}] ${entry}\n`;
  fs.appendFileSync(logPath, log);
}
