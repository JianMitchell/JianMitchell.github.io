import express from 'express';
import fetch from 'node-fetch';

const app = express();
const planets =  (await import ('npm-solarsystem')).default;

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get('/', async (req, res) => {
  try {
    let apiKey = "7756a1e81f817c186cf57294e1c19b37b49c54b8f34e7c499ee0ce5cd86cd16e";
    let url = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&featured=true&query=solar-system`;
    let response =  await fetch(url);
    let data = await  response.json();
    let randomImage = data.urls.full;
    res.render("index", {image: randomImage });
  } catch (error) {
    console.error("Error fetching random image:", error);
    res.render("index", {image: "/img/solar-system.jpg"})
  }
});

app.get('/nasa', async (req, res) => {
  try {
    let nasaApiKey = "9mUzIkhlZCZaOoMfspg7jMmwZCZ4LiRHtkgkambD";
    let today = new Date().toISOString().split('T')[0];
    let url = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}&date=${today}`;
    let response = await fetch(url);
    let data = await response.json();
    res.render("nasa", {nasaData: data });
  } catch (error) {
    console.error("Error fetching NASA data:",  error);
    res.render("nasa", {nasaData: null });
  }
});

app.get('/mercury',  (req, res) => {
  let planetInfo = planets.getMercury();
  res.render('planet', {planetInfo, planetName: 'Mercury'});
});

app.get('/venus', (req, res) => {
  let planetInfo = planets.getVenus();
  res.render('planet', {planetInfo, planetName: 'Venus'});
});

app.get('/earth', (req, res) => {
  let planetInfo = planets.getEarth();
  res.render('planet', {planetInfo, planetName: 'Earth'});
});

app.get('/mars', (req, res) =>  {
  let planetInfo = planets.getMars();
  res.render('planet', {planetInfo, planetName: 'Mars'});
});

app.get('/jupiter', (req, res) => {
  let planetInfo = planets.getJupiter();
  res.render('planet', {planetInfo, planetName: 'Jupiter'});
});

app.get('/saturn', (req, res) => {
  let planetInfo = planets.getSaturn();
  res.render('planet', {planetInfo, planetName: 'saturn'});
});

app.get('/uranus', (req, res) => {
  let planetInfo = planets.getUranus();
  res.render('planet', {planetInfo, planetName: 'Uranus'});
});

app.get('/neptune', (req, res) => {
  let planetInfo = planets.getNeptune();
  res.render('planet', {planetInfo, planetName: 'Neptune'});
});

app.listen(3000, () => {
  console.log('server started');
});