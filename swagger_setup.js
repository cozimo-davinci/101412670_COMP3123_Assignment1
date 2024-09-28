// swagger utilization
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node API with Express and MongoDB",
            version: "1.0.0",
            description: "Simple Express API",
        },
        servers: [
            {
                url: "http://localhost:3002",
            },
        ],
    },
    apis: [
        "./index.js"
    ]
};
module.exports = swaggerOptions;