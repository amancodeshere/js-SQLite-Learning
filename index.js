import {db} from "./connect.js";

import express from "express";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.status(200).send("Welcome to mortal enemy services online");
});

app.get('/api', (req, res) => {
    //get all enemies from the table
    res.set('content-type', 'application/json');
    const sql = 'SELECT * FROM enemies';
    let data = { enemies: [] };
    try {
        db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            rows.forEach((row) => {
                data.enemies.push({ id: row.enemy_id, name: row.enemy_name, reason: row.enemy_reason });
            });
            let content = JSON.stringify(data);
            res.send(content);
        });
    } catch (err) {
        console.log(err);
        res.status(467);
        res.send(`{"code":467, "status":"${err.message}"}`);
    }
});

app.post('/api', (req, res) => {
    console.log(req.body);

    res.set('content-type', 'application/json');
    const sql = 'INSERT INTO enemies(enemy_name, enemy_reason) VALUES (? , ?)';
    let newID;
    try {
        db.run(sql, [req.body.name, req.body.reason], function(err) {
            if (err) { throw err; }
            newID = this.lastID; // provides the auto increment value
            res.status(201);
            let data = { status: 201, message: `Mortal enemy ${newID} saved.` };
            let content = JSON.stringify(data);
            res.send(content);
        });
    }catch(err) {
        console.log(err);
        res.status(468);
        res.send(`{"code":468, "status":"${err.message}"}`);
    }

});

app.delete('/api', (req, res) => {
    res.set('content-type', 'application/json');
    const sql = 'DELETE FROM enemies WHERE enemy_id =?';
    try{
        db.run(sql, [req.query.id], function(err) {
            if (err) { throw err }
            if (this.changes === 1) {
                // one item deleted
                res.status(202);
                res.send(`{"message":"Enemy with enemy_id: ${req.query.id} was deleted"`);
            } else {
                // NO delete occured
                res.status(200);
                res.send(`{"message": "No operation needed."}`);
            }
        });
    }catch (err) {
        console.log(err);
        res.status(469);
        res.send(`{"code":469, "status":"${err.message}"}`);
    }
});

app.listen(3000, (err) => {
    if (err) {
        console.error("ERROR:", err.message);
    }
    console.log(`Listening on port 3000`);
});

