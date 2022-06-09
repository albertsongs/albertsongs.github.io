var videoPlayer = document.getElementById("videoPlayer");

function openFullscreen() {
  if (videoPlayer.requestFullscreen) {
    videoPlayer.requestFullscreen();
  } else if (videoPlayer.mozRequestFullScreen) { /* Firefox */
    videoPlayer.mozRequestFullScreen();
  } else if (videoPlayer.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
    videoPlayer.webkitRequestFullscreen();
  } else if (videoPlayer.msRequestFullscreen) { /* IE/Edge */
    videoPlayer.msRequestFullscreen();
  }
}