// queryAgent.js
import oracledb from "oracledb";

export async function queryAgent(sqlQuery) {
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: "sania",
      password: "sania123",
      connectString: "localhost:1521/orcl",
    });

    console.log("🔗 Connected to Oracle Database");
    const result = await connection.execute(sqlQuery);
    console.log("✅ Query executed successfully");
    return result.rows || [];
  } catch (err) {
    console.error("❌ Database error:", err);
    return { error: err.message };
  } finally {
    if (connection) {
      try {
        await connection.close();
        console.log("🔒 Connection closed");
      } catch (closeErr) {
        console.error("Error closing connection:", closeErr);
      }
    }
  }
}
