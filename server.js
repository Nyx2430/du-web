const express = require("express");
const mysql = require("mysql2");
const app = express();

app.use(express.json());
app.use(express.static(__dirname));

const db = mysql.createPool({
  host: "localhost", user: "root",
  password: "", database: "kniznica_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

db.getConnection((error, connection) => {
  if (error) console.error("Chyba databazy:", error.message);
  else {
    console.log("Databaza pripojena");
    connection.release();
  }
});

app.get("/api/knihi", (req, res) => {
  db.query("SELECT Id AS id, Nazov AS nazov, Autor AS autor, Rok AS rok, cena, vymazana FROM knihi ORDER BY Id", (error, knihi) => {
    if (error) {
      console.error("Chyba pri nacitani knih:", error.message);
      return res.status(500).send("Databaza je docasne nedostupna");
    }
    res.json(knihi);
  });
});

app.post("/api/knihi", (req, res) => {
  const { nazov, autor, rok, cena } = req.body;
  db.query("INSERT INTO knihi (nazov, autor, rok, cena) VALUES (?, ?, ?, ?)",
    [nazov, autor, rok, cena], error => {
      if (error) {
        console.error("Chyba pri pridavani knihy:", error.message);
        return res.status(500).send("Knihu sa nepodarilo pridat");
      }
      res.send("Kniha pridana");
    });
});

app.put("/api/knihi/:id", (req, res) => {
  const { nazov, autor, rok } = req.body;
  if (!nazov || !autor || !Number.isInteger(rok)) {
    return res.status(400).send("Neplatne udaje");
  }

  const sql = "UPDATE knihi SET nazov = ?, autor = ?, rok = ? WHERE id = ?";
  db.query(sql, [nazov, autor, rok, req.params.id], (error, vysledok) => {
    if (error) {
      console.error("Chyba pri zmene knihy:", error.message);
      return res.status(500).send("Chyba SQL");
    }
    if (!vysledok.affectedRows) return res.sendStatus(404);
    res.send("Kniha upravena");
  });
});

app.patch("/api/knihi/:id/cena", (req, res) => {
  const cena = Number(req.body.cena);
  if (!Number.isFinite(cena) || cena < 0) {
    return res.status(400).send("Neplatna cena");
  }

  const sql = "UPDATE knihi SET cena = ? WHERE id = ?";
  db.query(sql, [cena, req.params.id], (error, vysledok) => {
    if (error) {
      console.error("Chyba pri zmene ceny:", error.message);
      return res.status(500).send("Chyba SQL");
    }
    if (!vysledok.affectedRows) return res.sendStatus(404);
    res.send("Cena zmenena");
  });
});

app.delete("/api/knihi/:id", (req, res) => {
  db.query("UPDATE knihi SET vymazana = 1 WHERE id = ?", [req.params.id], error => {
    if (error) {
      console.error("Chyba pri mazani knihy:", error.message);
      return res.status(500).send("Knihu sa nepodarilo vymazat");
    }
    res.send("Kniha vymazana");
  });
});

app.patch("/api/knihi/:id/obnovit", (req, res) => {
  db.query("UPDATE knihi SET vymazana = 0 WHERE id = ?", [req.params.id], error => {
    if (error) {
      console.error("Chyba pri obnovení knihy:", error.message);
      return res.status(500).send("Knihu sa nepodarilo obnovit");
    }
    res.send("Kniha obnovena");
  });
});

app.use((req, res) => {
  res.status(404).sendFile(__dirname + "/404.html");
});

app.listen(3000, () => console.log("http://localhost:3000"));