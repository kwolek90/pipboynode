// main.js — bootstrap loader for Atomic Command
(function() {
    const GAME_CONTAINER_ID = 'game-container';
    const LOADING_ID = 'loading-message';
    const SCRIPT_SRC = 'atomic-command.js';
    const LOAD_TIMEOUT_MS = 5000;

    function removeLoading() {
        const el = document.getElementById(LOADING_ID);
        if (el && el.parentNode) el.parentNode.removeChild(el);
    }

    function showError(msg) {
        console.error('[ATOMIC COMMAND] Loader error:', msg);
        const container = document.getElementById(GAME_CONTAINER_ID);
        if (container) {
            container.innerHTML = `<div style="color:#ff4444; font-family: 'Courier New', monospace; text-align:center;">${msg}</div>`;
        }
    }

    // Load atomic-command.js dynamically, then initialize
    function loadGameScript() {
        // If atomicGame already present, init immediately
        if (window.atomicGame && typeof window.atomicGame.init === 'function') {
            try {
                window.atomicGame.init(GAME_CONTAINER_ID);
                removeLoading();
            } catch (e) {
                showError('Could not initialize game');
            }
            return;
        }

        const script = document.createElement('script');
        script.src = SCRIPT_SRC;
        script.async = true;
        let timedOut = false;
        const timeout = setTimeout(() => {
            timedOut = true;
            showError('Game script load timed out.');
        }, LOAD_TIMEOUT_MS);

        script.onerror = function() {
            clearTimeout(timeout);
            if (!timedOut) showError('Failed to load game script.');
        };

        script.onload = function() {
            clearTimeout(timeout);
            if (timedOut) return;
            if (window.atomicGame && typeof window.atomicGame.init === 'function') {
                try {
                    window.atomicGame.init(GAME_CONTAINER_ID);
                    removeLoading();
                } catch (e) {
                    showError('Error during game init');
                }
            } else {
                showError('Game script loaded but atomicGame not found.');
            }
        };

        document.head.appendChild(script);
    }

    // Wait for DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadGameScript);
    } else {
        loadGameScript();
    }
})();
