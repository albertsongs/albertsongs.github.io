function correctVideoPlayerHeight() {
    let videoPlayer = document.getElementById("iframePlayer");
    videoPlayer.style.setProperty("height", window.innerHeight + "px");
}

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();