var express = require("express");
var router = express.Router();
const executeQuery = require("../Modules/sqlScript.js");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

router.use(session({ secret: "adams" }));
router.use(cookieParser());


// HOME

/* GET home page html */
// router.get('/', function(req, res, next) {
// res.sendFile(path.join(__dirname, '../prove_HTML/Home.html'));
// });

// GET Home
router.get("/", function (req, res, next) {
  res.render("index", { title: "Home" });
});


// ADMIN

// GET Admin. 
router.get("/admin", (req, res, next) => {
  res.render("admin", { title: "Admin" });
});


// POST

/*POST Post. 
This route check the admin credencials.
It shows the available trips in the database*/
router.post("/post", function (req, res, next) {
  let mail = req.body.mail;
  let password = req.body.password;
  if ((mail == "prova@test.com") & (password == "2143")) {
    executeQuery(`select * from users`, function (error, results) {
      if (error) {
        throw error;
      } else {
        executeQuery(`select * from trips`, function (errore, risultato) {
          if (errore) {
            throw errore;
          } else {
            req.session.admin = password;
            res.cookie("session", req.session.admin);
            return res.render("post", { trips: risultato, title: "Post" });
          }
        });
      }
    });
  } else {
    res.send("something went wrong");
  }
});

/*GET Post. 
This rout works only after an Admin login.
It shows the available trips in the database*/
router.get("/post", (req, res, next) => {
  if (req.session.admin) {
    executeQuery(`select * from trips`, function (error, result) {
      if (error) {
        throw error;
      } else {
        return res.render("post", { title: "post", trips: result });
      }
    });
  } else {
    res.redirect("/");
  }
});

/*POST TRIPS,  Post-->Database.
This rout allow the admin to save trips in the database,
also it checks if the location already existe */
router.post("/trips", function (req, res, next) {
  let location = req.body.location;
  let image = req.body.image;
  let description = req.body.description;
  executeQuery(
    `select id from trips where location = '${location}'`,
    function (error, results) {
      if (results.length > 0) {
        res.send("This location already exists!");
      } else {
        executeQuery(
          `insert into trips(location, image, description) values('${req.body.location}','${req.body.image}','${req.body.description}')`,
          function (er, ress) {
            return res.redirect("/post");
          }
        );
      }
    }
  );
});


//EDIT

/*GET edit.
this route allow the admin to access a form that allow changes in a specific trip.*/
router.get("/edit/:id", (req, res, next) => {
  const id = req.params.id;
  console.log(id);
  executeQuery(`select * from trips WHERE id=${id}`, function (error, results) {
    console.log(results);
    if (error) {
      throw error;
    } else {
      return res.render("edit", { title: "edit", place: results[0] });
    }
  });
});

/*POST update.
this rout allow the admin to save the changes of a specific trip.
it changes the information directly into the database*/
router.post("/update", (req, res, next) => {
  const id = req.body.id;
  const location = req.body.location;
  const image = req.body.image;
  const description = req.body.description;
  console.log("dati raccolti");
  executeQuery(
    `UPDATE trips SET location = '${location}', image = '${image}', description = '${description}' WHERE id = ${id}`,
    (error, results) => {
      if (error) {
        console.log("stai sbagliando qualcosa");
      } else {
        res.redirect("/post");
      }
    }
  );
});


// DELETE

/*GET Delete.
This rout allow the admin to delete some trips from the database*/
router.get("/delete/:id", (req, res, next) => {
  const id = req.params.id;
  executeQuery(`DELETE from trips WHERE id=${id}`, function (error, results) {
    console.log(results);
    if (error) {
      throw error;
    } else {
      res.redirect("/post");
    }
  });
});


module.exports = router;
