/**
 * @albertsongs (https://github.com/albertsongs) 
 */
class App {
	constructor(apiUrl, listElemId){
		this.receiverId = null;
		this.apiUrl = apiUrl;
		this.listElemId = listElemId;
	}
	initReceiverId() {
		const xhttp = new XMLHttpRequest();
		const receiverControllerPath = "/api/v1/receivers";
		const url = this.apiUrl + receiverControllerPath;
		let that = this;
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       const response = JSON.parse(xhttp.responseText);
		       const receivers = response.list;
		       that.receiverId = receivers[0].id;
		       that.loadVideos();
		    }
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}
	sendVideoIdToReceiver(videoId){
		if (this.receiverId === null || videoId === null){
	        return;
	    }
	    const xhttp = new XMLHttpRequest();
	    const receiverControllerPath = '/api/v1/receivers/{receiverId}/playYoutubeVideo'
	    	.replace('{receiverId}', this.receiverId);
	    const url = this.apiUrl + receiverControllerPath;
	    let videoInfo = {
	        id: videoId
	    };
	    xhttp.onreadystatechange = function() {
	        if (this.readyState == 4 && this.status == 200) {
	            console.log(xhttp.response);
	        }
	    };
	    xhttp.open('POST', url, true);
	    xhttp.setRequestHeader('Content-type', 'application/json');
	    xhttp.send(JSON.stringify(videoInfo));
	}
	loadVideos(){
		const xhttp = new XMLHttpRequest();
		const receiverControllerPath = "/api/v1/videos";
		const url = this.apiUrl + receiverControllerPath;
		let that = this;
		xhttp.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
		       const response = JSON.parse(xhttp.responseText);
		       that.videos = response.list;
		       that.renderVideoList(that.videos);
		    }
		};
		xhttp.open("GET", url, true);
		xhttp.send();
	}
	renderVideoList(videos){
		let listElem = document.getElementById(this.listElemId);
		for(let video of videos){
			console.log(video);
			let newItem = document.createElement("li");
			newItem.setAttribute('id', video.id);
			newItem.innerText = video.title;
			newItem.addEventListener('click', function(){
				app.sendVideoIdToReceiver(this.getAttribute('id'))
			})
			listElem.appendChild(newItem);
		}
	}
}