const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const encoder = bodyParser.urlencoded({ extended: true });


const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "SEBI@1234",
  database: "My_database",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to MySQL!");
});


app.use(cookieParser());
app.use(encoder);


app.use(
  session({
    name: "sid", 
    secret: "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: true,
      maxAge: 24 * 60 * 60 * 1000, 
    },
  })
);


app.use(
  "/assets",
  express.static(path.join(__dirname, "assets"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
    },
  })
);


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, private");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});




app.get("/check-session", (req, res) => {
  res.json({ loggedIn: !!req.session.loggedIn });
});



app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post("/login", encoder, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  con.query(
    "SELECT * FROM conectare WHERE email=? AND password=?",
    [email, password],
    (error, results) => {
      if (error) {
        console.log("Error:", error);
        return res.status(500).send("DB error");
      }
      if (results.length > 0) {
        req.session.loggedIn = true;
        req.session.email = email;
        return res.redirect("/index2");
      }
    }
  );
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.post("/register", encoder, (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  con.query("SELECT * FROM conectare WHERE email=?", [email], (error, results) => {
    if (error) {
      console.log("Error:", error);
      return res.status(500).send("DB error");
    }
    if (results.length > 0) {
      return res.redirect("/exista");
    }
    con.query(
      "INSERT INTO conectare (email, password) VALUES (?, ?)",
      [email, password],
      (errorIns) => {
        if (errorIns) {
          console.log("Error:", errorIns);
          return res.status(500).send("DB error");
        }
        req.session.loggedIn = true;
        req.session.email = email;
        res.redirect("/index2");
      }
    );
  });
});

app.get("/welcome.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "welcome.html"));
});

app.get("/exista", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "exista.html"));
});

app.get("/", (req, res) => {
  if (req.session.loggedIn) {
    return res.redirect("/welcome.html");
  }
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/index2", (req, res) => {
  if (req.session.loggedIn) {
    
    return res.sendFile(path.join(__dirname, "public", "index2.html"));
  }
  res.redirect("/login");
});


app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      
    }
    res.clearCookie("sid"); 
    res.redirect("/");
  });
});

app.get("/trimite-mesaj", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "trimite-mesaj.html"));
});

app.post("/trimite-mesaj", encoder, (req, res) => {
  const { nume, email, mesaj, subiect } = req.body;

  con.query(
    "INSERT INTO mesaje (nume, email, mesaj, subiect) VALUES (?, ?, ?, ?)",
    [nume, email, mesaj, subiect],
    (error) => {
      if (error) {
        console.log("Error:", error);
        return res.status(500).send("DB error");
      }
      res.redirect("/");
    }
  );
});

app.get("/shows", (req, res) => {
  if (req.session.loggedIn) {
    return res.sendFile(path.join(__dirname, "public", "shows.html"));
  }
  
  res.redirect("/login");
});

app.get("/my-reservations", (req, res) => {
  if (!req.session.loggedIn) {
    return res.redirect("/login");
  }

  const email = req.session.email;

  
  con.query(
    "SELECT * FROM reservations WHERE user_email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log("DB error:", err);
        return res.status(500).send("DB error");
      }
      res.sendFile(path.join(__dirname, "public", "my-reservations.html"));
    }
  );
});


app.get("/api/my-reservations", (req, res) => {
  if (!req.session.loggedIn) return res.status(401).json([]);

  const email = req.session.email;
  con.query(
    "SELECT * FROM reservations WHERE user_email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log("DB error:", err);
        return res.status(500).json([]);
      }
      res.json(results);
    }
  );
});

