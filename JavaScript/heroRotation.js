/**
 * Hero Video Rotation
 * Cycles the hero clip based on the current hour so the site feels alive for
 * returning visitors. The <video> element AND the visible caption both update
 * so the label always matches what's playing.
 */
(function () {
    'use strict';

    var prototypes = [
        { src: 'img/ghost-defiant-hero-loop.mp4',     caption: 'Ghost Defiant — MR Quest 3 gameplay (Unity 6)' },
        { src: 'img/GameDevelopment (4).mp4',         caption: '2D Fighter — Unreal Engine 5' },
        { src: 'img/GameDevelopment (1).mp4',         caption: 'Unity gameplay prototype' },
        { src: 'img/GameDevelopment (2).mp4',         caption: 'Unity gameplay prototype' },
        { src: 'img/AppDevelopment.mp4',              caption: 'OnRamp AR — Unity + ARKit' },
        { src: 'img/AppDevelopment (1).mp4',          caption: 'iOS app development prototype' },
        { src: 'img/WebDevelopment (1).mp4',          caption: 'Finance Simulator — web application' },
        { src: 'img/WebDevelopment (2).mp4',          caption: 'Halo Maps Database — full-stack web' },
        { src: 'img/WebDevelopment (3).mp4',          caption: 'Halo SpeedRuns — D3.js dashboard' },
        { src: 'img/WebDevelopment (4).mp4',          caption: 'Web interaction prototype' },
        { src: 'img/AlexaIntentBox.mp4',              caption: 'Alexa Intent Box — voice UX prototype' }
    ];

    function setHeroVideo() {
        var video = document.querySelector('.hero-clip');
        if (!video) return;

        var figure = video.closest('figure');
        var caption = figure ? figure.querySelector('.hero-caption, figcaption') : null;

        var index = new Date().getHours() % prototypes.length;
        var chosen = prototypes[index];

        if (video.getAttribute('src') !== chosen.src) {
            video.setAttribute('src', chosen.src);
            video.load();
            video.play().catch(function () {}); // autoplay may be blocked pre-interaction
            video.setAttribute('aria-label', chosen.caption);
        }

        if (caption) caption.textContent = chosen.caption;
    }

    document.addEventListener('DOMContentLoaded', setHeroVideo);
    // Re-check each minute in case the hour rolls over while the tab is open.
    setInterval(setHeroVideo, 60 * 1000);
})();
