document.addEventListener('DOMContentLoaded', function () {
    const signoutButton = document.getElementById('signout');
    signoutButton.addEventListener('click', function () {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        window.location.href = 'login.html';
    });

    const username = localStorage.getItem('username');
    if (username) {
        document.getElementById('username').textContent = username;
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html'; 
    } 
});

function openTab(tabId) {

    var tabcontent = document.querySelectorAll(".tab-content");
    tabcontent.forEach(function (node) {
        node.style.display = "none";
    });

    var targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.style.display = "block";
    }
}

document.getElementById('ourquizz').addEventListener('click', function () {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5501/my-quizzes', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Accès autorisé à vos quizz.") {
                window.location.href = '/ourquizz.html'; 
            } else {
                alert('Veuillez vous reconnecter.'); 
            }
        });
});

document.getElementById('create').addEventListener('click', function () {
    const token = localStorage.getItem('token'); 
    fetch('http://localhost:5501/create-quizzes', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.message === "Accès autorisé à vos quizz.") {
                window.location.href = '/createquizz.html'; 
            } else {
                alert('Veuillez vous reconnecter.'); 
            }
        });
});