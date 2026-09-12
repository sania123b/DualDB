import oracledb from "oracledb";
import dotenv from "dotenv";

dotenv.config();
if (!oracledb.oracleClientVersion) {
    oracledb.initOracleClient({
        libDir:"C:\\oracle\\instantclient-basic-windows.x64-23.26.2.0.0\\instantclient_23_0"
    });
}
export async function extractSchema() {

    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "sania",
            password: "sania123",
            connectString: "localhost:1521/orcl"
        });

        const result = await connection.execute(`
            SELECT 
                table_name,
                column_name,
                data_type
            FROM user_tab_columns
            ORDER BY table_name, column_id
        `);

        return result.rows;

    } catch (error) {
        console.error("Schema extraction failed:", error);
        throw error;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}
