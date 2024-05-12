const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require("cors");
const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());
// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Define Person schema
const personSchema = {
    name: { type: 'string' },
    email: { type: 'string' },
    mobileNumber: { type: 'string' },
    dateOfBirth: { type: 'string' }
};

// CRUD Operations

// Create Person
app.post('/api/person', (req, res) => {
    const { name, email, mobileNumber, dateOfBirth } = req.body;
    const sql = 'INSERT INTO persons (name, email, mobileNumber, dateOfBirth) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, email, mobileNumber, dateOfBirth], (err, result) => {
        if (err) {
            console.error('Error creating person:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(201).json({ message: 'Person created successfully', id: result.insertId });
    });
});

//get all person
app.get('/api/person', (req, res) => {
    const sql = 'SELECT * FROM persons';
    db.query(sql, (err, result) => {
        if (err) {
            console.error('Error fetching all persons:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json(result);
    });
});

// Read Person
app.get('/api/person/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * FROM persons WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching person:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (result.length === 0) {
            res.status(404).json({ error: 'Person not found' });
            return;
        }
        res.status(200).json(result[0]);
    });
});

// Update Person
app.put('/api/person/:id', (req, res) => {
    const id = req.params.id;
    const { name, email, mobileNumber, dateOfBirth } = req.body;
    const sql = 'UPDATE persons SET name = ?, email = ?, mobileNumber = ?, dateOfBirth = ? WHERE id = ?';
    db.query(sql, [name, email, mobileNumber, dateOfBirth, id], (err, result) => {
        if (err) {
            console.error('Error updating person:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Person not found' });
            return;
        }
        res.status(200).json({ message: 'Person updated successfully' });
    });
});

// Delete Person
app.delete('/api/person/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM persons WHERE id = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error deleting person:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ error: 'Person not found' });
            return;
        }
        res.status(200).json({ message: 'Person deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
