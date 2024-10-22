document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html';
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const username = localStorage.getItem("username");
    console.log("username:", username); 
    if (!username) {
        window.location.href = '/login.html'
    } else {
        fetch('http://localhost:5502/userquizzes', {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ username }) 
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des quiz: ' + response.statusText);
                }
                return response.json(); 
            })
            .then(quizzes => {
                const quizzesList = document.getElementById('quizzes-list');
                if (quizzesList) {
                    quizzes.forEach(quiz => {
                        const quizElement = document.createElement('div');
                        quizElement.textContent = quiz.title; 
                        quizzesList.appendChild(quizElement);
                    });
                } else {
                    console.error('L\'élément avec l\'ID quizzes-list n\'existe pas dans le HTML');
                }
            })
            .catch(error => {
                console.error(error); 
                alert('Une erreur s\'est produite lors de la récupération des quiz. Veuillez réessayer plus tard.');
            });
    }
});




