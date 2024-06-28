const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OptionSchema = new Schema({
    text: { type: String, required: true }
});

const QuestionSchema = new Schema({
    text: { type: String, required: true },
    options: [OptionSchema],
    correctAnswer: { type: Number, required: true }
});

const QuizSchema = new Schema({
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    questions: [QuestionSchema],
    timeLimit: { type: Number, required: true }, // Add time limit
    createdAt: { type: Date, default: Date.now }
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
