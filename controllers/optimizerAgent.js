import db from "../config/db.js";

// Agent 2: Optimizes and executes SQL query
export const optimizeAndExecute = (query) => {
  const optimizedQuery = query.replace("*", "id, name, amount"); // Simple optimization
  return new Promise((resolve, reject) => {
    db.query(optimizedQuery, (err, results) => {
      if (err) reject(err);
      else resolve({ optimizedQuery, results });
    });
  });
};
