const mysql = require('mysql2');
const { faker } = require('@faker-js/faker');
const express = require("express");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuidv4 } = require("uuid");


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
// Function to generate random user data
//let getRandomUser = () => {
// return [
//    faker.string.uuid(),
//   faker.internet.userName(),
//  faker.internet.email(),
//  faker.internet.password()
//];
//}

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'sqlday',
    password: 'bsacet',
});

//let q = "INSERT INTO user (id, username, email, password) VALUES ? ";

////let data = [];
//for (let i = 1; i <= 500; i++) {
////data.push(getRandomUser());
//}

//try {
// connection.query(
// q, [data],
// (err, results) => {
// if (err) throw err;
//  console.log(results); // results contains rows returned by server
//}
//);
//} catch (err) {
////   console.log(err);
////}

//connection.end();

app.listen("8080", () => {
    console.log(`${port} working fine`)
})


//home route
app.get("/", (req, res) => {
    let q = "SELECT count(*) FROM user";
    try {
        connection.query(
            q,
            (err, results) => {
                if (err) throw err;
                let count = results[0]["count(*)"]; // results contains rows returned by server
                res.render("home.ejs", { count });
            }
        );
    } catch (err) {
        console.log(err);
        res.send("some error in database")
    }

})
//show users data route
app.get("/users", (req, res) => {
    let q = "SELECT * FROM user";
    try {
        connection.query(
            q,
            (err, results) => {
                if (err) throw err;
                let datas = results; // results contains aaray of objects
                //console.log(data);
                res.render("users.ejs", { datas });
            }
        );
    } catch (err) {
        console.log(err);
        res.send("some error in database")
    }

})

//EDIT ROUTE
app.get("/users/:id/edit", (req, res) => {
    let { id } = req.params
    let q = `SELECT * FROM user WHERE id = '${id}'`;

    try {
        connection.query(
            q,
            (err, results) => {
                if (err) throw err;
                let userData = results[0]; //array ke andar aa raha hai
                res.render("edit.ejs", { userData })
            }
        );
    } catch (err) {
        console.log(err);
        res.send("some error in database")
    }


})

//update route

app.patch("/users/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id = '${id}'`;
    try {
        connection.query(
            q,
            (err, results) => {
                if (err) throw err;
                let userData = results[0]; //array ke andar aa raha hai
                if (formPass != userData.password) {
                    res.send("Wrong Password");
                } else {
                    let q2 = `UPDATE user SET username ='${newUsername}' WHERE id = '${id}'`;
                    connection.query(q2, (err, results) => {
                        if (err) throw err;
                        res.redirect("/users");
                    })
                }

            }
        );
    } catch (err) {
        console.log(err);
        res.send("some error in database")
    }

})

app.get("/users/new", (req, res) => {
    res.render("new.ejs");
  });

  app.post("/users/new", (req, res) => {
    let { username, email, password } = req.body;
    let id = uuidv4();
    //Query to Insert New User
    let q = `INSERT INTO user (id, username, email, password) VALUES ('${id}','${username}','${email}','${password}') `;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        console.log("added new user");
        res.redirect("/users");
      });
    } catch (err) {
      res.send("some error occurred");
    }
  });

  app.get("/users/:id/delete", (req, res) => {
    let { id } = req.params;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
        res.render("delete.ejs", { user });
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });

  app.delete("/users/:id/", (req, res) => {
    let { id } = req.params;
    let { password } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;
  
    try {
      connection.query(q, (err, result) => {
        if (err) throw err;
        let user = result[0];
  
        if (user.password != password) {
          res.send("WRONG Password entered!");
        } else {
          let q2 = `DELETE FROM user WHERE id='${id}'`; //Query to Delete
          connection.query(q2, (err, result) => {
            if (err) throw err;
            else {
              console.log(result);
              console.log("deleted!");
              res.redirect("/users");
            }
          });
        }
      });
    } catch (err) {
      res.send("some error with DB");
    }
  });


