// radio.js - clean stable implementation
// Version marker
// - renders stations list
// - auto-starts last or first station on tab load
(function () {
  function initializeRadioTab() {
    var stationsList = document.getElementById('stations-list');
    var audio = document.getElementById('radio-audio');
    var stationName = document.getElementById('station-name');
    var nowPlaying = document.getElementById('now-playing');
    var trackArtist = document.getElementById('track-artist');
    var stationDesc = document.getElementById('station-desc');
    var frequencyDisplay = document.getElementById('frequency');
    var visualizer = document.getElementById('audio-visualizer');
    var audioContext = null;
    var analyser = null;
    var sourceNode = null;
    var rafId = null;
    var dataArray = null;
    var stations = [];
    var currentStation = null;
    var autoplayBlocked = false;
    var mutedFallback = false;
    var previousVolume = 1;

    function setupAudioNodes() {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (!analyser) {
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
      }
      if (!sourceNode) {
        try {
          sourceNode = audioContext.createMediaElementSource(audio);
          sourceNode.connect(analyser);
          analyser.connect(audioContext.destination);
        } catch (e) {
          console.warn('createMediaElementSource skipped:', e && e.message);
        }
      }
      if (!dataArray && analyser) {
        dataArray = new Uint8Array(analyser.frequencyBinCount);
      }
    }

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        audio.volume = 0;
      } else {
        audio.volume = previousVolume;
      }
    });

    function renderStations() {
      if (!stationsList) return;
      stationsList.innerHTML = '';
      for (var i = 0; i < stations.length; i++) {
        (function (st) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'radio-btn';
          btn.textContent = st.name + (st.frequency ? ' (' + st.frequency + ')' : '');
          btn.style.display = 'block';
          btn.style.width = '100%';
          btn.style.marginBottom = '8px';
          btn.addEventListener('click', function () {
            selectStation(st);
          });
          stationsList.appendChild(btn);
        })(stations[i]);
      }
    }

    function tryPlayAudio() {
      if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(function () {
        });
      }
      audio.play().then(function () {
        // ok
      }).catch(function (err) {
        if (err && (err.name === 'NotAllowedError' || (err.message && err.message.indexOf('play') !== -1))) {
          audio.muted = true;
          audio.play().then(function () {
            mutedFallback = true;
            nowPlaying.textContent = 'Odtwarzanie w trybie wyciszonym. Kliknij aby odblokować.';
          }).catch(function (err2) {
            autoplayBlocked = true;
            nowPlaying.textContent = 'Kliknij dowolny element strony, aby rozpocząć odtwarzanie radia.';
            console.error('play blocked (muted fallback):', err2);
          });
        } else {
          console.error('play() error:', err);
        }
      });
    }

    function playRandomTrackForStation(station) {
      if (!station) return;
      currentStation = station;
      try {
        localStorage.setItem('radioLastStationId', station.id);
      } catch (e) {
      }
      stationName.textContent = station.name || '';
      frequencyDisplay.textContent = station.frequency || '';
      stationDesc.textContent = station.description || '';
      nowPlaying.textContent = 'Ładowanie utworu...';
      trackArtist.textContent = '';

      fetch('/api/radio_stations/' + encodeURIComponent(station.id) + '/random')
          .then(function (r) {
            return r.json();
          })
          .then(function (data) {
            if (!data || !data.file) {
              nowPlaying.textContent = 'Nic obecnie nie gra w tej stacji.';
              return;
            }
            setupAudioNodes();
            audio.pause();
            audio.removeAttribute('preload');
            audio.src = data.file;
            audio.preload = 'auto';
            var startTime = getStartTime(station.id, data.duration || 0);
            var onMeta = function () {
              try {
                if (typeof startTime === 'number' && !isNaN(startTime) && startTime > 0 && startTime < audio.duration) {
                  audio.currentTime = startTime;
                }
              } catch (e) {
                console.warn('Could not set currentTime:', e && e.message);
              }
              nowPlaying.textContent = '♪ ' + (data.title || 'Nieznany tytuł') + ' ♪';
              trackArtist.textContent = data.artist ? ('Autor: ' + data.artist) : '';
              tryPlayAudio();
              audio.removeEventListener('loadedmetadata', onMeta);
            };
            audio.addEventListener('loadedmetadata', onMeta);
          })
          .catch(function (err) {
            console.error('Error fetching random track:', err);
            nowPlaying.textContent = 'Błąd ładowania utworu.';
          });
    }

    document.addEventListener('click', function () {
      if (mutedFallback) {
        try {
          audio.muted = false;
        } catch (e) {
        }
        mutedFallback = false;
        tryPlayAudio();
        return;
      }
      if (autoplayBlocked) {
        tryPlayAudio();
        autoplayBlocked = false;
      }
    });

    function selectStation(st) {
      if (!st) return;
      playRandomTrackForStation(st);
    }

    function getStartTime(stationId, duration) {
      var storage = {};
      try {
        storage = JSON.parse(localStorage.getItem('radioPlayback') || '{}');
      } catch (e) {
      }
      var info = storage[stationId];
      var now = Date.now();
      if (!info) {
        var maxStart = Math.max(0, (duration || 0) - 10);
        var randomStart = Math.floor(Math.random() * Math.max(1, Math.ceil(maxStart)));
        storage[stationId] = {time: randomStart, lastSwitch: now};
        try {
          localStorage.setItem('radioPlayback', JSON.stringify(storage));
        } catch (e) {
        }
        return randomStart;
      }
      var elapsed = Math.floor((now - (info.lastSwitch || now)) / 1000);
      var newTime = (info.time || 0) + elapsed;
      if (duration && newTime > duration - 2) newTime = 0;
      storage[stationId] = {time: newTime, lastSwitch: now};
      try {
        localStorage.setItem('radioPlayback', JSON.stringify(storage));
      } catch (e) {
      }
      return newTime;
    }

    function savePlaybackTime() {
      if (!currentStation || !audio) return;
      try {
        var storage = JSON.parse(localStorage.getItem('radioPlayback') || '{}');
        storage[currentStation.id] = {time: Math.floor(audio.currentTime || 0), lastSwitch: Date.now()};
        localStorage.setItem('radioPlayback', JSON.stringify(storage));
      } catch (e) {
        console.warn('savePlaybackTime error', e && e.message);
      }
    }

    function startVisualizer() {
      if (!visualizer) return;
      setupAudioNodes();
      if (!analyser || !dataArray) return;
      var ctx = visualizer.getContext('2d');

      function draw() {
        rafId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, visualizer.width, visualizer.height);
        var barWidth = (visualizer.width / dataArray.length) || 1;
        for (var i = 0; i < dataArray.length; i++) {
          var barHeight = dataArray[i] / 2;
          ctx.fillStyle = '#00ff00';
          ctx.fillRect(i * barWidth, visualizer.height - barHeight, barWidth - 2, barHeight);
        }
      }

      draw();
    }

    function stopVisualizer() {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (visualizer) {
        var ctx = visualizer.getContext('2d');
        ctx.clearRect(0, 0, visualizer.width, visualizer.height);
      }
    }

    // Initialize station list and event listeners
    fetch('/api/radio_stations')
        .then(function (r) {
          return r.json();
        })
        .then(function (data) {
          stations = Array.isArray(data.stations) ? data.stations : [];
          renderStations();
          if (stations.length === 0) {
            nowPlaying.textContent = 'Nie znaleziono żadnej stacji radiowej.';
            return;
          }
          var last = null;
          try {
            last = localStorage.getItem('radioLastStationId');
          } catch (e) {
          }
          var found = stations.find(function (s) {
            return s.id === last;
          }) || stations[0];
          selectStation(found);
        })
        .catch(function (err) {
          console.error('stations fetch error', err);
          nowPlaying.textContent = 'Błąd pobierania listy stacji.';
        });

    audio.addEventListener('play', startVisualizer);
    audio.addEventListener('pause', stopVisualizer);
    audio.addEventListener('ended', function () {
      savePlaybackTime();
      if (currentStation) playRandomTrackForStation(currentStation);
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(initializeRadioTab, 0);
  } else {
    document.addEventListener('DOMContentLoaded', initializeRadioTab);

  }
})();
