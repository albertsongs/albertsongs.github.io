/**
 * @albertsongs (https://github.com/albertsongs) 
 */
class App {
    constructor(apiUrl, receiverId, messageHandler){
        this.apiUrl = apiUrl;
        this.receiverId = receiverId;
        this.messageHandler = messageHandler;
    }
    connectToWebSocket(){
        const receiverId = this.receiverId;
        const CHANEL_PATTERN = '/user/%userId%/private';
        let sock = new SockJS(this.apiUrl + '/ws');
        let stompClient = Stomp.over(sock);
        let receiverChanel = CHANEL_PATTERN.replace('%userId%', receiverId);
        stompClient.connect({user: receiverId}, () => {
            stompClient.subscribe(receiverChanel, (mess) => this.messageHandler(mess));
            var message = {
                senderName: receiverId,
                status:"JOIN"
            };
            stompClient.send('/app/message', {}, JSON.stringify(message));
        }, (err) => console.log(err));
    }
    updateReceiver(){
        const xhttp = new XMLHttpRequest();
        const receiverControllerPath = '/api/v1/receivers/' + this.receiverId;
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        let receiverInfo = {
            name: navigator.userAgent
        };
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhttp.responseText);
                that.connectToWebSocket();
            }
        };
        xhttp.open('PATCH', url, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(receiverInfo));
        this.connectToWebSocket();
    }
    registerReceiver(){
        if (this.receiverId !== null){
            this.updateReceiver();
            return;
        }
        const xhttp = new XMLHttpRequest();
        const receiverControllerPath = '/api/v1/receivers';
        const url = this.apiUrl + receiverControllerPath;
        let that = this;
        let receiverInfo = {
            name: navigator.userAgent
        };
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                console.log(xhttp.responseText);
                let receiver = JSON.parse(xhttp.responseText);
                that.receiverId = id;
                localStorage.setItem('receiverId', receiver.id);
                that.connectToWebSocket();
            }
        };
        xhttp.open('POST', url, true);
        xhttp.setRequestHeader('Content-type', 'application/json');
        xhttp.send(JSON.stringify(receiverInfo));
    }
}