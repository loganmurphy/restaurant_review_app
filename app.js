// The app should meet the following requirements:
//
// URL /todos should list all your ToDos
// URL /todos/add should have a form which lets you add a ToDo
// URL /todo/done/:id should mark a ToDo as done.


var express = require('express');
var db = require('./models');
var passhelper = require('pbkdf2-helpers');
var morgan = require('morgan');
var session = require('express-session');
var app = express();

app.use(express.static('public'));
const body_parser = require('body-parser');
app.use(body_parser.urlencoded({extended: false}));
app.use(morgan('dev'));
app.use(session({
  secret: process.env.SECRET_KEY || 'dev',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000}
}));
app.set('view engine', 'hbs');


// // Or in two steps
// var hash = passhelper.create_hash('hotdog');
// var db_storage_text = passhelper.generate_storage(hash);
//
// // Comparing a hash object
// passhelper.matches('hotdog', hash);
// // returns true

app.get('/', function(request, response){
  var context = {title: 'login'}
  response.render('login.hbs', context);
});

app.post('/login/user', function(request, response){
  let username = request.body.username
  let password = request.body.password
  db.reviewer.findOne({where: {username: username}})
    .then(function(results){
      // console.log(results.password)
      if(passhelper.matches(password, results.password)){
        request.session.user = results;
      response.redirect('/home')
    } else {
      response.redirect('/login')
    }
  });
});

app.post('/login/new-user', function(request, response){
  let name = request.body.name;
  let email = request.body.email;
  let username = request.body.username;
  let password = passhelper.generate_storage(request.body.password);
  // console.log("username", username)
  // console.log("the hash", password)
  db.reviewer.create({name: name, email: email, username: username, password: password})
    .then(function(results){
      response.redirect('/login');
    })
});

app.get('/home', function(request, response){
  let username = request.session.user.username;
  console.log(username)
  var context = {title: 'home ', username: username};
  response.render('index.hbs', context);
});

app.get('/search', function(request, response){
  var search = request.query.search
  db.restaurant.findAll({where: {name: { $iLike: '%' + search }}})
  .then(function (results){
    var res = results;
    var context = {title: 'Search Results', searchTerm: search, results: res};
    response.render('search.hbs', context);
  })
});

app.get('/restaurants/:id', function(request, response, next){
  let restaurant_id = request.params.id
  let restaurant;
  //let reviewer_id = request.session.user.id

  db.restaurant.findOne({where: {id: restaurant_id}})
  .then(function (results){
    // console.log(results.id);
    restaurant = results;
    return restaurant.get_reviews();
  })
  .then(function (reviews) {
    let context = {restaurant: restaurant, reviews: reviews, title: 'restaurant'};
    response.render('restaurants.hbs', context);
  })
  .catch(next);
});

app.post('/restaurants/:id/review', function(request, response){
  let rest_id = request.params.id;
  let reviewer_id = request.session.user.id
  let stars = request.body.star;
  let title = request.body.title;
  let review = request.body.review;
  db.review.create({restaurantId: rest_id, reviewerId: reviewer_id, stars: stars,  title: title, review: review})
    .then(function(results){
      response.redirect('/restaurants/' + rest_id);
    })
});

app.get('/restaurant/new', function(request, response){
  var context = {title: 'new restaurant'}
  response.render('new.hbs', context );
});

app.post('/restaurant/new', function(request, response){
  let name = request.body.name;
  let address = request.body.address;
  let category = request.body.category;
  db.restaurant.create({name: name, address: address, category: category})
    .then(function(results){
      response.redirect('/restaurant/new');
    });
});

var PORT = process.env.PORT || 8000;
app.listen(PORT, function () {
  console.log('Your app is up on port ' + PORT);
});
