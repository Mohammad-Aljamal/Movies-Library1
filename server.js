'use strict'

const express = require("express");
const dataJson = require ("./data.json");
const app = express();
const port = 3001;
// const cors = require('cors');
// app.use(cors());

let result = [];
function Data (title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

    result.push(this);
}


app.get('/',(req,res) => {

    new Data (dataJson.title,dataJson.poster_path,dataJson.overview);
    res.send(result);


})

app.get('/favorite', (req,res) => {
    res.send('Welcome to Favorite Page');

})

app.use(notFoundHandler);
function notFoundHandler (req,res) {
    res.status(404).send('page not found error');
}

function notFoundServer (req,res) {
    res.status(500).send('Sorry, something went wrong');

}

app.listen(port,() => {

    console.log(`im listen to port ${port}`)
});