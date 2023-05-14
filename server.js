'use strict';
require("dotenv").config();
const express = require("express");

const dataJson = require ("./Movie_Data/data.json");
const axios = require("axios");
const pg = require("pg");      //sql
const clinet = new pg.Client(process.env.DATABASE_URL); //sql
const app = express();
const port = process.env.PORT;
const movieKey = process.env.API_KEY;
const cors = require('cors');
app.use(cors());
app.use(express.json());    //to allow the server to read req.body
// app.use(errorHandler);

let result = [];

function LocalData (title,poster_path,overview){
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;

    result.push(this);
}

// app.use(notFoundHandler);
// function notFoundHandler (req,res) {
//     res.status(404).send('page not found error');
// }

// function notFoundServer (req,res) {
//     res.status(500).send('Sorry, something went wrong');

// }


function ApiData (id, title, release_date, poster_path, overview){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function MovieComments (id, title, release_date, poster_path, overview,comments){
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
    this.comments = comments;
}

function DiscoverData (title ,overview) {
    this.title= title;
    this.overview = overview;
}

//Routes

app.get('/',homeHandler);

app.get('/trending', trendingHandler); //API

app.get('/search', searchHandler);     //API

app.get('/discover', discoverHandler); //API

app.get('/genres', genresHandler);     //API

app.post('/addMovie',addMovie);        //sql

app.get('/getMovies',getMovie);        //sql

app.put('/update/:id',updateMovie);    //sql

app.delete('/delete/:id',deleteMovie);    //sql

app.get('/getMovie/:id', getMoviebyid);


// app.use(notFoundHandler);sssssssssssssss


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

function addMovie (req,res){
    const movie = req.body;
    const sql = 'INSERT into movie (title,comments) values ($1,$2);';
    const values = [movie.title , movie.comments];
    clinet.query(sql , values).then(()=>{
        res.send("added");
    })
}

function getMovie (req,res){
    const sql = 'select * from movie';
    clinet.query(sql).then((data)=>{
        let movieComm = data.rows.map((item)=>{
            return new MovieComments(
                item.id ,
                item.title,
                item.release_date,
                item.poster_path,
                item.overview,
                item.comments)
        })

        res.send(movieComm);
    })
}

function updateMovie (req,res){
    const movieId = req.params.id;
    const sql = `update movie set title=$1,release_date=$2,poster_path=$3,overview=$4,comments=$5 where id=${movieId} returning *;`;

    const values = [req.body.title, req.body.release_date, req.body.poster_path, req.body.overview, req.body.comments];
    clinet.query(sql,values).then((data) => {
        res.status(201).send(data.rows);
    
    })

}

function deleteMovie (req,res){

    const movieId = req.params.id;
    const sql = `delete from movie where id=${movieId};`;

    clinet.query(sql).then((data) => {
        res.status(202).send('deleted');
    
    })

}

function getMoviebyid (req,res){
    const movieId = req.params.id;
    const sql =`select * from movie where id=${movieId};`

    clinet.query(sql).then((data) => {
        res.send(data.rows)
    })

}






// function notFoundHandler (req,res) {
//     res.status(404).send('page not found error');
// }

// function notFoundServer (req,res) {
//     res.status(500).send('Sorry, something went wrong');

// }

clinet.connect().then(()=>{
    app.listen(port,() => {

        console.log(`im listen to port ${port}`)
    });
});