/**
 * @albertsongs (https://github.com/albertsongs)
 */
class Logger {
    constructor(appLogElem) {
        this.appLogElem = appLogElem;
    }

    debug(mess) {
        let logItem = document.createElement("p");
        logItem.innerText = mess;
        this.appLogElem.appendChild(logItem);
    }
}