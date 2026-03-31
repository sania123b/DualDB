import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function errorRecoveryAgent(originalSQL, oracleError, userPrompt) {
  try {
    console.log("⚙️ Activating Error Recovery Agent...");

    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `
You are an expert Oracle SQL fixer for version 10g.
A query failed to execute. Your task is to correct the SQL query
based on the error and original intent.

⚙️ Rules:
- Return only corrected SQL (no markdown, no explanation).
- Use valid Oracle 10g syntax only.
- Use VARCHAR2, NUMBER, DATE datatypes.
- End with a semicolon.
- Do NOT use unsupported features (e.g., GENERATED AS IDENTITY).

Context:
User Prompt: ${userPrompt}
Original SQL: ${originalSQL}
Oracle Error: ${oracleError}

Now return the corrected SQL:
`;

    const result = await model.generateContent(prompt);
    const fixedSQL = result.response.text().trim();

    console.log("✅ Recovered SQL:", fixedSQL);
    return fixedSQL;
  } catch (err) {
    console.error("❌ Error Recovery Agent failed:", err);
    return null;
  }
}
