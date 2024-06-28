const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const Quiz = require('./models/quiz'); // Import the Quiz model

const app = express();

app.use(cors());
app.use(express.json()); // Ensure express.json() is used to parse JSON bodies

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizdb', { useNewUrlParser: true, useUnifiedTopology: true });

// Create Quiz endpoint
app.post('/api/quiz', async (req, res) => {
    console.log('Received quiz data:', req.body); // Debugging line
    try {
        const newQuiz = new Quiz(req.body);
        await newQuiz.save();
        res.status(201).send(newQuiz);
    } catch (error) {
        console.error('Error saving quiz:', error); // Debugging line
        res.status(400).send(error);
    }
});

// Fetch all quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Fetch a single quiz by ID
app.get('/api/quizzes/:quizId', async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) {
            return res.status(404).send({ message: 'Quiz not found' });
        }
        res.status(200).send(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

// Submit quiz answers and calculate score
app.post('/api/quizzes/:quizId/submit', async (req, res) => {
    try {
        const { quizId } = req.params;
        const { userAnswers } = req.body;

        // Retrieve quiz from database
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).send({ message: 'Quiz not found' });
        }

        // Calculate score based on userAnswers and quiz.correctAnswers
        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (userAnswers[index] === question.correctAnswer) {
                score++;
            }
        });

        res.status(200).send({ score });
    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
