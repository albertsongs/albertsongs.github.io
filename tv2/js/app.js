/**
 * @albertsongs (https://github.com/albertsongs)
 */
class App {
    constructor(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler) {
        this.apiUrl = apiUrl;
        this.receiverId = receiverId;
        this.multiPlayer = multiPlayer;
        this.changeReceiverIdHandler = changeReceiverIdHandler;
    }

    messageHandler(mess) {
        console.log(mess);
        const messContainer = JSON.parse(mess.body);
        const command = JSON.parse(messContainer.message);
        if(command === null || command === undefined) {
            console.error("command is not defined");
            return;
        }
        this.multiPlayer.handleCommand(command);
    }

    connectToWebSocket() {
        const receiverId = this.receiverId;
        const CHANEL_PATTERN = '/user/%userId%/private';
        let sock = new SockJS(this.apiUrl + '/ws');
        let stompClient = Stomp.over(sock);
        let receiverChanel = CHANEL_PATTERN.replace('%userId%', receiverId);
        stompClient.connect({user: receiverId}, () => {
            stompClient.subscribe(receiverChanel, (mess) => this.messageHandler(mess));
            const message = {
                senderName: receiverId,
                status: "JOIN"
            };
            stompClient.send('/app/message', {}, JSON.stringify(message));
        }, (err) => console.log(err));
    }

    registerReceiver() {
        this.receiverId == null
            ? this.createReceiver()
            : this.updateReceiver();
    }

    createReceiver() {
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = '/api/v1/receivers';
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        let receiverInfo = {
            name: navigator.userAgent
        };
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(xHttp.responseText);
                let receiver = JSON.parse(xHttp.responseText);
                that.receiverId = receiver.id;
                this.changeReceiverIdHandler(that.receiverId);
                that.connectToWebSocket();
                that.loadVideos();
            }
        };
        xHttp.open('POST', url, true);
        xHttp.setRequestHeader('Content-type', 'application/json');
        xHttp.send(JSON.stringify(receiverInfo));
    }

    updateReceiver() {
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = '/api/v1/receivers/' + this.receiverId;
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        let receiverInfo = {
            name: navigator.userAgent
        };
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                console.log(xHttp.responseText);
                that.connectToWebSocket();
                that.loadVideos();
            }
            else if (this.readyState > 1 && [400,404].includes(this.status)){
                that.receiverId = null;
                this.changeReceiverIdHandler(that.receiverId);
                that.createReceiver();
            }
        };
        xHttp.open('PATCH', url, true);
        xHttp.setRequestHeader('Content-type', 'application/json');
        xHttp.send(JSON.stringify(receiverInfo));
    }

    loadVideos() {
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = "/api/v1/videos";
        const url = this.apiUrl + receiverControllerPath;
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                const response = JSON.parse(xHttp.responseText);
                this.multiPlayer.setVideos(response.list);
            }
        };
        xHttp.open("GET", url, true);
        xHttp.send();
    }
}