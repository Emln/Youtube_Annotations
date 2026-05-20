// Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Replace the 'ytplayer' element with an <iframe> and
// YouTube player after the API code downloads.
var player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player("ytplayer", {
    height: "360",
    width: "640",
    videoId: "M7lc1UVf-VE",
    events: {
      onReady: onPlayerReady,
    },
  });
}

function onPlayerReady(event) {
  const button = document.getElementById("get-time");
  button.addEventListener("click", function () {
    const timeSeconds = Math.floor(player.getCurrentTime());
    const minutes = Math.floor(timeSeconds / 60);
    const seconds = timeSeconds % 60;
    const timecode =
      minutes.toString().padStart(2, "0") +
      ":" +
      seconds.toString().padStart(2, "0");

    document.getElementById("current-time").textContent =
      "Timecode: " + timecode;

    sidebarAnnotation(timecode);
    console.log("Timecode: " + timecode);
  });
}

function sidebarAnnotation(timecode) {
  const sidebar = document.getElementById("sidebar-annotations");
  sidebar.innerHTML += `<div class="annotation">Annotation at ${timecode}</div>`;
}
