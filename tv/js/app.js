/**
 * @albertsongs (https://github.com/albertsongs)
 */
class App {
    constructor(apiUrl, receiverId, changeReceiverIdHandler, messageHandler) {
        this.apiUrl = apiUrl;
        this.receiverId = receiverId;
        this.messageHandler = messageHandler;
        this.changeReceiverIdHandler = changeReceiverIdHandler;
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
            : this.updateReceiver()
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
                that.changeReceiverIdHandler(that.receiverId);
                that.connectToWebSocket();
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
            if (this.readyState !== 4) {
                return;
            }
            if (this.status === 200) {
                console.log(xHttp.responseText);
                that.connectToWebSocket();
                that.loadVideos();
            }
            else if ([400,404].includes(this.status)){
                that.receiverId = null;
                that.changeReceiverIdHandler(that.receiverId);
                that.createReceiver();
            }
        };
        xHttp.open('PATCH', url, true);
        xHttp.setRequestHeader('Content-type', 'application/json');
        xHttp.send(JSON.stringify(receiverInfo));
    }
}