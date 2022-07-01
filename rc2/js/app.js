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
        const receiverControllerPath = '/api/v1.1/receivers/{receiverId}/playVideo'
            .replace('{receiverId}', this.receiverId);
        const url = this.apiUrl + receiverControllerPath;
        let videoInfo = {
            id: videoId
        };
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 202) {
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
    controlPanel = {};
    constructor(listElemId, controlPanelElemId) {
        this.listElem = document.getElementById(listElemId);
        this.initControlPanel(controlPanelElemId);
        this.loaderElem = document.getElementById("loader");
        this.searchReceiverDescElem = document.getElementById("searchReceiverDesc");
        this.loadVideosDescElem = document.getElementById("loadVideosDesc");
    }

    step1() {
        this.searchReceiverDescElem.style.setProperty('display', 'block');
        this.loadVideosDescElem.style.setProperty('display', 'none');
    }

    step2() {
        this.searchReceiverDescElem.style.setProperty('display', 'none');
        this.loadVideosDescElem.style.setProperty('display', 'block');
    }

    step3() {
        this.searchReceiverDescElem.style.setProperty('display', 'none');
        this.loadVideosDescElem.style.setProperty('display', 'none');
        this.loaderElem.style.setProperty('display', 'none');
        this.renderControlPanel();
    }

    initControlPanel(controlPanelElemId) {
        this.controlPanel.controlPanelElem = document.getElementById(controlPanelElemId);
        this.controlPanel.playPauseElem = document.createElement("button");
        this.controlPanel.previousElem = document.createElement("button");
        this.controlPanel.nextElem = document.createElement("button");
        this.controlPanel.volumeDownElem = document.createElement("button");
        this.controlPanel.volumeUpElem = document.createElement("button");
    }

    renderControlPanel() {
        this.controlPanel.playPauseElem.innerText = "play/pause";
        this.controlPanel.previousElem.innerText = "previous";
        this.controlPanel.nextElem.innerText = "next";
        this.controlPanel.volumeDownElem.innerText = "volume down";
        this.controlPanel.volumeUpElem.innerText = "volume up";
        this.controlPanel.controlPanelElem.appendChild(this.controlPanel.volumeDownElem);
        this.controlPanel.controlPanelElem.appendChild(this.controlPanel.previousElem);
        this.controlPanel.controlPanelElem.appendChild(this.controlPanel.playPauseElem);
        this.controlPanel.controlPanelElem.appendChild(this.controlPanel.nextElem);
        this.controlPanel.controlPanelElem.appendChild(this.controlPanel.volumeUpElem);
    }

    renderVideoList(videos) {
        for (let video of videos) {
            console.log(video);
            let newItem = document.createElement("li");
            newItem.setAttribute('id', video.id);
            newItem.innerText = video.title;
            newItem.addEventListener('click', function () {
                app.sendVideoIdToReceiver(this.getAttribute('id'))
            })
            this.listElem.appendChild(newItem);
        }
    }
}