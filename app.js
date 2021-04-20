var express = require('express');
var app = express();
var path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const crpt = require('crypto');
const dotenv = require('dotenv');
var cors = require('cors');
const localStorage = require("localStorage");
var sessionstorage = require('sessionstorage');
//jwt begin

dotenv.config();
process.env.TOKEN_SECRET;
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '24h' });
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
    console.log(err);

    if (err) return res.sendStatus(403);

    req.user = user;

    next();
  });
}

//jwt end
let student = {
  name: 'Mike',
  age: 23,
  gender: 'Male',
  department: 'English',
  car: 'Honda'
};
let data = JSON.stringify(student, null, 2);
var http = require('http').Server(app);
var io = require('socket.io')(http);

let rawdata = fs.readFileSync('relaystate.json');
let R_state = JSON.parse(rawdata);
console.log(R_state["relay"]);
// read userfile
let userraw = fs.readFileSync('users.json');
let users = JSON.parse(userraw);

app.set('port', process.env.PORT || 3333);

app.use(express.static(__dirname + '/untitled_VR'));

//jwt get sample begin
app.post('/api/login', function (req, res) {
  console.log(req.body.password);
  console.log(users.Admin.password);
  console.log(req.body.email);
  console.log(users.Admin.email);

  if ((users.Admin.email === req.body.email) && (users.Admin.password === req.body.password)) {
    console.log("true")
    const token = generateAccessToken({ username: req.body.email });
    res.cookie('auth11', token,{
      expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
    ,Domain: 'frontend28.herokuapp.com',encode: String});
    //sessionstorage.setItem('auth', token);
    //console.log(localStorage.getItem('auth', token));
    // console.log("wsol houni")
    //if (typeof window !== "undefined") {
    // window.localStorage.setItem('auth', "token");
    //window.localStorage.getItem('auth');
    //}
    console.log(token);

    res.redirect(303, 'https://frontend28.herokuapp.com/entered');
   
  } else res.send("o93ed 3asba");

});


//jwt get sample end




app.get('/troisd', function (req, res) {
  // res.setHeader('Access-Control-Allow-Origin', 'https://frontend28.herokuapp.com');   
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

  res.sendFile(__dirname + '/untitled_VR/untitled_VR.65.html');
});
//res.sendFile('/untitled_VR/untitled_VR.65.html',{ root: __dirname });  });



//for deployement BEGIN//
app.use(express.static(path.join(__dirname, 'build')));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
  //res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//for deployement END//

app.get('/SU', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend28.herokuapp.com');

  res.type('text/plain');
  res.send(R_state);
});

app.get('/:Relay', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

  res.type('text/plain');
  console.log(R_state[req.params.Relay]);
  res.send(R_state[req.params.Relay]);





});

app.get('/set/:Relay', authenticateToken, (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://frontend28.herokuapp.com');
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

  R_state[req.params.Relay] = "1";
  res.type('text/plain');
  console.log(R_state[req.params.Relay]);
  res.send("value update to" + R_state[req.params.Relay]);
});

app.get('/reset/:Relay', authenticateToken, function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

  R_state[req.params.Relay] = "0";
  res.type('text/plain');
  console.log(R_state[req.params.Relay]);
  res.send("value updated to " + R_state[req.params.Relay]);
});

//https://backedn.herokuapp.com/user/Admin/email  --> current email
//https://backedn.herokuapp.com/user/Admin/password --> current password
app.get('/user/:login/:email', function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");

  res.type('text/plain');
  res.send(users[req.params.login][req.params.email]);
});


// custom 404 page    











app.use(function (req, res) {
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});
// custom 500 page
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.type('text/plain');
  res.status(500);
  res.send('500 - Server Error');
});
app.listen(app.get('port'), function () {
  console.log('Express started on https://backedn.herokuapp.com:' +
    app.get('port') + '; press Ctrl-C to terminate.');
});



//added
// if (process.env.NODE_ENV === 'production') {
//   // Serve any static files
//   app.use(express.static(path.join(__dirname, 'fron-endapp/my-app/build')));
//   // Handle React routing, return all requests to React app
//   app.get('*', function (req, res) {
//     res.sendFile(path.join(__dirname, 'fron-endapp/my-app/build', 'index.html'));
//   });
// }


// ** MIDDLEWARE ** //
//for deployement BEGIN//
app.use(express.static(path.join(__dirname, 'build')));


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/build/index.html');
  //res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
//for deployement END//