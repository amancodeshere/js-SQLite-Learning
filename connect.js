import sqlite3 from 'sqlite3';

const sql3 = sqlite3.verbose();

// create the database in memory
// const database = new sql3.Database(':memory', sqlite3.OPEN_READWRITE, connected);

// Creates a random file
// const database = new sql3.Database('', sqlite3.OPEN_READWRITE, connected);

// creates a file called mydata.db ==> best for my use case
const db = new sql3.Database('./mydata.db', sqlite3.OPEN_READWRITE, connected);

function connected(err){
    if (err) {
        console.error(err);
        return -1;
    }
    console.log('Connected successfully.');
}

let sql = `CREATE TABLE IF NOT EXISTS enemies(
    enemy_id INTEGER PRIMARY KEY,
    enemy_name TEXT NOT NULL,
    enemy_reason TEXT NOT NULL
)`;
db.run(sql, [], (err)=>{
    if (err) {
        console.error('error while creating enemies table');
        return -1;
    }
    console.log('Created enemies table');
});

export { db };

