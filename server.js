const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const path = require("path");

app.use(bodyParser.urlencoded());
app.use(express.static(__dirname + "./static"));
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/quoting_dojo', {useNewUrlParser: true});

const Schema = new mongoose.Schema({
    name: {type: String, required: true},
    quote: {type: String, required: true}
},{timestamps: true})
mongoose.model('Quote', Schema);
const Quote = mongoose.model('Quote')

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/quotes', function(req, res) {
    Quote.find({},function(err,quotes){
        console.log(quotes)
        if(err)
            console.log("Error matching DB request")
        else
            res.render('quotes', {all_quotes:quotes});
    }).sort({_id:-1});
});

app.post('/quotes', function(req, res) {
    const new_quote = new Quote({
    	name: req.body.name,
    	quote: req.body.quote
    });
    new_quote.save(function(err){
    	if(err)
    		errors = err;
    });
    Quote.find({},function(err,quotes){
        if(err)
            console.log("Error matching DB request")
        else
            res.render('quotes', {all_quotes:quotes});
    }).sort({_id:-1});
})

app.listen(8000, () => console.log("listening on port 8000"));