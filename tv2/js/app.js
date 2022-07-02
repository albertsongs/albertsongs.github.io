/**
 * @albertsongs (https://github.com/albertsongs)
 */
class App {
    constructor(apiUrl, receiverId, multiPlayer, changeReceiverIdHandler, logger) {
        this.apiUrl = apiUrl;
        this.receiverId = receiverId;
        this.multiPlayer = multiPlayer;
        this.changeReceiverIdHandler = changeReceiverIdHandler;
        this.logger = logger;
    }

    messageHandler(mess) {
        this.logger.debug(mess);
        const messContainer = JSON.parse(mess.body);
        const command = JSON.parse(messContainer.message);
        if(command === null || command === undefined) {
            console.error("command is not defined");
            this.logger.debug("command is not defined");
            return;
        }
        this.multiPlayer.handleCommand(command);
    }

    connectToWebSocket() {
        this.logger.debug("connectToWebSocket - receiverId: + " + this.receiverId);
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
        }, (err) => this.logger.debug(err));
    }

    registerReceiver() {
        this.logger.debug("registerReceiver - receiverId: + " + this.receiverId);
        this.receiverId == null
            ? this.createReceiver()
            : this.updateReceiver();
    }

    createReceiver() {
        this.logger.debug("createReceiver - receiverId: + " + this.receiverId);
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = '/api/v1/receivers';
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        let receiverInfo = {
            name: navigator.userAgent
        };
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                that.logger.debug(xHttp.responseText);
                let receiver = JSON.parse(xHttp.responseText);
                that.receiverId = receiver.id;
                that.changeReceiverIdHandler(that.receiverId);
                that.connectToWebSocket();
                that.loadVideos();
            }
        };
        xHttp.open('POST', url, true);
        xHttp.setRequestHeader('Content-type', 'application/json');
        xHttp.send(JSON.stringify(receiverInfo));
    }

    updateReceiver() {
        this.logger.debug("updateReceiver - receiverId: + " + this.receiverId);
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
                that.logger.debug(xHttp.responseText);
                that.connectToWebSocket();
                that.loadVideos();
            }
            else if ([400,404].includes(this.status)){
                that.logger.debug(xHttp.responseText);
                that.receiverId = null;
                that.changeReceiverIdHandler(that.receiverId);
                that.createReceiver();
            }
        };
        xHttp.open('PATCH', url, true);
        xHttp.setRequestHeader('Content-type', 'application/json');
        xHttp.send(JSON.stringify(receiverInfo));
    }

    loadVideos() {
        this.logger.debug("loadVideos - receiverId: + " + this.receiverId);
        const xHttp = new XMLHttpRequest();
        const receiverControllerPath = "/api/v1/videos";
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        xHttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                that.logger.debug(xHttp.responseText);
                const response = JSON.parse(xHttp.responseText);
                that.multiPlayer.setVideos(response.list);
            }
        };
        xHttp.open("GET", url, true);
        xHttp.send();
    }
}