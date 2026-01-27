/**
 * Hero Video Rotation
 * Rotates the hero clip video source every hour based on the current hour.
 * Each hour displays a different technical prototype video.
 */
(function () {
    'use strict';

    var prototypes = [
        { src: 'img/GameDevelopment (4).mp4', caption: 'Unreal Engine gameplay clip running in a device frame.' },
        { src: 'img/GameDevelopment (1).mp4', caption: 'Game development prototype running in a device frame.' },
        { src: 'img/GameDevelopment (2).mp4', caption: 'Game development prototype running in a device frame.' },
        { src: 'img/GameDevelopment (3).MP4', caption: 'Ghost Defiant VR gameplay running in a device frame.' },
        { src: 'img/AppDevelopment.mp4', caption: 'App development prototype running in a device frame.' },
        { src: 'img/AppDevelopment (1).mp4', caption: 'App development prototype running in a device frame.' },
        { src: 'img/WebDevelopment (1).mp4', caption: 'Web development prototype running in a device frame.' },
        { src: 'img/WebDevelopment (2).mp4', caption: 'Web development prototype running in a device frame.' },
        { src: 'img/WebDevelopment (3).mp4', caption: 'Web development prototype running in a device frame.' },
        { src: 'img/WebDevelopment (4).mp4', caption: 'Web development prototype running in a device frame.' },
        { src: 'img/AlexaIntentBox.mp4', caption: 'Alexa Intent Box prototype running in a device frame.' },
        { src: 'img/Videos/App Screen Recordings/BookShelf Adventures 3D Models.mp4', caption: 'Bookshelf Adventures AR 3D models running in a device frame.' },
        { src: 'img/Videos/App Screen Recordings/Bookshelf Adventures Figma.mp4', caption: 'Bookshelf Adventures Figma prototype running in a device frame.' },
        { src: 'img/Videos/App Screen Recordings/BookShelf Adverntures Documents.mp4', caption: 'Bookshelf Adventures project documents running in a device frame.' },
        { src: 'img/Videos/App Screen Recordings/Teacher login page.mp4', caption: 'Bookshelf Adventures teacher login page running in a device frame.' }
    ];

    function setHeroVideo() {
        var video = document.querySelector('.hero-clip');
        var figcaption = video ? video.closest('figure').querySelector('figcaption') : null;
        if (!video) return;

        var hour = new Date().getHours();
        var index = hour % prototypes.length;
        var chosen = prototypes[index];

        if (video.getAttribute('src') !== chosen.src) {
            video.setAttribute('src', chosen.src);
            video.load();
            video.play().catch(function () {});
        }

        if (figcaption) {
            figcaption.textContent = chosen.caption;
        }
    }

    // Set on page load
    document.addEventListener('DOMContentLoaded', setHeroVideo);

    // Check every minute in case the hour rolls over while the page is open
    setInterval(setHeroVideo, 60000);
})();
