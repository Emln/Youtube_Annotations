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

  // Hier passiert die Magie, wenn man auf den Button klickt
  button.addEventListener("click", function () {
    // player.getCurrentTime() ist der magische Befehl von YouTube
    // Math.floor() rundet die Zahl ab, damit wir keine krummen Millisekunden haben
    const aktuelleSekunde = Math.floor(player.getCurrentTime());

    // Text auf der Website aktualisieren
    console.log("Aktuelle Sekunde: " + aktuelleSekunde + "s");
  });
}
