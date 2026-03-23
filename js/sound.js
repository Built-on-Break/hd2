/**
 * Sound effects for the casino animation using Web Audio API.
 * All sounds are synthesized — no audio files needed.
 */
window.HD2Sound = (function () {
    var ctx = null;
    var muted = false;
    var STORAGE_KEY = 'hd2-muted';

    /**
     * Lazily create AudioContext on first user interaction.
     */
    function getContext() {
        if (!ctx) {
            try {
                ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                return null;
            }
        }
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        return ctx;
    }

    /**
     * Load mute preference from localStorage.
     */
    function init() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'true') muted = true;
        } catch (e) {}
    }

    function isMuted() {
        return muted;
    }

    function toggleMute() {
        muted = !muted;
        try {
            localStorage.setItem(STORAGE_KEY, muted ? 'true' : 'false');
        } catch (e) {}
        return muted;
    }

    /**
     * Short click/tick sound for the spinning phase.
     */
    function playTick() {
        if (muted) return;
        var c = getContext();
        if (!c) return;

        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);

        osc.type = 'square';
        osc.frequency.value = 800 + Math.random() * 400;
        gain.gain.value = 0.04;
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.03);

        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.03);
    }

    /**
     * Satisfying lock-in sound when a card is revealed.
     */
    function playLock() {
        if (muted) return;
        var c = getContext();
        if (!c) return;

        // Low thud
        var osc = c.createOscillator();
        var gain = c.createGain();
        osc.connect(gain);
        gain.connect(c.destination);

        osc.type = 'sine';
        osc.frequency.value = 220;
        osc.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.12);
        gain.gain.value = 0.15;
        gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.15);

        osc.start(c.currentTime);
        osc.stop(c.currentTime + 0.15);

        // High click on top
        var osc2 = c.createOscillator();
        var gain2 = c.createGain();
        osc2.connect(gain2);
        gain2.connect(c.destination);

        osc2.type = 'triangle';
        osc2.frequency.value = 1200;
        gain2.gain.value = 0.08;
        gain2.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);

        osc2.start(c.currentTime);
        osc2.stop(c.currentTime + 0.06);
    }

    /**
     * Final fanfare after all cards are revealed.
     * Ascending three-note chime for Mission Ready, single tone for others.
     */
    function playFanfare(mode) {
        if (muted) return;
        var c = getContext();
        if (!c) return;

        if (mode === 'mission-ready') {
            // Three ascending notes: C5, E5, G5
            var notes = [523, 659, 784];
            for (var i = 0; i < notes.length; i++) {
                (function (freq, delay) {
                    var osc = c.createOscillator();
                    var gain = c.createGain();
                    osc.connect(gain);
                    gain.connect(c.destination);

                    osc.type = 'sine';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0, c.currentTime + delay);
                    gain.gain.linearRampToValueAtTime(0.1, c.currentTime + delay + 0.02);
                    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + 0.3);

                    osc.start(c.currentTime + delay);
                    osc.stop(c.currentTime + delay + 0.3);
                })(notes[i], i * 0.1);
            }
        } else if (mode === 'chaos') {
            // Descending warble for chaos
            var osc = c.createOscillator();
            var gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);

            osc.type = 'sawtooth';
            osc.frequency.value = 600;
            osc.frequency.exponentialRampToValueAtTime(200, c.currentTime + 0.3);
            gain.gain.value = 0.06;
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.35);

            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.35);
        } else {
            // Simple clean tone for balanced
            var osc = c.createOscillator();
            var gain = c.createGain();
            osc.connect(gain);
            gain.connect(c.destination);

            osc.type = 'sine';
            osc.frequency.value = 660;
            gain.gain.value = 0.1;
            gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.25);

            osc.start(c.currentTime);
            osc.stop(c.currentTime + 0.25);
        }
    }

    return {
        init: init,
        isMuted: isMuted,
        toggleMute: toggleMute,
        playTick: playTick,
        playLock: playLock,
        playFanfare: playFanfare
    };
})();
