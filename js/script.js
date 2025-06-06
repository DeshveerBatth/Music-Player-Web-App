console.log("Lets write java script");

const currentSong = document.getElementById("currentSong");
currentSong.volume = 0.5; // default volume

let currentSongIndex = 0;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) return "00:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

const play = document.querySelector(".controls-playbar.play"); // Select the play button

let songs;
async function getSongs(folder) {
    currFolder = folder;
    songs = [];

    try {
        let response = await fetch(`/${folder}/songs.json`);
        songs = await response.json();  // Expecting JSON array of song names
    } catch (err) {
        console.error("Failed to fetch songs.json for folder:", folder, err);
    }

    let songul = document.querySelector(".songList ul");
    songul.innerHTML = "";

    for (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img class="controls-music" src="./img/music.svg" alt="Music Icon">
            <div class="info">
                <div class="songName">${song}</div>
            </div>
            <img class="controls playNow" src="img/play.svg" alt="">
        `;
        songul.appendChild(li);
    }

    document.querySelectorAll(".songList li").forEach((e, index) => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info .songName").textContent.trim();
            currentSongIndex = index;
            console.log("Playing song:", songName);
            playMusic(songName);
        });
    });

    console.log("Fetched songs:", songs);
    return songs;
}


const playMusic = (track, pause = false) => {
    currentSong.pause();
    currentSong.src = `/${currFolder}/${encodeURIComponent(track)}.mp3`;
    // currentSong.src = `https://deshveerbatth.github.io/Spotify-Clone/${currFolder}/${encodeURIComponent(track)}.mp3`;

    currentSong.load();

    if (!pause) {
        currentSong.play().catch(err => console.error("Playback error:", err));
        play.src = "img/pause.svg";
    } else {
        play.src = "img/play.svg";
    }

    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";


};

async function displayPlaylists({ path, containerSelector, playFirst = false }) {
    try {
        // 1. Fetch index.json (e.g., ["ncs", "lofi", "punjabi"])
        let res = await fetch(`/${path}/index.json`);
        let folders = await res.json(); // array of folder names like ["ncs", "punjabi"]

        let container = document.querySelector(containerSelector);
        container.innerHTML = ""; // clear old content

        // 2. For each folder, fetch its info and render card
        for (let folder of folders) {
            try {
                let infoRes = await fetch(`/${path}/${folder}/info.json`);
                let data = await infoRes.json(); // { title, description }

                container.innerHTML += `
                    <div data-folder="${folder}" class="cards rounded">
                        <div class="card-img-wrapper">
                            <img class="card-img" src="/${path}/${folder}/cover.jpeg" alt="Cover Image" class="hover-image">
                            <div class="svg-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"/>
                                </svg>
                            </div>
                        </div>
                        <h3>${data.title}</h3>
                        <p>${data.description}</p>
                    </div>`;
            } catch (err) {
                console.error(`Error loading info.json for ${folder}:`, err);
            }
        }

        // 3. Add click event to each card
        document.querySelectorAll(`${containerSelector} .cards`).forEach(card => {
            card.addEventListener("click", async () => {
                let folder = card.dataset.folder;
                let songs = await getSongs(`${path}/${folder}`);
                if (songs && songs.length > 0) {
                    playMusic(songs[0]); // play the first song
                }
            });
        });

    } catch (error) {
        console.error(`Error loading playlists from /${path}/index.json:`, error);
    }
}


async function main() {

    await getSongs("songs/ncs");

    playMusic(songs[currentSongIndex], true);

    displayPlaylists({ path: "songs", containerSelector: ".spotify-container", playFirst: true });
    displayPlaylists({ path: "user-songs", containerSelector: ".user-container" });
    displayPlaylists({ path: "albums", containerSelector: ".album-container" });

    //attach event listners to play,next and previous listeners
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg";
        }
    })

    //time update event
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songTime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // adding an event listner to the seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    document.querySelector(".previous").addEventListener("click", e => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playMusic(songs[currentSongIndex]);
    });


    // Next button event
    document.querySelector(".next").addEventListener("click", e => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playMusic(songs[currentSongIndex]);
    });

    document.querySelector(".repeat").addEventListener("click", e => {
        currentSong.currentTime = 0;
    });


    //add an event to volume
    const volumeSlider = document.getElementById("volumeSlider");
    const volumecon = document.querySelector(".volume");

    // Update volume on slider input
    volumeSlider.addEventListener("input", () => {
        const volumeValue = volumeSlider.value; // 0 to 100
        currentSong.volume = volumeValue / 100; // Assuming currentSong is your audio element

        // Change icon based on volume
        if (currentSong.volume === 0) {
            volumecon.src = "img/mute.svg";
        } else {
            volumecon.src = "img/volume.svg";
        }
    });


    const volumeIcon = document.querySelector(".volume");
    const volumePopup = document.getElementById("volumePopup");

    volumeIcon.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent click from closing immediately
        volumePopup.style.display = volumePopup.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", (e) => {
        if (!e.target.closest(".volume-wrapper")) {
            volumePopup.style.display = "none";
        }
    });


    // event listner for hamburger
    const sidebar = document.querySelector(".leftborder"); // ADD THIS
    const overlay = document.querySelector(".overlay");
    const cross = document.querySelector(".crosss");
    const right = document.querySelector(".right");

    document.querySelector(".hamburg").addEventListener("click", () => {
        sidebar.style.left = "0";
        overlay.style.display = "block";
    });


    overlay.addEventListener("click", () => {
        sidebar.style.left = "-100%";
        overlay.classList.remove("active");
    });

    cross.addEventListener("click", () => {
        sidebar.style.left = "-110%";
        right.style.display = "block"; // optional, if you hide/show right dynamically
        overlay.classList.remove("active");
    });

}

main();