const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Configurez votre connexion à la base de données
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Remplacez par votre mot de passe
  database: 'uasz' // Remplacez par le nom de votre base de données
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Route pour sauvegarder les données du formulaire
app.post('/api/users', (req, res) => {
  const { username, email, password, role, agreeToTerms } = req.body;

  const query = 'INSERT INTO users (username, email, password, role, agree_to_terms) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [username, email, password, role, agreeToTerms ? 1 : 0], (err, results) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).send('Error saving data');
    } else {
      res.status(201).json({ id: results.insertId, username, email, role, agree_to_terms: agreeToTerms ? 1 : 0 });
    }
  });
});

app.get('/api/users', (req, res) => {
  const query = 'SELECT * FROM users';

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      res.status(200).json(results);
    }
  });
});

app.get('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('Error fetching data');
    } else {
      if (results.length > 0) {
        res.status(200).json(results[0]);
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.put('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const { username, email, password, role, agreeToTerms } = req.body;

  const query = `
    UPDATE users 
    SET username = ?, email = ?, password = ?, role = ?, agree_to_terms = ?
    WHERE id = ?
  `;

  connection.query(query, [username, email, password, role, agreeToTerms ? 1 : 0, userId], (err, results) => {
    if (err) {
      console.error('Error updating data:', err);
      res.status(500).send('Error updating data');
    } else {
      if (results.affectedRows > 0) {
        res.status(200).send('User updated successfully');
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'DELETE FROM users WHERE id = ?';

  connection.query(query, [userId], (err, results) => {
    if (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Error deleting user');
    } else {
      if (results.affectedRows > 0) {
        res.status(200).send('User deleted successfully');
      } else {
        res.status(404).send('User not found');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
