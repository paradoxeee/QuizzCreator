document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('loginusername').value;
        const password = document.getElementById('loginpassword').value;
        localStorage.setItem('username', username);
        const formData = { username, password };
        fetch('http://localhost:5501/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.token) {
                    console.log('Login successful');
                    localStorage.setItem('token', data.token);
                    window.location.href = 'loginhome.html';
                } else {
                    console.error('Erreur de connexion');
                    document.getElementById('LogTitle').innerText = 'Identifiant ou mot de passe incorrect.';
                }
            })
            .catch(error => console.error('Error during login:', error));
    });
});
