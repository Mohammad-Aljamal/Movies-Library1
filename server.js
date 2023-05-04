'use strict';
require("dotenv").config();
const express = require("express");

const dataJson = require ("./Movie Data/data.json");
const axios = require("axios");
const app = express();
const port = process.env.PORT;
const movieKey = process.env.API_KEY;
const cors = require('cors');
app.use(cors());
// app.use(errorHandler);

let result = [];

function LocalData (title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

    result.push(this);
}

function ApiData (id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function DiscoverData (title ,overview) {
    this.title= title;
    this.overview = overview;
}

//Routes

app.get('/',homeHandler);

app.get('/trending', trendingHandler);

app.get('/search', searchHandler);

app.get('/discover', discoverHandler);

app.get('/genres', genresHandler);

app.get('/favorite', favoriteHandler);


// app.use(notFoundHandler);


//Handlers

function homeHandler (req,res) {
    new LocalData (dataJson.title,dataJson.poster_path,dataJson.overview);
    res.send(result);
}

async function trendingHandler(req,res) {

    const url =`https://api.themoviedb.org/3/trending/all/week?api_key=${movieKey}&language=en-US`;
    let trendMovieFromApi = await axios.get(url);
    // console.log(trendMovieFromApi.Data);
    
    // res.send(trendMovieFromApi.Data)
    let MovieTrends = trendMovieFromApi.data.results.map((item) =>{
        return new ApiData (item.id, item.title, item.release_date, item.poster_path, item.overview);
    });


    res.send(MovieTrends);
}

function searchHandler (req,res) {

    let movieName = req.query.query;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${movieKey}&language=en-US&query=${movieName}`;

    axios.get(url).then ((result) => {
        res.send(result.data);
    })

}

function discoverHandler (req,res) {

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${movieKey}&language=en-US&include_adult=false&with_watch_monetization_types=flatrate`;


function discoverHandler (req,res) {

    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${movieKey}&language=en-US&include_adult=false&with_watch_monetization_types=flatrate`;

    axios.get(url).then ((result) => {
        let discover = result.data.results.map((item) => {
            return new DiscoverData (item.title, item.overview);
        })
        res.send(discover);
    });
}

function genresHandler (req,res) {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieKey}&language=en-US`;
    axios.get(url).then ((result) => {
        res.send(result.data);
    })

    axios.get(url).then ((result) => {
        let discover = result.data.results.map((item) => {
            return new DiscoverData (item.title, item.overview);
        })
        res.send(discover);
    });
}

function genresHandler (req,res) {
    const url = `https://api.themoviedb.org/3/genre/movie/list?api_key=${movieKey}&language=en-US`;
    axios.get(url).then ((result) => {
        res.send(result.data);
    })

}


function favoriteHandler (req,res)  {
    res.send('Welcome to Favorite Page');

}

// function notFoundHandler (req,res) {
//     res.status(404).send('page not found error');
// }

// function notFoundServer (req,res) {
//     res.status(500).send('Sorry, something went wrong');

// }

app.listen(port,() => {

    console.log(`im listen to port ${port}`)
});