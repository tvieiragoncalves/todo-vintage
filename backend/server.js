const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

app.use(express.json());
app.use(express.static("public"));

const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS categorias (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tarefas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    texto TEXT,
    categoria_id INTEGER
  )`);

  db.run(`INSERT OR IGNORE INTO categorias (id, nome) VALUES (1, 'Trabalho'), (2, 'Pessoal')`);
});

app.get("/categorias", (req, res) => {
  db.all("SELECT * FROM categorias", (err, rows) => res.json(rows));
});

app.get("/tarefas/:categoria", (req, res) => {
  db.all(
    "SELECT * FROM tarefas WHERE categoria_id = ?",
    req.params.categoria,
    (err, rows) => res.json(rows)
  );
});

app.post("/tarefas", (req, res) => {
  db.run(
    "INSERT INTO tarefas (texto, categoria_id) VALUES (?, ?)",
    [req.body.texto, req.body.categoria]
  );
  res.sendStatus(200);
});

app.delete("/tarefas/:id", (req, res) => {
  db.run("DELETE FROM tarefas WHERE id = ?", req.params.id);
  res.sendStatus(200);
});

app.listen(3000, () => console.log("Servidor a correr em http://localhost:3000"));
app.put("/tarefas/:id", (req, res) => {
    db.run(
      "UPDATE tarefas SET texto = ? WHERE id = ?",
      [req.body.texto, req.params.id]
    );
    res.sendStatus(200);
  });