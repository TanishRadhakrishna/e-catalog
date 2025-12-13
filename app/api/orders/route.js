// app/api/orders/route.js
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import path from "path";

function db() {
  return new sqlite3.Database(path.join(process.cwd(), "data", "db.sqlite"));
}

export async function POST(request) {
  const { items } = await request.json();
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "items array required" }, { status: 400 });
  }

  const database = db();
  return new Promise((resolve) => {
    database.serialize(() => {
      const stmt = database.prepare(`INSERT INTO Orders (product_id, quantity, total_price) VALUES (?, ?, ?)`);

      for (const item of items) {
        const qty = Number(item.quantity) || 0;
        const price = Number(item.price) || 0;
        stmt.run([item.product_id, qty, qty * price]);
      }

      stmt.finalize(() => {
        database.close();
        resolve(NextResponse.json({ success: true }));
      });
    });
  });
}

export async function GET() {
  const database = db();
  return new Promise((resolve) => {
    database.all(
      `SELECT o.*, p.name as product_name FROM Orders o JOIN Products p ON o.product_id = p.id ORDER BY o.created_at DESC`,
      [],
      (err, rows) => {
        database.close();
        if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        resolve(NextResponse.json(rows));
      }
    );
  });
}

export async function DELETE(request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  const all = url.searchParams.get("all");

  const database = db();
  return new Promise((resolve) => {
    database.serialize(() => {
      if (all === "true") {
        database.run(`DELETE FROM Orders`, [], (err) => {
          database.close();
          if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          resolve(NextResponse.json({ success: true, deleted: "all" }));
        });
      } else if (id) {
        database.run(`DELETE FROM Orders WHERE id = ?`, [id], function (err) {
          database.close();
          if (err) return resolve(NextResponse.json({ error: err.message }, { status: 500 }));
          resolve(NextResponse.json({ success: true, deleted: this.changes }));
        });
      } else {
        database.close();
        resolve(NextResponse.json({ error: "Provide ?id=<orderId> or ?all=true" }, { status: 400 }));
      }
    });
  });
}
