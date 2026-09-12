import dotenv from "dotenv";

const result = dotenv.config({ override: true });

console.log(result);
console.log("Loaded key:", process.env.GEMINI_API_KEY);