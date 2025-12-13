// app/api/products/route.js
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

function db() {
  return new sqlite3.Database(path.join(process.cwd(), "data", "db.sqlite"));
}

export async function GET(request) {
  const database = db();
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  const sql = q ? `SELECT * FROM Products WHERE name LIKE ? ORDER BY id DESC` : `SELECT * FROM Products ORDER BY id DESC`;
  const params = q ? [`%${q}%`] : [];

  return new Promise((resolve) => {
    database.all(sql, params, (err, rows) => {
      database.close();
      if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      resolve(NextResponse.json(rows));
    });
  });
}

export async function POST(request) {
  const body = await request.json();
  const { name, price, description } = body;

  if (!name || price === undefined) {
    return NextResponse.json({ error: "name and price required" }, { status: 400 });
  }

  const database = db();
  return new Promise((resolve) => {
    database.run(
      `INSERT INTO Products (name, price, description) VALUES (?, ?, ?)`,
      [name, price, description || ""],
      function (err) {
        database.close();
        if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        resolve(NextResponse.json({ id: this.lastID, name, price, description }));
      }
    );
  });
}
