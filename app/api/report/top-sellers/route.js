
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

function db() {
  return new sqlite3.Database(path.join(process.cwd(), "data", "db.sqlite"));
}

export async function GET() {
  const database = db();
  const sql = `
    SELECT p.id, p.name, p.price, IFNULL(SUM(o.quantity),0) AS quantity_sold, IFNULL(SUM(o.total_price),0) AS revenue
    FROM Products p
    LEFT JOIN Orders o ON o.product_id = p.id
    GROUP BY p.id
    ORDER BY quantity_sold DESC
    LIMIT 5
  `;
  return new Promise((resolve) => {
    database.all(sql, [], (err, rows) => {
      database.close();
      if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      resolve(NextResponse.json(rows));
    });
  });
}
