/**
 * targetDemo.js — the hero's game-feel demonstration.
 *
 * Shows the craft the page claims: hit-stop, screenshake, particle bursts,
 * eased spawns, combo escalation. Built from the Target Practice MP prototype.
 *
 * Rules this module holds to:
 *   1. The canvas is NEVER blank. There is always a composed frame on screen,
 *      whether idle, playing, or finished.
 *   2. Nothing on the page is gated behind playing it.
 *   3. prefers-reduced-motion removes shake and particles but keeps it playable.
 *
 * The blank-canvas trap this is written to avoid: setting canvas.width resets
 * the backing store AND clears it. ResizeObserver delivers its first callback
 * asynchronously, so any paint done during setup gets wiped a tick later. Every
 * resize must therefore be followed by a repaint of whatever state we are in.
 */
(function () {
    'use strict';

    var PALETTE = {
        accent: '#9BC848',   // Xbox-era green
        glow:   '#C6F06A',   // ring-of-light bloom
        crit:   '#FFB020',   // combo / critical
        miss:   '#FF7A6B',
        grid:   'rgba(155, 200, 72, .05)',
        rail:   'rgba(155, 200, 72, .16)'
    };

    var ROUND_SECONDS = 30;

    document.addEventListener('DOMContentLoaded', function () {
        var root = document.querySelector('[data-target-demo]');
        if (!root) return;

        var canvas = root.querySelector('canvas');
        var overlay = root.querySelector('[data-demo-overlay]');
        var titleEl = root.querySelector('[data-demo-title]');
        var subEl = root.querySelector('[data-demo-sub]');
        var playBtn = root.querySelector('[data-demo-play]');
        var skipBtn = root.querySelector('[data-demo-skip]');
        var scoreEl = root.querySelector('[data-demo-score]');
        var comboEl = root.querySelector('[data-demo-combo]');
        if (!canvas || !overlay) return;

        var ctx = canvas.getContext('2d');
        if (!ctx) return;

        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        // ---- state -------------------------------------------------------
        var W = 0, H = 0;
        var phase = 'idle';           // idle | playing | over
        var targets = [], particles = [];
        var score = 0, combo = 0, bestCombo = 0;
        var shake = 0, hitStop = 0, flash = 0, flashColor = PALETTE.glow;
        var timeLeft = ROUND_SECONDS, spawnIn = 0;
        var lastFrame = 0, rafId = 0, onScreen = true;

        function rand(a, b) { return a + Math.random() * (b - a); }

        // ---- sizing ------------------------------------------------------
        function resize() {
            var rect = canvas.getBoundingClientRect();
            var w = Math.max(1, Math.round(rect.width));
            var h = Math.max(1, Math.round(rect.height));
            var dpr = Math.min(window.devicePixelRatio || 1, 2);

            // Skip when nothing actually changed, so we don't clear for free.
            if (w === W && h === H && canvas.width === Math.round(w * dpr)) return;

            W = w; H = h;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            render();                       // <- the fix: always repaint after a resize
        }

        // ---- drawing -----------------------------------------------------
        function drawGrid() {
            ctx.strokeStyle = PALETTE.grid;
            ctx.lineWidth = 1;
            for (var y = 0; y < H; y += 22) {
                ctx.beginPath();
                ctx.moveTo(0, y + 0.5);
                ctx.lineTo(W, y + 0.5);
                ctx.stroke();
            }
        }

        function drawTargetRing(x, y, r, alpha) {
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = PALETTE.accent;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = alpha * 0.34;
            ctx.beginPath();
            ctx.arc(x, y, r * 0.62, 0, Math.PI * 2);
            ctx.stroke();

            ctx.globalAlpha = alpha;
            ctx.fillStyle = PALETTE.glow;
            ctx.beginPath();
            ctx.arc(x, y, Math.max(1.5, r * 0.17), 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1;
        }

        /** The resting frame. Composed on purpose so an arriving visitor never
         *  sees an empty box, which reads as broken rather than restrained. */
        function renderIdle() {
            ctx.clearRect(0, 0, W, H);
            drawGrid();
            var cx = W / 2, cy = H / 2;
            var unit = Math.min(W, H);
            drawTargetRing(cx, cy, unit * 0.115, 0.85);
            drawTargetRing(cx - unit * 0.29, cy - unit * 0.17, unit * 0.072, 0.4);
            drawTargetRing(cx + unit * 0.27, cy + unit * 0.2, unit * 0.06, 0.28);
        }

        function renderPlaying(now) {
            ctx.clearRect(0, 0, W, H);
            ctx.save();
            if (shake > 0) ctx.translate(rand(-shake, shake), rand(-shake, shake));

            drawGrid();

            var i, t;
            for (i = 0; i < targets.length; i++) {
                t = targets[i];
                if (t.hit) {
                    var e = 1 - Math.pow(1 - t.pop, 3);
                    ctx.globalAlpha = 1 - e;
                    ctx.strokeStyle = PALETTE.glow;
                    ctx.lineWidth = 3;
                    ctx.beginPath();
                    ctx.arc(t.x, t.y, t.r + e * 30, 0, Math.PI * 2);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                    continue;
                }
                var age = (now - t.born) / t.life;
                var grow = age < 0.14 ? 1 - Math.pow(1 - age / 0.14, 3) : 1;
                var alpha = age > 0.78 ? Math.max(0, 1 - (age - 0.78) / 0.22) : 1;
                drawTargetRing(t.x, t.y, t.r * grow, alpha);
            }

            for (i = 0; i < particles.length; i++) {
                var p = particles[i];
                ctx.globalAlpha = Math.max(0, 1 - p.t / p.life);
                ctx.fillStyle = p.color;
                ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            }
            ctx.globalAlpha = 1;

            ctx.fillStyle = PALETTE.rail;
            ctx.fillRect(0, H - 3, W, 3);
            ctx.fillStyle = PALETTE.accent;
            ctx.fillRect(0, H - 3, W * Math.max(0, timeLeft / ROUND_SECONDS), 3);

            ctx.restore();

            if (flash > 0) {
                ctx.fillStyle = flashColor;
                ctx.globalAlpha = flash * 0.16;
                ctx.fillRect(0, 0, W, H);
                ctx.globalAlpha = 1;
            }
        }

        /** Single entry point so any caller can repaint the current state. */
        function render(now) {
            if (!W || !H) return;
            if (phase === 'playing') renderPlaying(now || performance.now());
            else renderIdle();
        }

        // ---- simulation --------------------------------------------------
        function spawn() {
            var r = rand(19, 34);
            var pad = r + 14;
            targets.push({
                x: rand(pad, Math.max(pad + 1, W - pad)),
                y: rand(pad, Math.max(pad + 1, H - pad)),
                r: r, born: performance.now(), life: rand(1500, 2400),
                hit: false, pop: 0
            });
        }

        function burst(x, y, color, n) {
            if (reduceMotion) return;
            for (var i = 0; i < n; i++) {
                var a = rand(0, Math.PI * 2), s = rand(60, 290);
                particles.push({
                    x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
                    life: rand(0.32, 0.72), t: 0, color: color, size: rand(1.6, 3.6)
                });
            }
        }

        function setCombo(n) {
            combo = n;
            if (comboEl) {
                comboEl.textContent = 'x' + combo;
                comboEl.classList.toggle('is-hot', combo >= 5);
            }
        }

        function step(dt, now) {
            if (hitStop > 0) { hitStop -= dt; dt *= 0.06; }   // freeze, don't skip
            timeLeft -= dt;
            if (timeLeft <= 0) { finish(); return false; }

            spawnIn -= dt;
            var live = 0, i;
            for (i = 0; i < targets.length; i++) if (!targets[i].hit) live++;
            var allowed = Math.min(4, 1 + Math.floor((ROUND_SECONDS - timeLeft) / 9));
            if (spawnIn <= 0 && live < allowed) { spawn(); spawnIn = rand(0.34, 0.72); }

            for (i = targets.length - 1; i >= 0; i--) {
                var t = targets[i];
                if (t.hit) {
                    t.pop += dt * 6;
                    if (t.pop >= 1) targets.splice(i, 1);
                } else if (now - t.born > t.life) {
                    targets.splice(i, 1);
                    setCombo(0);
                }
            }

            for (i = particles.length - 1; i >= 0; i--) {
                var p = particles[i];
                p.t += dt;
                if (p.t >= p.life) { particles.splice(i, 1); continue; }
                p.x += p.vx * dt; p.y += p.vy * dt;
                p.vy += 520 * dt; p.vx *= 0.975; p.vy *= 0.975;
            }

            if (shake > 0) shake = Math.max(0, shake - dt * 46);
            if (flash > 0) flash = Math.max(0, flash - dt * 1.5);
            return true;
        }

        function frame(now) {
            rafId = 0;
            if (phase !== 'playing') return;
            var dt = Math.min((now - lastFrame) / 1000, 0.05);
            lastFrame = now;
            try {
                if (!step(dt, now)) return;
                renderPlaying(now);
            } catch (err) {
                // Never leave a dead loop behind a blank box.
                if (window.console) console.error('targetDemo:', err);
                finish();
                return;
            }
            schedule();
        }

        function schedule() {
            if (phase === 'playing' && onScreen && !rafId) {
                rafId = window.requestAnimationFrame(frame);
            }
        }

        // ---- input -------------------------------------------------------
        function shootAt(px, py) {
            if (phase !== 'playing') return;
            for (var i = targets.length - 1; i >= 0; i--) {
                var t = targets[i];
                if (t.hit) continue;
                if (Math.hypot(px - t.x, py - t.y) <= t.r + 4) {
                    t.hit = true; t.pop = 0;
                    setCombo(combo + 1);
                    bestCombo = Math.max(bestCombo, combo);
                    var crit = combo % 5 === 0;
                    score += 10 + combo * 2 + (crit ? 25 : 0);
                    if (!reduceMotion) { shake = crit ? 13 : 7; hitStop = crit ? 0.085 : 0.05; }
                    flash = crit ? 0.28 : 0.16;
                    flashColor = crit ? PALETTE.crit : PALETTE.glow;
                    burst(t.x, t.y, crit ? PALETTE.crit : PALETTE.glow, crit ? 26 : 15);
                    if (scoreEl) scoreEl.textContent = score;
                    return;
                }
            }
            setCombo(0);
            flash = 0.1; flashColor = PALETTE.miss;
            burst(px, py, PALETTE.miss, 5);
        }

        // ---- lifecycle ---------------------------------------------------
        function start() {
            resize();
            targets = []; particles = [];
            score = 0; bestCombo = 0; shake = 0; hitStop = 0; flash = 0;
            timeLeft = ROUND_SECONDS; spawnIn = 0;
            setCombo(0);
            if (scoreEl) scoreEl.textContent = '0';

            phase = 'playing';
            overlay.classList.add('is-hidden');
            overlay.setAttribute('aria-hidden', 'true');
            lastFrame = performance.now();
            spawn();                       // guarantee something on frame one
            renderPlaying(lastFrame);      // paint synchronously, don't wait for rAF
            schedule();
        }

        function finish() {
            phase = 'over';
            if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
            if (titleEl) titleEl.textContent = score > 0 ? score + ' points' : 'Time';
            if (subEl) {
                subEl.textContent = 'Best combo x' + bestCombo +
                    '. The hit-stop, shake and particles are doing the work, not the score.';
            }
            if (playBtn) playBtn.textContent = 'Play again';
            overlay.classList.remove('is-hidden');
            overlay.setAttribute('aria-hidden', 'false');
            renderIdle();
        }

        function pointerPos(e) {
            var rect = canvas.getBoundingClientRect();
            return [e.clientX - rect.left, e.clientY - rect.top];
        }

        canvas.addEventListener('pointerdown', function (e) {
            e.preventDefault();
            var p = pointerPos(e);
            shootAt(p[0], p[1]);
        });

        if (playBtn) playBtn.addEventListener('click', start);
        if (skipBtn) skipBtn.addEventListener('click', function () {
            var next = document.getElementById('work');
            if (next) next.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && phase === 'playing') { finish(); }
        });

        // Pause off-screen, and always repaint on the way back in.
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (entries) {
                onScreen = entries[0].isIntersecting;
                if (onScreen) { render(); schedule(); }
                else if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
            }, { threshold: 0.05 }).observe(canvas);
        }

        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
                lastFrame = performance.now();
                render();
                schedule();
            }
        });

        if ('ResizeObserver' in window) {
            new ResizeObserver(function () { resize(); }).observe(canvas);
        } else {
            window.addEventListener('resize', resize);
        }

        // Initial paint. resize() renders; this covers the no-op-resize case.
        resize();
        render();
    });
})();
