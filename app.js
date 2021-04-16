var express = require('express');
var app = express();
var path = require('path');
const fs = require('fs');
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
let users=JSON.parse(userraw);

app.set('port', process.env.PORT || 3333);

app.use(express.static(__dirname + '/untitled_VR'));
app.get('/troisd', function(req, res){
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');   
  res.setHeader('Access-Control-Allow-Origin', 'http://192.168.8.104:3000');   
  
  res.sendFile(__dirname+'/untitled_VR/untitled_VR.65.html');  });
 //res.sendFile('/untitled_VR/untitled_VR.65.html',{ root: __dirname });  });


 


app.get('/', function(req, res){
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');   
res.setHeader('Access-Control-Allow-Origin', 'http://192.168.8.104:3000');   
res.type('text/plain');
res.send(R_state);  });

app.get('/:Relay', function(req, res){
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
res.setHeader('Access-Control-Allow-Origin', 'http://192.168.8.104:3000');     
res.type('text/plain');
console.log(R_state[req.params.Relay]);
res.send(R_state[req.params.Relay]); 





});

app.get('/set/:Relay', function(req, res){
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
res.setHeader('Access-Control-Allow-Origin', 'http://192.168.8.104:3000');   
R_state[req.params.Relay]="1";
res.type('text/plain');
console.log(R_state[req.params.Relay]);
res.send("value update to"+R_state[req.params.Relay]); });

app.get('/reset/:Relay', function(req, res){
res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); 
res.setHeader('Access-Control-Allow-Origin', 'http://192.168.8.104:3000');   
R_state[req.params.Relay]="0";
res.type('text/plain');
console.log(R_state[req.params.Relay]);
res.send("value updated to "+R_state[req.params.Relay]); });
    
  //http://localhost:3333/user/Admin/email  --> current email
  //http://localhost:3333/user/Admin/password --> current password
app.get('/user/:login/:email', function(req, res){
 res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');   
 res.setHeader('Access-Control-Allow-Origin', 'http://192.168.8.104:3000');   
 res.type('text/plain');
 res.send(users[req.params.login][req.params.email]);    
  });    
    
    
 // custom 404 page    
 
    
 
    


   




app.use(function(req, res){
res.type('text/plain');
res.status(404);
res.send('404 - Not Found');
});
// custom 500 page
app.use(function(err, req, res, next){
console.error(err.stack);
res.type('text/plain');
res.status(500);
res.send('500 - Server Error');
});
app.listen(app.get('port'), function(){
console.log( 'Express started on http://localhost:' +
app.get('port') + '; press Ctrl-C to terminate.' );
});



//added
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'fron-endapp/my-app/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'fron-endapp/my-app/build', 'index.html'));
  });
}


// ** MIDDLEWARE ** //
