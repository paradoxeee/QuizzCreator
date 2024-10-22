document.addEventListener('DOMContentLoaded', function () {
    const signupForm = document.getElementById('signupForm');
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); 
        const username = document.getElementById('signupName').value;
        const password = document.getElementById('signupPassword').value;
        const formData = { username, password }; 
        fetch('http://localhost:5501/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json()) 
            .then(data => {
                if (data.message === "Le nom d'utilisateur existe déjà.") {
                    document.getElementById('signupErrorMessage').innerText = data.message;
                } else if (data.message === "Inscription réussie") {
                    window.location.href = 'signhome.html';
                } else {
                    document.getElementById('SignTitle').innerText = data.message;
                }
            })
            .catch(error => console.error('Erreur:', error));
    });
});

document.getElementById('signupForm').addEventListener('submit', function (e) {
    e.preventDefault(); 

    const username = document.getElementById('signupName').value;
    const password = document.getElementById('signupPassword').value;

    fetch('http://localhost:5501/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('token', data.token); 
            
        })
        .catch(error => console.error('Erreur:', error));
});



fetch('http://localhost:5501/')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur lors de la vérification de la connexion :', error));
