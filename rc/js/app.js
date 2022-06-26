/**
 * @albertsongs (https://github.com/albertsongs)
 */
class App {
    constructor(apiUrl, ui) {
        this.receiverId = null;
        this.apiUrl = apiUrl;
        this.ui = ui;
    }

    initReceiverId() {
        this.ui.step1();
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = "/api/v1/receivers";
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(xHttp.responseText);
                const receivers = response.list;
                that.receiverId = receivers[0]?.id ?? null;
                if (that.receiverId === null) {
                    setTimeout(function () {
                        that.initReceiverId();
                    }, 5000);
                    return;
                }
                that.loadVideos();
            }
        };
        xHttp.open("GET", url, true);
        xHttp.send();
    }

    sendVideoIdToReceiver(videoId) {
        if (this.receiverId === null || videoId === null) {
            return;
        }
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = '/api/v1/receivers/{receiverId}/playYoutubeVideo'
            .replace('{receiverId}', this.receiverId);
        const url = this.apiUrl + receiverControllerPath;
        let videoInfo = {
            id: videoId
        };
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(xHttp.response);
            }
        };
        xHttp.open('POST', url, true);
        xHttp.setRequestHeader('Content-type', 'application/json');
        xHttp.send(JSON.stringify(videoInfo));
    }

    loadVideos() {
        this.ui.step2();
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = "/api/v1/videos";
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(xHttp.responseText);
                that.videos = response.list;
                that.ui.renderVideoList(that.videos);
                that.ui.step3();
            }
        };
        xHttp.open("GET", url, true);
        xHttp.send();
    }
}

class UI {
    constructor(listElemId) {
        this.listElemId = listElemId;
    }

    step1() {
        document.getElementById("searchReceiverDesc").style.setProperty('display', 'block');
        document.getElementById("loadVideosDesc").style.setProperty('display', 'none');
    }

    step2() {
        document.getElementById("searchReceiverDesc").style.setProperty('display', 'none');
        document.getElementById("loadVideosDesc").style.setProperty('display', 'block');
    }

    step3() {
        document.getElementById("searchReceiverDesc").style.setProperty('display', 'none');
        document.getElementById("loadVideosDesc").style.setProperty('display', 'none');
        document.getElementById("loader").style.setProperty('display', 'none');
    }

    renderVideoList(videos) {
        let listElem = document.getElementById(this.listElemId);
        for (let video of videos) {
            console.log(video);
            let newItem = document.createElement("li");
            newItem.setAttribute('id', video.id);
            newItem.innerText = video.title;
            newItem.addEventListener('click', function () {
                app.sendVideoIdToReceiver(this.getAttribute('id'))
            })
            listElem.appendChild(newItem);
        }
    }
}