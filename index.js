const express = require('express');
const app = express();
const port = 8000;
const connection = require('./config');
const cors = require('cors');
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});
connection.connect((err) => {
  if (err) throw err;
  console.log('MYSQL connected...');
});

app.get('/api/forum/users', (req, res) => {
  if(req.query.contentpseudo) {
    connection.query('SELECT * from users where pseudo=?', req.query.contentpseudo, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else if(req.query.startpseudo) {
    let start = req.query.startpseudo + '%'
    connection.query('SELECT * from users where pseudo like?', start, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
``} else if(req.query.sup) {
    connection.query('SELECT * from users where id >?', req.query.sup, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else if(req.query.order) {
    let order = `SELECT * from users order by id ${req.query.order}`
    connection.query(order, (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  } else {
    connection.query('SELECT * from users', (err, results) => {
      if (err) {
        res.status(500).send('Erreur lors de la récupération des films');
      } else {
        res.json(results);
      }
    });
  }
});

app.get('/api/forum/users/:pseudo', (req, res) => {
  connection.query('SELECT pseudo from users', (err, results) => {
    if (err) {
      res.status(500).send('Erreur lors de la récupération des films');
    } else {
      res.json(results);
    }
  });
});

app.post('/api/forum/users', (req, res) => {
  const formData = req.body;
  connection.query('INSERT INTO users SET ?', formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la sauvegarde d'un membre");
    } else {
      res.sendStatus(200);
    }    
  });
});

app.put('/api/forum/users/:id', (req, res) => {
  const idUser = req.params.id;
  const formData = req.body;
  connection.query('UPDATE users SET ? WHERE id = ?', [formData, idUser], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un employé");
    } else {
      res.sendStatus(200);
    }
  });
});

app.put('/api/forum/users/:admin', (req, res) => {
  const idUser = req.params.admin;
  const formData = req.body;
  connection.query('UPDATE users SET ? WHERE id = ?', [formData, idUser], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la modification d'un employé");
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/api/forum/users/:id', (req, res) => {
  const idUser = req.params.id;
  connection.query('DELETE FROM users WHERE id = ?', [idUser], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un employé");
    } else {
      res.sendStatus(200);
    }
  });
});

app.delete('/api/forum/users/:notadmin', (req, res) => {
  const noAdmin = req.params.notadmin;
  connection.query('DELETE FROM users WHERE admin = ?', [noAdmin], err => {
    if (err) {
      console.log(err);
      res.status(500).send("Erreur lors de la suppression d'un employé");
    } else {
      res.sendStatus(200);
    }
  });
});

app.listen(port, (err) => {
  if (err) {
    throw new Error('Something bad happened...');
  }

  console.log(`Server is listening on ${port}`);
});