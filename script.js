// Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
function onYouTubePlayerAPIReady() {
  player = new YT.Player("ytplayer", {
    height: "100%",
    width: "100%",
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

    const text = document.getElementById("annotation-input").value;
    sidebarAnnotation(timecode, text);
    document.getElementById("annotation-input").value = "";
  });
}

function sidebarAnnotation(timecode, text) {
  const sidebar = document.getElementById("sidebar-annotations");
  sidebar.innerHTML += `<div class="annotation row"><div class="col-10">${timecode}: ${text}</div><div class="col-2"><button class="delete-btn btn btn-danger btn-sm" type="button">X</button></div></div>`;

  const deleteButtons = sidebar.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.parentElement.parentElement.remove();
    });
  });
}
