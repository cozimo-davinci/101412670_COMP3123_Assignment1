const express = require('express');
const app = express();
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
require('dotenv').config();
const errorHandler = require("./errorMiddleware.js");
const SERVER_PORT = process.env.PORT || 3002

const employeeRouter = require('./employeeEndpoints.js');
const userRouter = require('./usersEndpoints.js');


const swagger = require('./swagger_setup.js')
const swaggerDocumentation = swaggerJsDoc(swagger);



app.use(express.json());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocumentation));

app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to the database!");

    })
    .catch(() => {
        console.log("Connection failed!");
    });


app.use('/api/v1/emp', employeeRouter);
app.use('/api/v1/user', userRouter);



app.listen(SERVER_PORT, () => {
    console.log(`Server is running on port ${SERVER_PORT} at http://localhost:3002/`);
});

app.get('/', (req, res) => {
    res.send("Hello from Node API Updated")
});


app.use(errorHandler);
