const oracledb = require('oracledb');

async function runQuery() {
  try {
    oracledb.initOracleClient({ libDir: 'D:\\oracle\\instantclient_21_13' });

    const connection = await oracledb.getConnection({
      user: 'sania',
      password: 'sania123',
      connectString: 'localhost:1521/orcl'
    });

    console.log('✅ Connected to Oracle Database');

    // Example query
    const result = await connection.execute(`SELECT * FROM orders`);
    console.log('✅ Query executed successfully:');
    console.table(result.rows);

    await connection.close();
    console.log('🔒 Connection closed');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

runQuery();
