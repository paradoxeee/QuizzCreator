
document.addEventListener('DOMContentLoaded', function () {
    const videoLoader = document.getElementById('videoLoader');
    const mainContent = document.getElementById('mainContent');

    function loadVideo() {
        const orientation = (window.innerWidth > window.innerHeight) ? 'landscape' : 'portrait';
        const videoSource = orientation === 'landscape' ? 'assets/img/loader.mp4' : 'assets/img/loader_mobile.mp4';

        const videoHtml = `
      <video autoplay muted id="introVideo";">
        <source src="${videoSource}" type="video/mp4">
        Your browser does not support the video tag.
      </video>
    `;

        videoLoader.innerHTML = videoHtml;

        const video = document.getElementById('introVideo');
        video.onended = function () {
            videoLoader.style.display = 'none';
            mainContent.style.display = 'block';
        };
    }

    loadVideo();

    window.addEventListener('resize', function () {
        loadVideo(); 
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var video = document.querySelector('.background-video source');
    var videoContainer = document.querySelector('.background-video');

    function changeVideoSource() {
        if (window.innerWidth > window.innerHeight) {
            video.src = 'assets/img/background.mp4';
        } else {
            video.src = 'assets/img/background_mobile.mp4';
        }
        videoContainer.load();
    }

    changeVideoSource();
    window.addEventListener('resize', changeVideoSource);
});


fetch('http://localhost:3000/')
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Erreur lors de la vérification de la connexion :', error));
