var express = require('express');
var router = express.Router();
const executeQuery = require('../Modules/sqlScript.js')

const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");

router.use(session({ secret: "adams" }));
router.use(cookieParser());


/* REGISTRATION */

/*GET Registration. 
If you go to this page after creating a session, 
it will redirect you to the page Profile.*/
router.get("/registration", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  res.render("Registration", { title: "Registration" });
});


/* LOGIN */

/*GET Login. 
If you go to this page after creating a session, 
it will redirect you to the page Profile. */
router.get("/login", (req, res, next) => {
  if (req.session.user) {
    return res.redirect("/profile");
  }
  res.render("Login", { title: "Login" });
});


/* PROFILE */

/*POST Profile. 
This route insert new users into the database from the REGISTRATION page, 
creates a new session and ad the and it redirect you to page Profile*/
router.post("/profile", (req, res, next) => {
  const name = req.body.name;
  const surname = req.body.surname;
  const email = req.body.email;
  const psw = req.body.psw;
  executeQuery(`SELECT id FROM users WHERE Email = '${req.body.email}'`,function (err, ress) {
      if (ress.length < 0) {
        res.send("this email already exists");
      } else {
        executeQuery(`insert into users(Name, Surname, Email, Password) values('${req.body.name}','${req.body.surname}','${req.body.email}','${req.body.psw}')`,function (errore, risultato) {
            executeQuery(`select * from trips`, function (error, result) {
              if (error) {
                throw error;
              } else {
                req.session.user = email;
                res.cookie("session", req.session.user);
                return res.render("Profile", {title: "Profile", trips: result, name: name});
              }
            });
          }
        );
      }
    }
  );
});

/*POST Profile--POST Account. 
This page check the email and password from the page LOGIN 
and if they are correct it creates a new session and redirect the user to page profile*/
router.post("/account", (req, res, next) => {
  const email = req.body.email;
  executeQuery(`SELECT id FROM users WHERE Email = '${req.body.email}' AND Password = '${req.body.psw}'`,function (err, ress) {
      if (ress.length == 0) {
        res.send("email or password incorrect");
      } else {
        executeQuery(`select * from trips`, function (error, result) {
          if (error) {
            throw error;
          } else {
            req.session.user = email;
            res.cookie("session", req.session.user);
            return res.render("Profile", {title: "Profile", trips: result, name: email,
            });
          }
        });
      }
    }
  );
});

/* GET PROFILE. 
This rout works only if a session is open. 
This rout show to the user all the trips in the database.*/
router.get("/profile", (req, res, next) => {
  if (req.session.user) {executeQuery(`select * from trips`, function (error, result) {
      if (error) {
        throw error;
      } else {
        return res.render("Profile", {title: "Profile", trips: result, name: req.session.user});
      }
    });
  } else {
    return res.redirect("/");
  }
});


/* LOGOUT */
/* GET Logout. This rout destroy the session of the user
and redirect the user to the homepage */
router.get("/logout", (req, res, next) => {
  if (req.session.user) {
    req.session.user = null;
    req.session.destroy();
    return res.redirect("/");
  }
  res.clearCookie("session");
  return res.redirect("/login");
});


// CONFIRM

/*GET Confirm. 
This route allow the user to get a confirmation of the trip that he choose.
and it show to the screen name of the user and location and picture of the trip that he choose*/
router.get("/confirm/:id", function (req, res, next) {
  if (req.session.user) {
    const user = req.session.user;
    executeQuery(`SELECT * FROM users WHERE Email='${user}'`,function (error, results) {
        if (error) {
          throw error;
        } else {
          const id = req.params.id;
          console.log(id);
          executeQuery(`select * from trips WHERE id=${id}`, function (err, ress) {
              console.log(ress);
              if (err) {
                throw err;
              } else {
                return res.render("Confirm", { title: "Confirm", nome: results[0], trip:ress[0] });
              }
            }
          );
        }
      }
    );
  } else {
    res.redirect("/");
  }
});

module.exports = router;
