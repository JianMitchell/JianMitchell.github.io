import express from 'express';
import mysql from 'mysql2/promise';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
  host: "uc13jynhmkss3nve.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
  user: "u1660n1g72lcn6nw",
  password: "g63shif06utk2vrg",
  database: "ag02lutyzmo9f9hc",
  connectionLimit: 10,
  waitForConnections: true
});

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/author/new', (req, res) => {
  res.render("newAuthor");
});

app.post("/author/new", async function(req, res){
  let fName = req.body.fName;
  let lName = req.body.lName;
  let birthDate = req.body.dob;
  let deathDate = req.body.dod;
  let sex = req.body.sex;
  let profession = req.body.profession;
  let country = req.body.country;
  let portrait = req.body.portrait;
  let biography = req.body.biography;

  let sql = `INSERT INTO q_authors
             (firstName, lastName, dob, dod, sex, profession, country, portrait, biography)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  let params = [fName, lName, birthDate, deathDate, sex, profession, country, portrait, biography];

  try {
    const [rows] = await pool.query(sql, params);
    res.render("newAuthor", {"message": "Author added!"});
  } catch (error) {
    res.render("newAuthor", {"message": "Error adding author: " + error.message})
  }
});

app.post('/author/edit', async (req, res) => {
  let sql = `UPDATE q_authors
  SET firstName = ?,
      lastName = ?,
      dob = ?,
      dod = ?,
      sex = ?,
      profession = ?,
      country = ?,
      portrait = ?,
      biography = ?
    WHERE authorId = ?`;
  let params = [
    req.body.fName,
    req.body.lName,
    req.body.dob,
    req.body.dod,
    req.body.sex,
    req.body.profession,
    req.body.country,
    req.body.portrait,
    req.body.biography,
    req.body.authorId
  ];

  try {
    const [rows] = await pool.query(sql, params);
    res.redirect('/authors');
  } catch (error) {
    res.status(500).send('Error updating author: ' + error.message);
  }
});

app.post('/quote/new', async (req,  res) => {
  let quote = req.body.quote;
  let authorId = req.body.authorId;
  let category = req.body.category;
  let likes = req.body.likes || 0;

  let sql = `INSERT INTO q_quotes
  (quote, authorId, category, likes)
  VALUES(?, ?, ?, ?)`;

  let sql2 = `SELECT authorId, firstName, lastName
  FROM q_authors 
  ORDER BY lastName`;

  let categorySql = `SELECT DISTINCT category
  FROM q_quotes
  WHERE category IS NOT NULL AND category != ''
  ORDER BY category`;

  let params = [quote, authorId, category, likes];

  try {
    const [rows] = await pool.query(sql, params);
    const [authors] = await pool.query(sql2);
    const [categories] = await pool.query(categorySql);
    res.render('newQuote', {authors:authors, categories: categories, message:'Quote added!'});
  } catch (error) {
    res.render("newQuote", {"message": "Error adding quote: " + error.message})
  }
});

app.post('/quote/edit', async (req, res) => {
  let sql = `UPDATE q_quotes
  SET quote = ?,
      authorId = ?,
      category = ?,
      likes = ?
      WHERE quoteId = ?`;

  let params = [
      req.body.quote,
      req.body.authorId,
      req.body.category,
      req.body.likes,
      req.body.quoteId];

  try {
    const [rows] = await pool.query(sql, params);
    res.redirect('/quotes');
  } catch (error) {
    res.status(500).send('Error updating quote: ' + error.message);
  }
});

app.get("/authors", async function(req, res){
  let sql = `SELECT *
            FROM q_authors
            ORDER BY lastName`;
  const [rows] = await pool.query(sql);
  res.render("authorList", {"authors":rows});
});

app.get("/author/edit", async function(req, res){


  let authorId = req.query.authorId;


  let sql = `SELECT *, 
        DATE_FORMAT(dob, '%Y-%m-%d') dobISO,
        DATE_FORMAT(dod, '%Y-%m-%d') dodISO
        FROM q_authors
        WHERE authorId =  ?`;
  let params = [authorId];
  const [rows] = await pool.query(sql, params);
  res.render("editAuthor", {"authorInfo":rows});
});

app.get('/author/delete', async (req, res) => {
  let authorId = req.query.authorId;

  let sql = `DELETE FROM q_authors WHERE authorId = ?`;

  let params = [authorId];

  const [rows] = await pool.query(sql, params);

  res.redirect('/authors');
});

app.get('/quote/new', async (req, res) => {
  let sql = `SELECT authorId, firstName, lastName
  FROM q_authors 
  ORDER BY lastName`;

  let categorySql = `SELECT DISTINCT category
  FROM q_quotes
  WHERE category IS NOT NULL AND category != ''
  ORDER BY category`;

  const [rows] = await pool.query(sql);
  const [categories] = await pool.query(categorySql);

  res.render('newQuote', {authors: rows, categories: categories})
});

app.get('/quotes', async (req, res) => {
  let sql = `SELECT q.quoteId, q.quote, q.category, q.likes, a.firstName, a.lastName, a.authorId
  FROM q_quotes q
  INNER JOIN q_authors a ON q.authorId = a.authorId
  ORDER BY a.lastName`;

  const [rows] = await pool.query(sql);
  res.render('quoteList', {quotes: rows});
});

app.get('/quote/edit', async (req, res) => {
  let quoteId = req.query.quoteId;

  let sql = `SELECT *
  FROM q_quotes
  WHERE quoteId = ?`;

  let sql2 = `SELECT authorId, firstName, lastName
  FROM q_authors
  ORDER BY lastName`;

  let categorySql = `SELECT DISTINCT category
  FROM q_quotes
  WHERE category IS NOT NULL AND category != ''
  ORDER BY category`;

  let params = [quoteId];

  const [rows] = await pool.query(sql, params);
  const [authors] = await pool.query(sql2);
  const [categories] = await pool.query(categorySql);

  res.render('editQuote', {quoteInfo:rows, authors:authors, categories: categories});
});

app.get('/quote/delete', async (req, res) => {
  let quoteId = req.query.quoteId;

  let sql = `DELETE FROM q_quotes WHERE quoteId = ?`;

  let params = [quoteId];

  const [rows] = await pool.query(sql, params);
  res.redirect('/quotes');
});

app.get("/dbTest", async(req, res) => {
  try {
    const [rows] = await pool.query("SELECT CURDATE()");
    res.send(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});//dbTest

app.listen(3000, ()=>{
  console.log("Express server running")
});