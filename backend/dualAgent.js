import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Force dotenv to read .env in the backend folder
dotenv.config({ path: path.join(__dirname, ".env") });

import { reasoningAgent } from "./reasoningAgent.js";
import { databaseAgent } from "./databaseAgent.js";

async function main() {
  const userPrompt = process.argv.slice(2).join(" ");
  if (!userPrompt) {
    console.error("❗ Please provide a user query or natural language prompt.");
    return;
  }

  // Step 1: Get SQL query from Reasoning Agent
  const sqlQuery = await reasoningAgent(userPrompt);

  if (!sqlQuery) {
    console.error("❌ No SQL query generated.");
    return;
  }

  // Step 2: Execute query with Database Agent
  const result = await databaseAgent(sqlQuery);

  console.log("\n📦 Final Output:");
  console.log(result);
}

main();
