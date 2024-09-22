const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.use(express.json());
const User = require('./models/users.model');
const Employee = require('./models/employees.model');
const bcrypt = require('bcrypt');

mongoose.connect("mongodb+srv://admin:admin@backend.qru7w.mongodb.net/Node-API?retryWrites=true&w=majority&appName=backend")
    .then(() => {
        console.log("Connected to the database!");

    })
    .catch(() => {
        console.log("Connection failed!");
    });

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
    res.send("Hello from Node API Updated")
});

app.post('/api/v1/user/signup', async (req, res) => {
    try {
        // Check if the values come from req.body (POST body) or req.query (query string)
        const { email, username, password } = req.body.email ? req.body : req.query;

        // Check if email, username, or password are missing
        if (!email || !username || !password) {
            return res.status(400).json({ message: 'Email, username, and password are required' });
        }

        const lowerCaseEmail = email.toLowerCase();

        // Check if the email already exists in the database
        const existingUser = await User.findOne({ email: lowerCaseEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // Create the new user and save it to the database
        const newUser = await User.create({
            ...req.body,
            email: lowerCaseEmail, // Store email in lowercase
        });

        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




app.post('/api/v1/user/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const lowerCaseEmail = email.toLowerCase();
        const user = await User.findOne({ email: lowerCaseEmail });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email' });
        }

        // Compare the hashed password with the user's input
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.get('/api/v1/emp/employees', async (req, res) => {
    try {
        const employee = await Employee.find(req.body);
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

app.post('/api/v1/emp/employees', async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.get('/api/v1/emp/employees/:{eid}', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.put('/api/v1/emp/employees/:eid', async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.eid, req.body, { new: true });
        // const employee1 = await Employee.findById('66ef7245730f18bb8fef3b6e');
        // console.log(employee1);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: "Employee details updated successfully!" });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

app.delete('/api/v1/emp/employees?/:eid', async (req, res) => {
    try {

        const employee = await Employee.findByIdAndDelete(req.params.eid);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        res.status(200).json({ message: "Employee details deleted successfully!" });

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});
