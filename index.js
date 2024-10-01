const express = require('express');
const app = express();
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();


const User = require('./models/users.model');
const Employee = require('./models/employees.model');
const bcrypt = require('bcrypt');
const swagger = require('./swagger_setup.js')
const swaggerDocumentation = swaggerJsDoc(swagger);
const bodyParser = require('body-parser');
const generateToken = require('./jwtUtils.js');
const jwt = require('jsonwebtoken');


app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));
app.use(bodyParser.json());

// JWT validation
const validateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const secretKey = process.env.JWT_SECRET || "fallbackSecretKey";

    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer Token

        jwt.verify(token, secretKey, (err, payload) => {
            if (err) {
                return res.sendStatus(403).json({
                    success: false,
                    message: "Invalid Token",
                }); // Forbidden
            } else {
                req.user = payload;
                next();
            }

        });
    } else {
        res.sendStatus(401).json({
            success: false,
            message: "Token is not provided",
        }); // Unauthorized
    }
};




mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to the database!");

    })
    .catch(() => {
        console.log("Connection failed!");
    });


app.listen(3002, () => {
    console.log('Server is running on port 3002 at http://localhost:3002/');
});

app.get('/', (req, res) => {
    res.send("Hello from Node API Updated")
});

/**
 * @swagger
 * /api/v1/user/signup:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Email already exists or missing required fields
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /api/v1/user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

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
        // Generate JWT Token
        const { accessToken, refreshToken } = generateToken(user);

        res.status(200).json({
            message: 'Login successful',
            success: true,
            accessToken,
            refreshToken,

        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


/**
 * @swagger
 * /api/v1/emp/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employee]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
app.get('/api/v1/emp/employees', async (req, res) => {
    try {
        const employee = await Employee.find(req.body);
        res.status(200).json(employee);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});


/**
 * @swagger
 * /api/v1/emp/employees:
 *   post:
 *     summary: Create a new employee
 *     description: This API creates a new employee record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The employee's name.
 *               position:
 *                 type: string
 *                 description: The employee's position in the company.
 *               salary:
 *                 type: number
 *                 description: The employee's salary.
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 position:
 *                   type: string
 *                 salary:
 *                   type: number
 *       500:
 *         description: Internal server error
 */

app.post('/api/v1/emp/employees', async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json(employee);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

/**
 * @swagger
 * /api/v1/emp/employees/eid:
 *   get:
 *     summary: Get employee by ID
 *     description: This API retrieves an employee's details by their ID.
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 position:
 *                   type: string
 *                 salary:
 *                   type: number
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

app.get('/api/v1/emp/employees/:eid', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.eid);
        res.status(200).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

/**
 * @swagger
 * /api/v1/emp/employees/eid:
 *   put:
 *     summary: Update employee details
 *     description: This API updates the details of an employee by their ID.
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         description: Employee ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The updated name of the employee.
 *               position:
 *                 type: string
 *                 description: The updated position of the employee.
 *               salary:
 *                 type: number
 *                 description: The updated salary of the employee.
 *     responses:
 *       200:
 *         description: Employee details updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 position:
 *                   type: string
 *                 salary:
 *                   type: number
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal server error
 */

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


/**
 * @swagger
 * /api/v1/emp/employees/eid:
 *   delete:
 *     summary: Delete an employee by ID
 *     description: This API deletes an employee by their ID from the database.
 *     tags: [Employee]
 *     parameters:
 *       - in: path
 *         name: eid
 *         required: true
 *         description: The ID of the employee to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee details deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee details deleted successfully!
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Employee not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error message describing the issue
 */

app.delete('/api/v1/emp/employees/:eid', async (req, res) => {
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

/**
 * @swagger
 * /api/v1/user/refresh-token:
 *   post:
 *     summary: Refresh an access token
 *     description: This endpoint allows the user to refresh their access token using a valid refresh token. The new access token will be valid for a specified period.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token provided during login.
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: The newly generated access token.
 *       401:
 *         description: Refresh token is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Refresh Token is missing"
 *       403:
 *         description: Invalid refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 *       500:
 *         description: Internal server error
 */

app.post('/api/v1/user/refresh-token', (req, res) => {
    const { refreshToken } = req.body;
    const refreshSecretKey = process.env.JWT_REFRESH_SECRET || 'fallbackRefreshSecretKey';

    if (!refreshToken) {
        return res.status(401).json({ message: "Refresh Token is missing" });

    }

    // Verify refresh token
    jwt.verify(refreshToken, refreshSecretKey, (error, user) => {
        if (error) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Generate new access token
        const accessToken = jwt.sign({
            id: user.id,
            email: user.email,
        }, refreshSecretKey, { expiresIn: '7d' });
        res.status(200).json({ accessToken });
    });


});
