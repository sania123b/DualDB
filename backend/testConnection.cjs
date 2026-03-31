const oracledb = require('oracledb');
const fs = require('fs');

const INSTANT_CLIENT_DIR = 'D:\\oracle\\instantclient_21_13';

async function testConnection() {
  if (fs.existsSync(INSTANT_CLIENT_DIR)) {
    oracledb.initOracleClient({ libDir: INSTANT_CLIENT_DIR });
    console.log('Thick mode initialized.');
  }

  try {
    const connection = await oracledb.getConnection({
      user: 'sania',            // UPPERCASE (as shown in SQL*Plus)
      password: 'sania123',     // use the same one that works in SQL*Plus
      connectString: 'localhost:1521/orcl'
    });

    console.log('✅ Connection successful!');
    await connection.close();
  } catch (err) {
    console.error('❌ Connection failed.');
    console.error('Full error:', err);
  }
}

testConnection();
