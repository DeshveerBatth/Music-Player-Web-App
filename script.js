
console.log("Lets write java script");


const currentSong = document.getElementById("currentSong");
let currentSongIndex = 0;


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
async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
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
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.pause();
    // currentSong.src = `/songs/${encodeURIComponent(track)}.mp3`;
    currentSong.src = `https://deshveerbatth.github.io/Spotify-Clone/songs/${encodeURIComponent(track)}.mp3`;

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




async function main() {

    let songs = await getSongs();
    // console.log("Songs List in main():", songs);

    playMusic(songs[currentSongIndex], true);

    let songul = document.querySelector(".songList ul");
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
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })


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
