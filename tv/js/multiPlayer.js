class MultiPlayer {
    constructor(videoPlayer, iframePlayer, initVolume, changePlayerVolumeHandler) {
        this.videoPlayer = videoPlayer;
        this.iframePlayer = iframePlayer;
        this.volume = initVolume;
        this.changePlayerVolumeHandler = changePlayerVolumeHandler;
        this.videoIndex = 0;
        this.videoPlayer.onended = () => this.nextTrack();
    }
    handleCommand(command) {
        switch (command.type) {
            case 'PLAY_YOUTUBE_VIDEO':
                this.loadYoutubeVideo(command.payload);
                break;
            case 'PLAY_VIDEO':
                this.loadRawVideo(command.payload);
                this.videoIndex = this.getVideoIndex(videoInfo);
                break;
            case 'PLAY':
                this.videoPlayer.play();
                break;
            case 'PAUSE':
                this.videoPlayer.pause();
                break;
            case 'NEXT':
                this.nextTrack();
                break;
            case 'PREVIOUS':
                this.previousTrack();
                break
            case 'VOLUME_UP':
                if (this.volume === 1) {
                    return;
                }
                this.volume += 0.1;
                this.videoPlayer.volume = this.volume;
                this.changePlayerVolumeHandler(this.volume);
                break
            case 'VOLUME_DOWN':
                if (this.volume === 0) {
                    return;
                }
                this.volume -= 0.1;
                this.changePlayerVolumeHandler(this.volume);
                this.videoPlayer.volume = this.volume;
                break
        }
    }
    setVideos(videos) {
        this.videos = videos;
        this.videosCount = this.videos.length;
        this.setVideoIndexes();
    }
    setVideoIndexes(){
        this.videoIndexes = [];
        let index = 0;
        for(let video of this.videos){
            this.videoIndexes[video.id] = index++;
        }
    }
    loadYoutubeVideo(videoInfo) {
        const youtubeLinkPattern = "https://www.youtube.com/embed/%videoId%?autoplay=1&cc_load_policy=1" +
            "&list=%playlistId%&listType=playlist&loop=1&color=white";
        this.iframePlayer.src = youtubeLinkPattern
            .replace('%videoId%', videoInfo.youtube.videoId)
            .replace('%playlistId%', videoInfo.youtube.playlistId);
    }
    loadRawVideo(videoInfo) {
        this.videoPlayer.src = videoInfo.url;
        this.videoPlayer.getElementById('subtitles').src = videoInfo.subtitlesUrl;
    }
    nextTrack() {
        this.loadRawVideo(this.videos[this.videoIndex]);
        this.videoIndex = (this.videoIndex + 1) % this.videosCount;
    }
    previousTrack() {
        this.loadRawVideo(this.videos[this.videoIndex]);
        this.videoIndex = (this.videoIndex - 1) % this.videosCount;
    }
    getVideoIndex(videoInfo) {
        if (videoInfo.id === null) {
            return (this.videoIndex + 1) % this.videosCount;
        }
        return this.videoIndexes[videoInfo.id];
    }
}