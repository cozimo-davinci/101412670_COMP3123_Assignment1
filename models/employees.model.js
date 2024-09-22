const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const EmployeeSchema = mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            default: new mongoose.Types.ObjectId(),
        },
        first_name: {
            type: String,
        },
        last_name: {
            type: String,
        },
        email: {
            type: String,
        },
        position: {
            type: String,
        },
        salary: {
            type: Number,
        },
        date_of_joining: {
            type: Date,
            default: Date.now,
        },
        department: {
            type: String,
        }
    },
    {
        timestamps: true
    }

);

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;