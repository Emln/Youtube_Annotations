// Load the IFrame Player API code asynchronously.
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var player;
var pendingVideoId = null;

// This function gets called by the YouTube API when it's ready.
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

// This function gets called when the player is ready.
function onPlayerReady(event) {
  if (pendingVideoId) {
    player.loadVideoById(pendingVideoId);
    pendingVideoId = null;
  }
}

// Handle the "Load Video" button click
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

// Handle the "New Video" button click
function newVideo() {
  document.getElementById("video-input-container").classList.remove("d-none");
  document.getElementById("newVideo").classList.add("d-none");
  document.querySelector(".video-wrapper").style.display = "none";
  if (player && typeof player.stopVideo === "function") {
    player.stopVideo();
  }
  document.getElementById("sidebar-annotations").innerHTML = "";
}

// Handle the "Get Time" button click
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

// Set up event listeners after the DOM is fully loaded
window.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("load-video")
    .addEventListener("click", handleLoadVideo);
  document.getElementById("get-time").addEventListener("click", handleGetTime);
  document.getElementById("newVideo").addEventListener("click", newVideo);
});

// Utility function to extract YouTube video ID from various URL formats
function getYouTubeVideoID(url) {
  const regex =
    /(?:youtube(?:-nocookie)?\.com\/(?:.*v=|v\/|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Function to add an annotation to the sidebar
function sidebarAnnotation(timecode, text, timeSeconds) {
  const sidebar = document.getElementById("sidebar-annotations");
  sidebar.innerHTML += `
    <div class="annotation row p-2 m-2 bg-white rounded">
      <div class="col-10" onClick="jumpToTime(${timeSeconds})">${timecode}: ${text}</div>
      <div class="col-2 d-flex justify-content-end">
        <div class="dropdown">
          <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots-vertical" viewBox="0 0 16 16">
              <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
            </svg>
          </button>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item delete-item" href="#">Delete</a></li>
            <li><a class="dropdown-item edit-item" href="#">Edit</a></li>
          </ul>
        </div>
      </div>
    </div>`;

  sidebar.scrollTop = sidebar.scrollHeight;

  // Attach delete handlers to the newly added delete items
  const deleteItems = sidebar.querySelectorAll(".delete-item");
  deleteItems.forEach((item) => {
    // Avoid attaching duplicate handlers
    if (item.dataset.listenerAttached === "true") return;
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const annotation = this.closest(".annotation");
      if (annotation) annotation.remove();
    });
    item.dataset.listenerAttached = "true";
  });
}

// Function to jump to a specific time in the video
function jumpToTime(timeSeconds) {
  player.seekTo(timeSeconds, true);
}
