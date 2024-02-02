import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const db = new pg.Client({
  user: PG_USER,
  host: PG_HOST,
  database: PG_DATABASE,
  password: PG_PASSWORD,
  port: PG_HOST,
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];

app.get("/", async (req, res) => {
  const result = await db.query("SELECT * FROM items");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
  await db.query("INSERT INTO items(title) VALUES($1)", [item] );
  res.redirect("/");
});

app.post("/edit", async (req, res) => {
  const itemId = req.body.updatedItemId;
  const item = req.body.updatedItemTitle;
  await db.query("UPDATE items SET title = $1 WHERE id = $2", [item, itemId] );
  res.redirect("/");
});

app.post("/delete", async (req, res) => {
  const itemId = req.body.deleteItemId;
  await db.query("DELETE FROM items WHERE id = $1", [itemId] );
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
