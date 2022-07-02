function correctVideoPlayerHeight() {
    let iframeVideoIPlayer = document.getElementById("iframePlayer");
    iframeVideoIPlayer.style.setProperty("height", window.innerHeight + "px");
    let videoPlayer = document.getElementById("player");
    videoPlayer.style.setProperty("height", window.innerHeight + "px");
}

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();

function debug(err) {
    let debugElem = document.getElementById('debugLog');
    let logItem = document.createElement("p");
    logItem.innerText = err;
    debugElem.appendChild(logItem);
}
debug("index.html - start");
window.onerror = (err) => debug(err); //for debug on TV
let apiUrl = 'https://albertsongs.asuscomm.com';
debug("index.html - localStorage:" + typeof localStorage);
let receiverId = localStorage.getItem('receiverId');
let changeReceiverIdHandler = (receiverId) => localStorage.setItem('receiverId', receiverId);
let changePlayerVolumeHandler = (volume) => localStorage.setItem('volume', volume);

debug("index.html - receiverId:" + receiverId);

let multiPlayer = new MultiPlayer(
    document.getElementById('player'),
    document.getElementById('iframePlayer'),
    localStorage.getItem('volume'),
    changePlayerVolumeHandler
)

let app = new App(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler);
app.registerReceiver();