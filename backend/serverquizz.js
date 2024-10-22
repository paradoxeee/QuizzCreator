const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const app = express();
const PORT = 5502;
const moment = require('moment');


app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Le front communique bien avec le Back');
});

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'main',
    password: 'root',
    database: 'quizzes'
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connexion à la base de données réussie');
});


const secretKey = 'admin';




const { v4: uuidv4 } = require('uuid');

app.post('/create', async (req, res) => {
    const { title, description, username } = req.body; // Ajouter username à partir du corps de la requête
    const newQuizId = uuidv4();

    if (!title || title.length < 3) {
        return res.status(400).send({ message: "Le titre doit contenir au moins 3 caractères." });
    }

    try {
        const titleCheckQuery = 'SELECT * FROM Quizzes WHERE title = ?';
        const titleCheck = await queryPromise(titleCheckQuery, [title]);

        if (titleCheck.length > 0) {
            return res.status(409).send({ message: "Le titre existe déjà." });
        }

        const insertQuery = 'INSERT INTO Quizzes (id, title, description, createdBy) VALUES (?, ?, ?, ?)';
        await queryPromise(insertQuery, [newQuizId, title, description, username]);

        res.send({ message: "Quiz enregistré avec succès.", quizId: newQuizId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de la création du quiz." });
    }
});



function queryPromise(query, params) {
    return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
            if (error) reject(error);
            else resolve(results);
        });
    });
}

const jwt = require('jsonwebtoken');
const secret = 'admin';

function verifierToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Aucun token fourni, accès refusé" });
    }

    jwt.verify(token, secret, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token invalide, accès refusé" });
        }
        req.user = user;
        next();
    });
}

app.post('/submit-question', async (req, res) => {
    const { quizId, title, options } = req.body; // Utilisez `title` au lieu de `questionText` et ajoutez `options`

    if (!quizId || !title || !options || options.length === 0) {
        return res.status(400).send({ message: "Les données fournies sont incomplètes." });
    }

    const questionId = uuidv4();
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const insertQuestionQuery = 'INSERT INTO Questions (id, quizId, text, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        await queryPromise(insertQuestionQuery, [questionId, quizId, title, 'multiple', currentDate, currentDate]);

        res.send({ message: "Question et options enregistrées avec succès.", questionId: questionId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la question et des options." });
    }
});


app.post('/submit-question-tof', async (req, res) => {
    const { title, isTrue, isFalse, quizId } = req.body;

    if (!title || (isTrue === undefined && isFalse === undefined) || !quizId) {
        return res.status(400).send({ message: "Les données fournies sont incomplètes." });
    }
    const questionId = uuidv4();
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const insertQuestionQuery = 'INSERT INTO Questions (id, quizId, text, type, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        await queryPromise(insertQuestionQuery, [questionId, quizId, title, 'multiple', currentDate, currentDate]);

        res.send({ message: "Question et options enregistrées avec succès.", questionId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la question et des options." });
    }
});

app.post('/submit-short-answer-question', async (req, res) => {
    const { title, quizId } = req.body; // Retirer `choices` de la déstructuration
    if (!title || !quizId) {
        return res.status(400).send({ message: "Les données fournies sont incomplètes ou incorrectes." });
    }

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const insertQuestionQuery = 'INSERT INTO Questions (id, quizId, text, type, created_at, updated_at) VALUES (?, ?, ?, "short_answer", ?, ?)';
        const questionId = uuidv4();
        await queryPromise(insertQuestionQuery, [questionId, quizId, title, currentDate, currentDate]);

        // Envoyer l'ID de la question dans la réponse
        res.send({ message: "Question enregistrée avec succès.", questionId });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la question." });
    }
});





app.post('/submit-reponse', async (req, res) => {
    const { questionId, text, isCorrect } = req.body; // Utilisez `questionId` au lieu de `quizId`

    if (!questionId || !text || typeof isCorrect !== 'boolean') {
        return res.status(400).send({ message: "Les données fournies sont incomplètes ou invalides." });
    }

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const insertAnswerQuery = 'INSERT INTO Answers (id, questionId, text, isCorrect, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        await queryPromise(insertAnswerQuery, [uuidv4(), questionId, text, isCorrect, currentDate, currentDate]);

        res.send({ message: "Réponse enregistrée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la réponse." });
    }
});
app.post('/submit-reponse-multiple', async (req, res) => {
    const { questionId, text, isCorrect } = req.body;

    if (!questionId || !text || typeof isCorrect !== 'boolean') {
        return res.status(400).send({ message: "Les données fournies sont incomplètes ou invalides." });
    }

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');

    try {
        const insertAnswerQuery = 'INSERT INTO Answers (id, questionId, text, isCorrect, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        // Pas besoin d'utiliser map ici, car isCorrect est une seule valeur
        await queryPromise(insertAnswerQuery, [uuidv4(), questionId, text, isCorrect, currentDate, currentDate]);

        res.send({ message: "Réponse enregistrée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la réponse." });
    }
});



app.post('/submit-reponse-short', async (req, res) => {
    const { questionId, text, isCorrect1 } = req.body; // Utilisez `questionId` au lieu de `quizId`

    if (!questionId || !text || typeof isCorrect1 !== 'string') {
        return res.status(400).send({ message: "Les données fournies sont incomplètes ou invalides." });
    }

    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(req.body); // Pour inspecter les données reçues

    try {
        const insertAnswerQuery = 'INSERT INTO Answers (id, questionId, text, isCorrect1, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)';
        await queryPromise(insertAnswerQuery, [uuidv4(), questionId, text, isCorrect1, currentDate, currentDate]);

        res.send({ message: "Réponse enregistrée avec succès." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'enregistrement de la réponse." });
    }
});


app.get('/my-quizzes', verifierToken, (req, res) => {

    res.json({ message: "Accès autorisé à vos quizz." });
});

app.get('/create-quizzes', verifierToken, (req, res) => {

    res.json({ message: "Accès autorisé à vos quizz." });
});

app.listen(PORT, () => {
    console.log(`Le serveur est à l'écoute sur le port ${PORT}`);
});

app.post('/userquizzes', (req, res) => {
    const { username } = req.body; 
    console.log("Données reçues :", req.body); // Récupère le nom d'utilisateur depuis le corps de la requête
    console.log(username)
    if (!username) {
        return res.status(401).send('Nom d\'utilisateur non trouvé');
    }
    const query = "SELECT * FROM quizzes WHERE createdBy = ?";;
    connection.query(query, [username], (error, results) => {
        if (error) {
            res.status(500).send('Erreur lors de la récupération des quiz');
        } else {
            res.json(results);
        }
    });
});


