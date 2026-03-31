import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

console.log("✅ DB_USER:", process.env.DB_USER);
console.log("✅ DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("✅ DB_CONNECT_STRING:", process.env.DB_CONNECT_STRING);

