/*const http = require('http')
const port = 8080
  
// Create a server object:
const server = http.createServer(function (req, res) {
  
    // Write a response to the client
    res.write('Hello World')
  
    // End the response 
    res.end()
})
  
// Set up our server so it will listen on the port
server.listen(port, function (error) {
  
    // Checking any error occur while listening on port
    if (error) {
        console.log('Something went wrong', error);
    }
    // Else sent message of listening
    else {
        console.log('Server is listening on port' + port);
    }
})*/
//require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//Connection to MySQL database

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    port:'3306',
    database: 'medical'
  });
  db.getConnection( (err, connection)=> {
    if (err) throw (err)
    console.log ("DB connected successful: " + connection.threadId)
 })
 
 // Sign up new users

 app.post('/register', function(req, res) {
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email
  };
  db.query('INSERT INTO users SET ?', user, function (error, result) {
    if (error) throw error;
  return res.send({ error: false, data: result, message: 'user has been inserted successfully.' });
  });
});
//LOGIN 
app.post('/signin', function(req, res) {
    var username=req.body.username;
    var password=req.body.password;
    db.query('SELECT * FROM login WHERE username = ?',[username],function(error, results, fields){
      if(error){
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
        if(results.length >0){
            if(password==results[0].password){
                res.json({
                    status:true,
                    message:'successfully authenticated'
                })
            }else{
                res.json({
                  status:false,
                  message:"username and password does not match"
                 });
            }
         
        }
        else{
          res.json({
              status:false,    
            message:"username does not exits"
        });
        }
      }
    });
});

//RETRIEVE ALL USERS
app.get('/users', function (req, res) {
  db.query('SELECT * FROM users', function (error, results, fields) {
  if (error) throw error;
  return res.send({ error: false, data: results, message: 'users list.' });
  });
  });

// RETRIEVE USER WITH ID
app.get('/user/:id', function (req, res) {
  let user_id = req.params.id;
  if (!user_id) {
  return res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  db.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
  if (error) throw error;
  return res.send({ error: false, data: results[0], message: 'user based on id.' });
  });
  });
  // UPDATE USER WITH ID
  app.put('/userupdate', function (req, res) {
  let user_id = req.body.id;
  let user = req.body.user;
  if (!user_id || !user) {
  return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
  }
  dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
  if (error) throw error;
  return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
  });
  });
  // DELETE USER
  app.delete('/userdelete/:id', function (req, res) {
  let user_id = req.params.id;
  if (!user_id) {
  return res.status(400).send({ error: true, message: 'Please provide user_id' });
  }
  db.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
  if (error) throw error;
  return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
  });
  }); 

  app.listen(3000, function() {
    console.log("Server started on port 3000");
  });