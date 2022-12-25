const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STOGARE_KEY = 'KEYSD_CONFIG';

const audio = $('#audio');
const cdThumb = $('.cd-thumb');
const songName = $('.title h1');
const songArtist = $('.title h3');

const btnControl = $('.ctrl__btn');
const btnPlay = $('.ctrl__btn-tonggle--item');
const btnNext = $('.ctrl__btn--next');
const btnPrev = $('.ctrl__btn--prev');
const btnRandom = $('.ctrl__btn--random');
const btnRepeat = $('.ctrl__btn--repeat');

const progressBar = $('.ctrl__progress--value');

const timeCurrent = $('.ctrl__progress-time--current');
const timeDuration = $('.ctrl__progress-time--duration');

const volumeBar = $('.ctrl__volume--value');
const volumeUp = $('.volume__icon');
const volumeMute = $('.mute');

const playlist = $('.music__playlist');
const playlistBtn = $('.song__thumb');

const app = {
    songs: [
        {
            name: 'Lemon tree',
            singer: 'DJ DESA Remix',
            image: 'https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg',
            path: './music/Lemon_Tree_DJ_DESA_Remix_Lyrics_Vietsub_TikTok.mp3',
        },
        {
            name: 'Cưới Thôi Masiu x Masew',
            singer: 'Masew',
            image: './img/Cuoi_thoi_Masiu_x_Masew.jpg',
            path: './music/Cuoi_thoi_Masiu_x_Masew.mp3',
        },
        {
            name: '原神MMD アンチグラビティーズ',
            singer: 'Nahida',
            image: './img/a.jpg',
            path: './music/a.mp3',
        },
        {
            name: 'Alan Walker Remix',
            singer: 'Alan Walker',
            image: './img/Alan_Walker_Remix.jpg',
            path: './music/Alan_Walker_Remix.mp3',
        },
        {
            name: 'EDM Northern light',
            singer: 'Vexento',
            image: './img/EDM_Northern_light_Vexento.jpg',
            path: './music/EDM_Northern_light_Vexento.mp3',
        },
        {
            name: 'Masked Heroes',
            singer: 'Vexento',
            image: './img/Masked_Heroes-Vexento.jpg',
            path: './music/Masked Heroes  Vexento  EDM Dịu Dàng .mp3',
        },
        {
            name: 'Nightcore Summersong 2018',
            singer: 'no',
            image: './img/Nightcore  Summersong 2018.jpg',
            path: './music/Nightcore  Summersong 2018.mp3',
        },
        {
            name: 'Quyền Năng OST Free',
            singer: 'Guilty Grown',
            image: './img/Quyền Năng OST Free.jpg',
            path: './music/Quyền Năng OST Free .mp3',
        },
        {
            name: 'Lời nói dối tháng tư của em',
            singer: 'Orange',
            image: './img/Orange  Nhạc phim Lời nói dối tháng tư của em.jpg',
            path: './music/Orange  Nhạc phim Lời nói dối tháng tư của em.mp3',
        },
        {
            name: 'Quyền Năng OST Free',
            singer: 'Guilty Grown',
            image: './img/Quyền Năng OST Free.jpg',
            path: './music/Quyền Năng OST Free .mp3',
        },
        {
            name: 'Lời nói dối tháng tư của em',
            singer: 'Orange',
            image: './img/Orange  Nhạc phim Lời nói dối tháng tư của em.jpg',
            path: './music/Orange  Nhạc phim Lời nói dối tháng tư của em.mp3',
        },
    ],

    currentIndex: 0,
    theVolume: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    config: JSON.parse(localStorage.getItem(PLAYER_STOGARE_KEY)) || {},
    setConfig: function (key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STOGARE_KEY, JSON.stringify(this.config));
    },
    loadConfig: function () {
        this.isRandom = this.config.isRandom || false;
        this.isRepeat = this.config.isRepeat || false;
        this.theVolume = this.config.volume || 100;
    },
    loadStatusConfig: function () {
        btnRandom.classList.toggle('active', this.isRandom);
        btnRepeat.classList.toggle('active', this.isRepeat);
        volumeBar.value = this.theVolume;
        audio.volume = this.theVolume / 100;
    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    // A1 - Render playlist ra màn hình
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `      
            <div class="playlist__song ${index === 0 ? 'active' : ''}" data-index="${index}">
                <div class="song__thumb" style="background-image: url('${song.image}')">
                </div>
    
                <div class="song__content">
                    <h3 class="song__title">${song.name}</h3>
                    <p class="song__author">${song.singer}</p>
                </div>
            </div>
                `;
        });

        playlist.innerHTML = htmls.join('\n');
    },

    handleEvents: function () {
        const _this = this;

        const btnShowPlaylist = $('.btn-playlist-show');
        const btnHidePlaylist = $('.btn-playlist-hide');
        const musicDashboard = $('.music__dashboard');

        const listSong = $$('.playlist__song');

        // A2 - CD rotate
        const cdThumAnimation = cdThumb.animate([{ transform: 'rotate(360deg)' }], {
            duration: 10000,
            iterations: Infinity,
        });
        cdThumAnimation.pause();

        // A3 - Sự kiện click để hiện danh sách bài hát
        btnShowPlaylist.addEventListener('click', () => {
            playlist.classList.toggle('active');
            playlist.classList.remove('non-active');
            musicDashboard.classList.toggle('non-active');

            btnShowPlaylist.classList.add('hide');
            btnHidePlaylist.classList.add('show');
            btnHidePlaylist.classList.remove('hide');
        });

        // A3 - Sự kiện click để ẩn danh sách bài hát
        btnHidePlaylist.addEventListener('click', () => {
            playlist.classList.toggle('active');
            playlist.classList.add('non-active');
            musicDashboard.classList.toggle('non-active');

            btnHidePlaylist.classList.add('hide');
            btnShowPlaylist.classList.add('show');
            btnShowPlaylist.classList.remove('hide');
        });

        //A4 - Play / pause / seek / xử lý âm lượng
        btnPlay.addEventListener('click', () => {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        });

        // Xử lý khi play
        audio.onplay = () => {
            _this.isPlaying = true;
            btnControl.classList.add('playing');
            cdThumAnimation.play();
        };

        // Xử lý khi pause
        audio.onpause = () => {
            _this.isPlaying = false;
            btnControl.classList.remove('playing');
            cdThumAnimation.pause();
        };

        // Theo dõi tiến độ bài hát
        audio.addEventListener('timeupdate', function () {
            // method duration trả về độ dài của audio/video
            const audioDuration = audio.duration;

            if (!isNaN(audioDuration)) {
                // audio.currentTime trả về thời gian đang chạy của audio/video
                const progressPercent = (audio.currentTime / audio.duration) * 100;

                // gán phần trăm bài hát vào thanh progress
                progressBar.value = progressPercent;
            }

            let currentMinutes = Math.floor(audio.currentTime / 60);
            let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);

            if (currentMinutes < 10) {
                currentMinutes = `0${currentMinutes}`;
            }

            if (currentSeconds < 10) {
                currentSeconds = `0${currentSeconds}`;
            }

            timeCurrent.textContent = `${currentMinutes}:${currentSeconds}`;
        });

        /* ========== Hiển thị thời gian bài hát ========== */
        audio.addEventListener('loadedmetadata', function () {
            let durationMinutes = Math.floor(audio.duration / 60);
            let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

            if (durationMinutes < 10) {
                durationMinutes = `0${durationMinutes}`;
            }

            if (durationSeconds < 10) {
                durationSeconds = `0${durationSeconds}`;
            }

            timeDuration.textContent = `${durationMinutes}:${durationSeconds}`;
        });

        // Xử lý khi tua bài hát
        progressBar.oninput = (e) => {
            const seekTime = (audio.duration / 100) * e.target.value;
            audio.currentTime = seekTime;
        };

        // Xử lý âm lượng
        volumeBar.oninput = (e) => {
            _this.theVolume = e.target.value / 100;
            audio.volume = _this.theVolume;
            _this.setConfig('volume', _this.theVolume * 100);

            if (_this.theVolume === 0) {
                volumeUp.classList.add('over__block');
                volumeMute.classList.remove('over__block');
            } else {
                volumeUp.classList.remove('over__block');
                volumeMute.classList.add('over__block');
            }
        };

        // Xử lý khi ấn btn volumeUp
        volumeUp.onclick = function () {
            volumeUp.classList.add('over__block');
            volumeMute.classList.remove('over__block');
            audio.volume = 0;
            volumeBar.value = 0;
        };

        // Xử lý khi ấn btn volumeMute
        volumeMute.onclick = function () {
            volumeUp.classList.remove('over__block');
            volumeMute.classList.add('over__block');
            audio.volume = 1;
            volumeBar.value = 100;
        };

        // Xử lý khi next song
        btnNext.onclick = function () {
            const oldCurrentIndex = _this.currentIndex;

            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();
            }

            audio.play();

            console.log(oldCurrentIndex, _this.currentIndex);
            listSong[oldCurrentIndex].classList.remove('active');
            listSong[_this.currentIndex].classList.add('active');
            _this.scrollToActiveSong();
        };

        // Xử lý khi prev song
        btnPrev.onclick = function () {
            const oldCurrentIndex = _this.currentIndex;

            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();
            }
            audio.play();

            listSong[oldCurrentIndex].classList.remove('active');
            listSong[_this.currentIndex].classList.add('active');

            _this.scrollToActiveSong();
        };

        // Xử lý khi random song
        btnRandom.onclick = function () {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            btnRandom.classList.toggle('active', _this.isRandom);
        };

        // Xử lý khi repeat song
        btnRepeat.onclick = function () {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        };

        // Xử lý khi bài hát kết thúc
        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play();
            } else {
                btnNext.click();
            }
        };

        // Lắng nghe hành vi click vào playlist
        playlist.addEventListener('click', function (e) {
            const songNode = e.target.closest('.playlist__song:not(.active)');
            const oldCurrentIndex = _this.currentIndex;

            if (songNode || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    audio.play();

                    listSong[oldCurrentIndex].classList.remove('active');
                    listSong[_this.currentIndex].classList.add('active');
                }
            }
        });
    },

    // Xử lý active bài hat
    scrollToActiveSong: function () {
        const blockValue = this.currentIndex === 0 ? 'end' : 'start';

        setTimeout(function () {
            $('.playlist__song.active').scrollIntoView({
                behavior: 'smooth',
                block: blockValue,
            });
        }, 100);
    },

    loadCurrentSong: function () {
        songName.textContent = this.currentSong.name;
        songArtist.textContent = this.currentSong.singer;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.setAttribute('src', `${this.currentSong.path}`);
    },

    nextSong: function () {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    prevSong: function () {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    playRandomSong: function () {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while (newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function () {
        this.loadConfig();
        // render playlist
        this.render();
        // Định nghĩa object gán chỉ mục
        this.defineProperties();
        // Hiển thị bài đầu tiên khi chạy app
        this.loadCurrentSong();
        //load status config
        this.loadStatusConfig();
        //handle event DOM
        this.handleEvents();
    },
};

app.start();
