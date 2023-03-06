//Register user
app.post("/signup", async (req,res) => {
    const user = req.body.name;
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    db.getConnection( async (err, connection) => {
     if (err) throw (err)
     const sqlSearch = "SELECT * FROM users WHERE firstname = ?"
     const search_query = mysql.format(sqlSearch,[user])
     const sqlInsert = "INSERT INTO users VALUES (0,?,?,?)"
     const insert_query = mysql.format(sqlInsert,[user, hashedPassword])
     // ? will be replaced by values
     // ?? will be replaced by string
     await connection.query (search_query, async (err, result) => {
      if (err) throw (err)
      console.log("------> Search Results")
      console.log(result.length)
      if (result.length != 0) {
       connection.release()
       console.log("------> User already exists")
       res.sendStatus(409) 
      } 
      else {
       await connection.query (insert_query, (err, result)=> {
       connection.release()
       if (err) throw (err)
       console.log ("--------> Signed up new User")
       console.log(result.insertId)
       res.sendStatus(201)
      })
     }
    }) //end of connection.query()
    }) //end of db.getConnection()
    }) //end of app.post()








    //Get all users from the database
app.get("/users", (req, res) => {
    db.query("SELECT * from users", (error, data) => {
      if (error) {
        return res.json({ status: "ERROR", error });
      }
  
      return res.json(data);
    });
  });
//Add new empoyee to the database

app.post("/users", function (req, res) {
    let newUser = { ...req.body };
  
    db.query("INSERT INTO users SET ?", newUser, (error, result) => {
      if (error) {
        return res.status(500).json({ status: "ERROR", error });
      }
  
      return res.json({ status: "SUCCESS" });
    });
  });
//Get single employee by id from the database
app.get('users/search/:id', function (req, res) {});
//Update single employee by id from the database
app.put('users/update/:id', function (req, res) {});
//Delete single employee by id from the database
app.delete('users/delete/:id', function (req, res) {});