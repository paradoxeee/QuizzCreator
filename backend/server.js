const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const app = express();
const PORT = 5501;

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
    database: 'quizzcreator'
});

connection.connect((err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        return;
    }
    console.log('Connexion à la base de données réussie');
});

app.post('/login',(req, res) => {
    const { username, password } = req.body;

    connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results, fields) => {
        if (error) {
            return res.status(500).send({ message: "Erreur lors de la connexion à la base de données" });
        }

        if (results.length > 0) {
            const user = results[0];
            const secret = 'admin';
            const comparison = await bcrypt.compare(password, user.password);
            if (comparison) {
                const jwt = require('jsonwebtoken');
                const token = jwt.sign({
                    id: user.id, 
                }, secret, { expiresIn: '2h' });

                // vérification des mots de passes
                console.log("Connexion réussie");
                res.json({
                    message: "Connexion réussie",
                    token: token,
                    username: user.username 
                });
            } else {
                console.error("Nom d'utilisateur ou mot de passe incorrect");
                res.status(401).send({ message: "Nom d'utilisateur ou mot de passe incorrect" });
            }
        } else {
            console.error("Nom d'utilisateur ou mot de passe incorrect");
            res.status(401).send({ message: "Nom d'utilisateur ou mot de passe incorrect" });
        }
    });
});

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;

    if (!username || username.length < 3) {
        return res.status(400).send({ message: "Le nom d'utilisateur doit contenir au moins 3 caractères." });
    }
    if (!password || password.length < 6) { 
        return res.status(400).send({ message: "Le mot de passe doit contenir au moins 6 caractères." });
    }

    try {
        await queryPromise('START TRANSACTION'); 

        const userCheckQuery = 'SELECT * FROM users WHERE username = ?';
        const userCheck = await queryPromise(userCheckQuery, [username]);
        if (userCheck.length > 0) {
            await queryPromise('ROLLBACK'); 
            return res.status(409).send({ message: "Le nom d'utilisateur existe déjà." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = 'INSERT INTO users (username, password) VALUES (?, ?)';
        await queryPromise(insertQuery, [username, hashedPassword]);

        await queryPromise('COMMIT');
        res.send({ message: "Inscription réussie" });
    } catch (error) {
        await queryPromise('ROLLBACK'); 
        console.error(error);
        res.status(500).send({ message: "Erreur lors de l'inscription" });
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

app.get('/my-quizzes', verifierToken, (req, res) => {

    res.json({ message: "Accès autorisé à vos quizz." });
});

app.get('/create-quizzes', verifierToken, (req, res) => {

    res.json({ message: "Accès autorisé à vos quizz." });
});

    app.listen(PORT, () => {
        console.log(`Le serveur est à l'écoute sur le port ${PORT}`);
    });
