// Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var pendingVideoId = null;

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
  if (pendingVideoId) {
    player.loadVideoById(pendingVideoId);
    pendingVideoId = null;
  }
}

function handleLoadVideo() {
  const url = document.getElementById("video-url").value.trim();
  const videoId = getYouTubeVideoID(url);

  if (!videoId) {
    alert("Please enter a valid YouTube URL.");
    return;
  }

  document.getElementById("video-input-container").classList.add("d-none");
  document.getElementById("newVideo").classList.remove("d-none");
  document.querySelector(".video-wrapper").style.display = "block";

  if (player && typeof player.loadVideoById === "function") {
    player.loadVideoById(videoId);
  } else {
    pendingVideoId = videoId;
  }
}

function newVideo() {
  document.getElementById("video-input-container").classList.remove("d-none");
  document.getElementById("newVideo").classList.add("d-none");
  document.querySelector(".video-wrapper").style.display = "none";
  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }
  document.getElementById("sidebar-annotations").innerHTML = "";
}

function handleGetTime() {
  if (!player || typeof player.getCurrentTime !== "function") {
    alert(
      "YouTube player is not ready yet. Please wait a moment and try again.",
    );
    return;
  }

  const timeSeconds = Math.floor(player.getCurrentTime());
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = timeSeconds % 60;
  const timecode =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");

  const text = document.getElementById("annotation-input").value;
  sidebarAnnotation(timecode, text, timeSeconds);
  document.getElementById("annotation-input").value = "";
}

window.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("load-video")
    .addEventListener("click", handleLoadVideo);
  document.getElementById("get-time").addEventListener("click", handleGetTime);
});

function getYouTubeVideoID(url) {
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

function sidebarAnnotation(timecode, text, timeSeconds) {
  const sidebar = document.getElementById("sidebar-annotations");
  sidebar.innerHTML += `<div class="annotation row p-2 m-2 bg-white rounded" ><div class="col-10" onClick="jumpToTime(${timeSeconds})">${timecode}: ${text}</div><div class="col-2"><button class="delete-btn btn btn-danger btn-sm" type="button">X</button></div></div>`;

  sidebar.scrollTop = sidebar.scrollHeight;
  const deleteButtons = sidebar.querySelectorAll(".delete-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.parentElement.parentElement.remove();
    });
  });
}

function jumpToTime(timeSeconds) {
  player.seekTo(timeSeconds, true);
}
