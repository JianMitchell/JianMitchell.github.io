import express from 'express';
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.send('Hello Express app!')
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started`);
});