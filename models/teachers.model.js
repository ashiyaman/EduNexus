const mongoose = require('mongoose')

const teacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        subjects:  [{
            type: String
        }],
        experience: {
            type: Number,
            required: true
        },
        email: String,
        phone: String
    },
    {timestamps: true}
)

const Teacher = mongoose.model('Teacher', teacherSchema)

module.exports = Teacher