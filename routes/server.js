import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import sqlite3 from 'sqlite3';

const app = express();
const router = express.Router();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

const db = new sqlite3.Database('./server/database.sqlite');

db.serialize(() => {
    // Create navmarks table
    db.run(`
      CREATE TABLE IF NOT EXISTS navmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        Name TEXT,
        LatDeg INTEGER,
        LatMn REAL,
        LonDeg INTEGER,
        LonMn REAL
      )
    `);
    db.get("SELECT COUNT(*) AS count FROM navmarks", (err, row) => {
      if (err) {
        console.error(err.message);
        return;
      }
      if (row.count === 0) {
        db.run("INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES ('Sentosa', 1, 15.298, 103, 49.056)");
        db.run("INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES ('Bukom Tw', 1, 13.625, 103, 46.625)");
        db.run("INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES ('NE Semakau', 1, 12.641, 103, 46.804)");
      }
      });
    
    // Create waypoints table
    db.run(`
        CREATE TABLE IF NOT EXISTS waypoints (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Point TEXT,
          LatDeg INTEGER,
          LatMn REAL,
          LonDeg INTEGER,
          LonMn REAL
        )
      `);
    db.get("SELECT COUNT(*) AS count FROM waypoints", (err, row) => {
        if (err) {
          console.error(err.message);
          return;
        }
        if (row.count === 0) {
          db.run("INSERT INTO waypoints (Point, LatDeg, LatMn, LonDeg, LonMn) VALUES ('A', 1, 13.26, 103, 45.528)");
          db.run("INSERT INTO waypoints (Point, LatDeg, LatMn, LonDeg, LonMn) VALUES ('B', 1, 12.99, 103, 46.8)");        }
        });
    }
);

router.get('/api/nav-marks', (req, res) => {
    db.all('SELECT * FROM navmarks', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  });

  router.get('/api/waypoints', (req, res) => {
    db.all('SELECT * FROM waypoints', [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ data: rows });
    });
  });
 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
