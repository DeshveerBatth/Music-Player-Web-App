
console.log("Lets write java script");


const currentSong = document.getElementById("currentSong");
currentSong.volume = 0.5; // default volume

volumeSlider.value = currentSong.volume * 100;
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

// function secondsToMinutesSeconds(seconds) {
//     if (isNaN(seconds) || seconds < 0) {
//         return "00:00";
//     }

//     const minutes = Math.floor(seconds / 60);
//     const remainingSeconds = Math.floor(seconds % 60);

//     const formattedMinutes = String(minutes).padStart(2, '0');
//     const formattedSeconds = String(remainingSeconds).padStart(2, '0');

//     return `${formattedMinutes}:${formattedSeconds}`;
// }

let songs;
async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let responce = await a.text();
    // console.log(responce)

    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")

    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            let songName = decodeURIComponent(element.href.split("/").pop().replace(".mp3", ""));
            songs.push(songName);
        }
    }
    //   for (let index = 0; index < as.length; index++) {
    //     const element = as[index];
    //     if (element.href.endsWith(".mp3")) {
    //         let songName = element.textContent.trim();  // gets only the displayed song name
    //         songs.push(songName);
    //     }
    // }

    let songul = document.querySelector(".songList ul");
    songul.innerHTML = ""
    for (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img class="controls-music " src="./music.svg" alt="Music Icon">
            <div class="info">
                <div class="songName">${song}</div>
            </div>
            <img class= "controls playNow" src = "play.svg" alt="">
        `;
        songul.appendChild(li);
    }

    //attach event listener to each song
    document.querySelectorAll(".songList li").forEach((e, index) => {
        e.addEventListener("click", () => {
            let songName = e.querySelector(".info").firstElementChild.innerHTML.trim();
            currentSongIndex = index;
            console.log("Playing song:", songName);
            playMusic(songName);
        });
    });


}

const playMusic = (track, pause = false) => {
    currentSong.pause();
    // currentSong.src = `/${currFolder}/${encodeURIComponent(track)}.mp3`;
    currentSong.src = `https://deshveerbatth.github.io/Spotify-Clone/${currFolder}/${encodeURIComponent(track)}.mp3`;

    currentSong.load();

    if (!pause) {
        currentSong.play().catch(err => console.error("Playback error:", err));
        play.src = "pause.svg";
    } else {
        play.src = "play.svg";
    }

    document.querySelector(".songInfo").innerHTML = track;
    document.querySelector(".songTime").innerHTML = "00:00 / 00:00";


};


//event listener to play song
// const playMusic = (track, pause = false) => {
//     currentSong.pause(); // stop if already playing
//     currentSong.src = `/songs/${encodeURIComponent(track)}.mp3`;
//     currentSong.load(); // reload the new song

//     if (!pause) {
//         currentSong.play().catch(err => console.error("Playback error:", err));
//         play.src = "pause.svg";
//     } else {
//         play.src = "play.svg";
//     }

//     document.querySelector(".songInfo").innerHTML = track;
//     document.querySelector(".songTime").innerHTML = "00:00 / 00:00";
// };

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let responce = await a.text();
    let div = document.createElement("div")
    div.innerHTML = responce;
    let anchors = div.getElementsByTagName("a");
    let cardcontainer = document.querySelector(".cardcontainer")
    let array = Array.from(anchors)
    for(let index = 0; index< array.length; index++){
        const e = array[index];
        if (e.href.includes("/songs/")) {
            let folder = e.href.split("/songs/")[1];
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let responce = await a.json();
            console.log(responce)
            cardcontainer.innerHTML = cardcontainer.innerHTML + `<div data-folder = "${folder}" class="cards rounded">
                        <div class="card-img-wrapper">
                            <img class="card-img" src="/songs/${folder}/cover.jpeg"
                                alt="Sample Image" class="hover-image">
                            <div class="svg-overlay">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                                    <path
                                        d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z" />
                                </svg>
                            </div>
                        </div>
                        <h3>${responce.title}</h3>
                        <p>${responce.description}</p>
                    </div>`
        }
    }

    //load the playlist according to the playlist clicked
    Array.from(document.getElementsByClassName("cards")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
        });
    });


}




async function main() {

    await getSongs("songs/ncs2");
    // console.log("Songs List in main():", songs);

    playMusic(songs[currentSongIndex], true);

    displayAlbums()

    //attach event listners to play,next and previous listeners
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
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

    // document.querySelector(".shuffle").addEventListener("click", e => {
    //     let randomIndex = Math.floor(Math.random() * songs.length);
    //     let randomSong = songs[randomIndex];
    //     playMusic(randomSong);

    // });


    //add an event to volume
    const volumeSlider = document.getElementById("volumeSlider");
const volumecon = document.querySelector(".volume");

// Update volume on slider input
volumeSlider.addEventListener("input", () => {
    const volumeValue = volumeSlider.value; // 0 to 100
    currentSong.volume = volumeValue / 100; // Assuming currentSong is your audio element

    // Change icon based on volume
    if (currentSong.volume === 0) {
        volumecon.src = "mute.svg";
    } else {
        volumecon.src = "volume.svg";
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





    // var audio = new Audio(`songs/${songs[0]}.mp3`);
    // audio.play()
    //     .catch(err => console.error("❌ Playback error:", err));


    // audio.addEventListener("loadeddata", () => {
    //     let duration = audio.duration;
    //     console.log("Audio Duration:", audio.duration);
    //     console.log(audio.currentSrc)
    //     console.log(audio.currentTime)
    // });

    // event listner for hamburger
    const sidebar = document.querySelector(".leftborder"); // ADD THIS
    const overlay = document.querySelector(".overlay");
    const cross = document.querySelector(".crosss");
    const right = document.querySelector(".right");

    document.querySelector(".hamburg").addEventListener("click", () => {
        sidebar.style.left = "0";
        overlay.classList.add("active");
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
