console.log("Lets write java script");

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
async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let responce = await a.text();
    // console.log(responce)
 
    let div = document.createElement("div");
    div.innerHTML = responce;
    let as = div.getElementsByTagName("a")

    songs = [];

    for(let index=0; index<as.length; index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            let songName = decodeURIComponent(element.href.split("/").pop().replace(".mp3", ""));
            songs.push(songName);
        }
    }
    return songs
}

async function main() {
    let songs = await getSongs();
    // console.log("Songs List in main():", songs);
    
    let songul = document.querySelector(".songList ul");
    for (const song of songs) {
        let li = document.createElement("li");
        li.innerHTML = `
            <img class="controls-music " src="./music.svg" alt="Music Icon">
            <div class="info ">
                <div class="songName">${song}</div>
            </div>
            <img class= "controls playNow" src = "play.svg" alt="">
        `;
        songul.appendChild(li);
    }


    var audio = new Audio(`songs/${songs[0]}.mp3`);
    audio.play()
        .catch(err => console.error("❌ Playback error:", err));


    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
        console.log("Audio Duration:", audio.duration);
        console.log(audio.currentSrc)
        console.log(audio.currentTime)
    });
    
}

main();
