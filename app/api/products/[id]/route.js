// app/api/products/[id]/route.js
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

function db() {
  return new sqlite3.Database(path.join(process.cwd(), "data", "db.sqlite"));
}

export async function PUT(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  const body = await request.json();
  const { name, price, description } = body;
  const database = db();

  return new Promise((resolve) => {
    database.run(
      `UPDATE Products SET name=?, price=?, description=? WHERE id=?`,
      [name, price, description || "", params.id],
      function (err) {
        database.close();
        if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        resolve(NextResponse.json({ success: true }));
      }
    );
  });
}

export async function DELETE(request, { params: paramsPromise }) {
  const params = await paramsPromise;
  const database = db();
  return new Promise((resolve) => {
    database.run(`DELETE FROM Products WHERE id=?`, [params.id], function (err) {
      database.close();
      if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
      resolve(NextResponse.json({ success: true }));
    });
  });
}
