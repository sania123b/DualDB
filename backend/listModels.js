import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI('');

async function listModels() {
  try {
    const result = await fetch(
      "https://generativelanguage.googleapis.com/v1/models?key=" + ''
    );

    const data = await result.json();
    console.log("✅ Available Models:\n");
    data.models.forEach((m) => console.log("•", m.name));
  } catch (error) {
    console.error("❌ Error listing models:", error);
  }
}

listModels();
