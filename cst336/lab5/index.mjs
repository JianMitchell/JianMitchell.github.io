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

//routes
app.get('/', async(req, res) => {
  try {
    let sql = `SELECT authorId, firstName, lastName
                    FROM q_authors
                    ORDER BY lastName`;
    const [rows] = await pool.query(sql);
    res.render('index', {authors:rows});
  } catch (error) {
   console.error("Error fetching authors", error);
   res.render('index', {authors:[]});
  }
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

app.get('/searchByKeyword', async(req, res) => {
  let keyword = req.query.keyword;

  try {
    let sql = `SELECT authorId, firstName, lastName, quote
                    FROM q_quotes
                    NATURAL JOIN q_authors
                    WHERE quote LIKE ?`;
    let sqlParams = [`%${keyword}%`];
    const [rows] = await pool.query(sql, sqlParams);
    res.render('results', {quotes:rows});
  } catch (error) {
    console.error("Error searching by keyword:", error);
    res.render('results')
  }
});

app.get('/searchByAuthor', async(req, res) => {
  let userAuthorId = req.query.authorId;

  try {
    let sql = `SELECT authorId, firstName, lastName, quote
                    FROM q_quotes
                    NATURAL JOIN q_authors
                    WHERE authorId = ?`;
    let sqlParams = [userAuthorId];
    const [rows] = await pool.query(sql, sqlParams);
    res.render("results", {quotes:rows});
  } catch (error) {
    console.error("Error searching by author:", error);
    res.render('results', {quotes:[]});
  }
});

app.get('/api/author/:id', async (req, res) => {
  let authorId = req.params.id;

  try {
    let sql = `SELECT *
                    FROM q_authors
                    WHERE authorId = ?`;
    const [rows] = await pool.query(sql, [authorId]);
    res.send(rows);
  } catch (error) {
    console.error("Error fetching author info:", error);
  }
});

app.listen(3000, ()=>{
  console.log("Express server running")
});