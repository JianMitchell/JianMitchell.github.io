import express from 'express';
import fetch from 'node-fetch';

const app = express();

const faker = (await import('@faker-js/faker')).faker;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async (req, res) => {
  try {
    let url = 'https://dummyjson.com/quotes/random';
    let response = await fetch(url);
    let data = await response.json();
    //console.log("fetching quote:", data);
    res.render("index", {quote: data});
  } catch (error) {
    console.error("Error fetching quote", error);
    res.render("index", {quote: null});
  }
});

// Waterfall route with faker data
app.get('/waterfall', (req, res) => {
  let projectData = {
    projectName: faker.company.catchPhrase(),
    projectManager: faker.person.fullName(),
    startDate: faker.date.past().toLocaleDateString(),
    endDate: faker.date.future().toLocaleDateString(),
    budget: faker.finance.amount(
        {min: 100000, max: 1000000, dec: 0, symbol: '$'}),
    teamSize: faker.number.int({min: 5, max: 20})
  };

  res.render('waterfall', {projectData});
});

// Agile route with GitHub API
app.get('/agile', async (req, res) => {
  try {
    let url = 'https://api.github.com/search/repositories?q=agile&sort=stars&order=desc&per_page=5';
    let response = await fetch(url);
    let data = await response.json();
    //console.log("Fetching GitHub data:", data);
    res.render('agile', {repos: data.items});
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    res.render('agile', {repos: []});
  }
});

// V-Model route with faker data
app.get('/vmodel', (req, res) => {
  let testingData = {
    tester: faker.person.fullName(),
    testCases: faker.number.int({min: 50, max: 200}),
    bugsFound: faker.number.int({min: 5, max: 30}),
    testEnvironment: faker.helpers.arrayElement(
        ['Development', 'Staging', 'Production']),
    lastTestDate: faker.date.recent().toLocaleDateString()
  };

  res.render('vmodel', {testingData});
});

// Resources route with DummyJSON API and Faker
app.get('/resources', async (req, res) => {
  let bookData = {
    title: faker.book.title(),
    author: faker.book.author(),
    publisher: faker.book.publisher(),
    isbn: faker.commerce.isbn(),
    publishDate: faker.date.past({ years: 5 }).toLocaleDateString(),
    pages: faker.number.int({ min: 200, max: 600 })
  };

  try {
    let url = 'https://dev.to/api/articles?tag=programming&per_page=1';
    let response = await fetch(url);
    let data = await response.json();
    console.log("Fetching articles:", data);
    res.render('resources', { bookData: bookData, article: data[0] });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.render('resources', { bookData: bookData, article: null });
  }
});

app.listen(3000, () => {
  console.log('server started');
});