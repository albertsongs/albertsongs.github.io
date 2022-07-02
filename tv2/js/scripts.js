function correctVideoPlayerHeight() {
    let videoPlayer = document.getElementById("iframePlayer");
    videoPlayer.style.setProperty("height", window.innerHeight + "px");
}

window.onresize = correctVideoPlayerHeight;
correctVideoPlayerHeight();

let apiUrl = 'https://albertsongs.asuscomm.com';
let receiverId = localStorage.getItem('receiverId');
let changeReceiverIdHandler = (receiverId) => localStorage.setItem('receiverId', receiverId);
let changePlayerVolumeHandler = (volume) => localStorage.setItem('volume', volume);

let multiPlayer = new MultiPlayer(
    document.getElementById('player'),
    document.getElementById('iframePlayer'),
    localStorage.getItem('volume') ?? 1,
    changePlayerVolumeHandler
);

let app = new App(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler);
app.registerReceiver();