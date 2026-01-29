const { Client } = require('pg');

async function getConection() {
  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'admin',
    password: 'Sodimac25*',
    database: 'actas_sodimac'
  });
  await client.connect();
  return client;
}

module.exports = getConection;