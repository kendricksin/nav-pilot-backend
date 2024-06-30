const express = require('express');
const sqlite3 = require('sqlite3');

const router = express.Router();

const db = new sqlite3.Database('./db/database.sqlite');

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
      db.run("INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES ('Sentosa Tower', 1, 15.298, 103, 49.056)");
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
      db.run("INSERT INTO waypoints (Point, LatDeg, LatMn, LonDeg, LonMn) VALUES ('B', 1, 12.99, 103, 46.8)");
    }
  });
});

router.get('/api/nav-marks', (req, res) => {
  db.all('SELECT * FROM navmarks', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);  // Send the rows directly as JSON
  });
});

router.post('/api/nav-marks', (req, res) => {
  const { Name, LatDeg, LatMn, LonDeg, LonMn } = req.body;
  db.run(
    'INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES (?, ?, ?, ?, ?)',
    [Name, LatDeg, LatMn, LonDeg, LonMn],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, Name, LatDeg, LatMn, LonDeg, LonMn });
      console.log('Post request successful!')
    }
  );
});

router.patch('/api/nav-marks/:id', (req, res) => {
  const { id } = req.params;
  const { Name, LatDeg, LatMn, LonDeg, LonMn } = req.body;
  
  db.run(
    'UPDATE navmarks SET Name = ?, LatDeg = ?, LatMn = ?, LonDeg = ?, LonMn = ? WHERE id = ?',
    [Name, LatDeg, LatMn, LonDeg, LonMn, id],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'Nav mark not found' });
        return;
      }
      res.json({ id, Name, LatDeg, LatMn, LonDeg, LonMn });
      console.log('Nav Mark successfully added!')
    }
  );
});

router.delete('/api/nav-marks/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM navmarks WHERE id = ?', id, function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Nav mark not found' });
      return;
    }
    res.json({ message: 'Deleted successfully', changes: this.changes });
    console.log('Nav Mark deleted')
  });
});

router.get('/api/waypoints', (req, res) => {
  db.all('SELECT * FROM waypoints', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);  // Send the rows directly as JSON
  });
});

router.post('/api/waypoints', (req, res) => {
  const { Point, LatDeg, LatMn, LonDeg, LonMn } = req.body;
  db.run(
    'INSERT INTO waypoints (Point, LatDeg, LatMn, LonDeg, LonMn) VALUES (?, ?, ?, ?, ?)',
    [Point, LatDeg, LatMn, LonDeg, LonMn],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID });
      console.log('Waypoint Posted');
    }
  );
});

module.exports = router;