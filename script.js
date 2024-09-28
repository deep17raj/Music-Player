console.log("Hello Detective");
  let currentSong = new Audio();
  function secondsToMinuteSecond(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let res = await a.text();
  let div = document.createElement("div");
  div.innerHTML = res;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];

    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}

const playMusic = (track,pause=false)=>{
  currentSong.src = "/songs/"+track;
  if(!pause){
    currentSong.play();
  playAndPause.src = "pause.svg";
  }
  
  document.querySelector(".song-info").innerHTML=decodeURI(track);
  document.querySelector(".song-time").innerHTML=" 00:00 / 00:00"
}

async function main() {
  let song = await getSongs();
  playMusic(song[6],true)

  let songUl = document
    .querySelector(".song-list")
    .getElementsByTagName("ul")[0];
  for (const s of song) {
    let songName = s.replaceAll("%20", " ").split("-")[0];

    let restInfo = s.replaceAll("%20", " ").split("-")[1];
    songUl.innerHTML =
      songUl.innerHTML +
      `
    <li class="flex gap-1 ">
                  <img class="music" src="music.svg" alt="" />
                  <div class="info">
                  <div class="none">${s.replaceAll("%20", " ")}</div>
                    <div>${songName}</div>
                    <div>${restInfo.split(".")[0]}</div>
                  </div>
                  <div class="play-now">
                    <span>Play Now</span>
                  <img src="play2.svg" alt="">
                  </div>
                </li>
    `;
  }

// Attach an event listener to songs
Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(element => {
  element.addEventListener("click",e=>{
    playMusic(element.querySelector(".info").firstElementChild.innerHTML.trim())
  })
});



playAndPause.addEventListener("click",()=>{
  if(currentSong.paused){
    currentSong.play();
    playAndPause.src = "pause.svg";
  }
  else{
    currentSong.pause();
    playAndPause.src = "play2.svg"
  }
})


// Timeupdate event
currentSong.addEventListener("timeupdate",()=>{
document.querySelector(".song-time").innerHTML= `${secondsToMinuteSecond(currentSong.currentTime)}/${secondsToMinuteSecond(currentSong.duration)}`;
document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100+"%";

})

document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100+"%"
  currentSong.currentTime= (currentSong.duration*percent)/100
  

})

//Add event listener to hamburger 
document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "0";

})
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left = "-120%";
  document.querySelector(".left").style.width = "30vw"; 

})

document.querySelector(".next-song").addEventListener("click",()=>{
  let tcs = currentSong.src.split("songs/")[1]
        if(tcs==song[song.length-1]){
          playMusic(song[0])
        }
        
      for(let i=0;i<song.length-1;i++){
        if(tcs==song[i]){
          playMusic(song[i+1])
        }
      }
})
document.querySelector(".prev-song").addEventListener("click",()=>{
  let tcs = currentSong.src.split("songs/")[1]
        if(tcs==song[0]){
          playMusic(song[song.length-1])
        }
        
      for(let i=1;i<song.length;i++){
        if(tcs==song[i]){
          playMusic(song[i-1])
        }
      }
})


// srt volume

volRange.addEventListener("change",(e)=>{
  currentSong.volume = parseInt(e.target.value)/100;
})
}
main();
