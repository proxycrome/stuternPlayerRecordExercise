const { Pool } = require('pg');

const client = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Stutern_player",
    port: 5432,
    password: "target01"
});

client.connect();

module.exports = client