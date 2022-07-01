function correctVideoPlayerHeight() {
    let videoPlayer = document.getElementById("videoPlayer");
    videoPlayer.style.setProperty("height", window.innerHeight + "px");
}

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();