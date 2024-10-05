const express = require('express');
const router = express.Router();

const Employee = require('./models/employees.model');
const swagger = require('./swagger_setup.js')
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocumentation = swaggerJsDoc(swagger);
const swaggerUI = require('swagger-ui-express');

const generateToken = require('./jwtUtils.js');
require('dotenv').config();


router.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));




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
router.get('/employees', async (req, res) => {
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

router.post('/employees', async (req, res) => {
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

router.get('/employees/:eid', async (req, res) => {
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

router.put('/employees/:eid', async (req, res) => {
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

router.delete('/employees/:eid', async (req, res) => {
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

module.exports = router;