app.post("/book", encoder, (req, res) => {
  if (!req.session.loggedIn) return res.redirect("/login");

  const user_email = req.session.email;
  const show_id = req.body.show_id;

  
  con.query("SELECT * FROM shows WHERE id=?", [show_id], (err, results) => {
    if (err) {
      console.log("DB error:", err);
      return res.status(500).send("Eroare la rezervare");
    }
    if (results.length === 0) return res.status(404).send("Film inexistent");

    const show = results[0];

    
    con.query(
      `INSERT INTO reservations (user_email, movie_name, cinema_name, date, duration_minutes, price, seats_reserved)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_email, show.movie_name, show.cinema_name, show.date, show.duration_minutes, show.price, 1],
      (err2) => {
        if (err2) {
          console.log("Booking error:", err2);
          return res.status(500).send("Eroare la rezervare");
        }
        res.redirect("/my-reservations");
      }
    );
  });
});



app.get("/my-reservations", (req, res) => {
  if (!req.session.loggedIn) return res.redirect("/login");

  const email = req.session.email;

  con.query(
    "SELECT * FROM reservations WHERE user_email = ?",
    [email],
    (err, results) => {
      if (err) {
        console.log(err);
        return res.status(500).send("DB error");
      }

     
      let html = `
        <h1>My Reservations</h1>
      `;

      if (results.length === 0) {
        html += `<p>Nu ai făcut nicio rezervare încă.</p>
                 <a href="/shows">Vezi filme disponibile</a>`;
      } else {
        results.forEach(r => {
          html += `
            <div class="reservation-card">
              <h3>${r.movie_name}</h3>
              <p>${r.cinema_name}</p>
              <p>Date: ${r.date}</p>
              <p>Seats Reserved: ${r.seats_reserved}</p>
              <p>Price: $${r.price}</p>
            </div>
          `;
        });
      }

      res.send(html);
    }
  );
});


app.get("/admin", (req, res) => {
  if (!req.session.loggedIn) return res.redirect("/login");

  const email = req.session.email;

  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err) {
      console.log("DB error:", err);
      return res.send("DB error");
    }

    if (results.length === 0 || results[0].is_admin !== 1) {
      return res.status(403).send("Acces interzis");
    }

   
    res.sendFile(path.join(__dirname, "public", "admin.html"));
  });
});

app.get("/api/admin/reservations", (req, res) => {
  if (!req.session.loggedIn) return res.status(401).send("Unauthorized");

  const email = req.session.email;
  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0 || results[0].is_admin !== 1) {
      return res.status(403).send("Forbidden");
    }

    con.query("SELECT * FROM reservations", (err2, reservations) => {
      if (err2) {
        console.log("DB error:", err2);
        return res.status(500).send("DB error");
      }
      res.json(reservations);
    });
  });
});


app.get("/api/admin/users", (req, res) => {
  if (!req.session.loggedIn) return res.status(401).send("Unauthorized");

  const email = req.session.email;
  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0 || results[0].is_admin !== 1) {
      return res.status(403).send("Forbidden");
    }

    con.query("SELECT email, is_admin, created_at as joined, email as name FROM conectare", (err2, users) => {
      if (err2) {
        console.log("DB error:", err2);
        return res.status(500).send("DB error");
      }
      res.json(users);
    });
  });
});

app.get("/admin", (req, res) => {
  if (!req.session.loggedIn) return res.redirect("/login");

  const email = req.session.email;
  con.query(
    "SELECT is_admin FROM conectare WHERE email = ?",
    [email],
    (err, results) => {
      if (err || results.length === 0) return res.redirect("/login");
      if (results[0].is_admin === 1) {
        return res.sendFile(path.join(__dirname, "public", "admin.html"));
      } else {
        return res.redirect("/index2"); 
      }
    }
  );
});

app.get("/admin/reservations", (req, res) => {
  if (!req.session.loggedIn) return res.status(401).send("Not logged in");
  const email = req.session.email;
  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0 || results[0].is_admin !== 1) return res.status(403).send("Forbidden");

    con.query("SELECT * FROM reservations", (err2, reservations) => {
      if (err2) return res.status(500).send("DB error");
      res.json(reservations);
    });
  });
});


app.delete("/admin/reservations/:id", (req, res) => {
  if (!req.session.loggedIn) return res.status(401).send("Not logged in");
  const email = req.session.email;
  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0 || results[0].is_admin !== 1) return res.status(403).send("Forbidden");

    con.query("DELETE FROM reservations WHERE id=?", [req.params.id], (err2) => {
      if (err2) return res.status(500).send("DB error");
      res.sendStatus(200);
    });
  });
});


app.get("/admin/users", (req, res) => {
  if (!req.session.loggedIn) return res.status(401).send("Not logged in");
  const email = req.session.email;
  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err || results.length === 0 || results[0].is_admin !== 1) return res.status(403).send("Forbidden");

    con.query("SELECT * FROM conectare", (err2, users) => {
      if (err2) return res.status(500).send("DB error");
      res.json(users);
    });
  });
});

app.get("/check-admin", (req, res) => {
  if (!req.session.loggedIn || !req.session.email) {
    return res.json({ isAdmin: false });
  }

  const email = req.session.email;
  con.query("SELECT is_admin FROM conectare WHERE email=?", [email], (err, results) => {
    if (err) {
      console.log("DB error:", err);
      return res.json({ isAdmin: false });
    }

    if (results.length > 0 && results[0].is_admin === 1) {
      return res.json({ isAdmin: true });
    } else {
      return res.json({ isAdmin: false });
    }
  });
});

app.get("/admin", (req, res) => {
  if (!req.session.loggedIn) return res.redirect("/login");

  const email = req.session.email;
  con.query(
    "SELECT is_admin FROM conectare WHERE email = ?",
    [email],
    (err, results) => {
      if (err) return res.status(500).send("DB error");
      if (results.length > 0 && results[0].is_admin === 1) {
        res.sendFile(path.join(__dirname, "public", "admin.html"));
      } else {
        res.status(403).send("Acces interzis");
      }
    }
  );
});



app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "incarcare.html"));
});


const host = process.env.HOST || "localhost";
const port = process.env.PORT || 3000;
app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
