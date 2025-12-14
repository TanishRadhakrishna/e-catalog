// data/init-db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbFile = path.join(__dirname, "db.sqlite");
const dbExists = fs.existsSync(dbFile);

const db = new sqlite3.Database(dbFile);

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS Products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      price REAL NOT NULL,
      description TEXT
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS Orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      total_price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES Products(id)
    );
  `);

 
  db.get("SELECT COUNT(*) as c FROM Products", (err, row) => {
    if (err) return console.error(err);
    if (row.c === 0) {
      const stmt = db.prepare("INSERT INTO Products (name, price, description) VALUES (?, ?, ?)");
      const seed = [
        ["Fresh Milk 1L", 60.0, "Dairy farm fresh milk 1 liter"],
        ["Paneer 200g", 200.0, "Cottage cheese, fresh"],
        ["Yogurt 500g", 80.0, "Natural yogurt"],
        ["Butter 250g", 140.0, "Creamy butter"],
        ["Cheese Slice 10pcs", 180.0, "Processed cheese slices"]
      ];
      seed.forEach(s => stmt.run(s[0], s[1], s[2]));
      stmt.finalize(() => {
        console.log("Seeded Products.");
        db.close();
      });
    } else {
      console.log("Products already seeded.");
      db.close();
    }
  });
});
