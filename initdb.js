import sqlite3 from 'sqlite3';

// Connect to the database
const db = new sqlite3.Database('./server/database.sqlite');

// Create table and insert sample data
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS navmarks (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          Name TEXT,
          LatDeg INTEGER,
          LatMn REAL,
          LonDeg INTEGER,
          LonMn REAL
        )
    `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table created or already exists.');
      insertSampleData();
    }
  });
});

// Function to insert sample data
function insertSampleData() {
  const sampleData = [
    { Name: 'Sentosa', LatDeg: 1, LatMn: 15.298, LonDeg: 103, LonMn: 49.056 },
    { Name: 'Sentosa', LatDeg: 1, LatMn: 15.298, LonDeg: 103, LonMn: 49.056 },
    { Name: 'Sentosa', LatDeg: 1, LatMn: 15.298, LonDeg: 103, LonMn: 49.056 },
    // Add more sample data as needed
    // db.run("INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES (Sentosa, 1, 15.298, 103, 49.056)");
    // db.run("INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES (Bukom Tw, 1, 13.625, 103, 46.625)");
    // db.run("INSERT INTO navmakrs (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES (NE Semakau, 1, 12.641, 103, 46.804)")
  ];

  sampleData.forEach((row) => {
    db.run(
      'INSERT INTO navmarks (Name, LatDeg, LatMn, LonDeg, LonMn) VALUES (?, ?, ?, ?, ?)',
      [row.Name, row.LatDeg, row.LatMn, row.LonDeg, row.LonMn],
      function (err) {
        if (err) {
          console.error('Error inserting sample data:', err.message);
        }
      }
    );
  });

  console.log('Sample data inserted.');
}

// Close the database connection after the operations are complete
db.close((err) => {
  if (err) {
    console.error('Error closing the database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});