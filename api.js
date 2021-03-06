var receive = "";
var pageNum = "";
var choosePage = "";

function districtChange(data) {
	var ourRequest = new XMLHttpRequest();
	//ourRequest.open('GET', 'http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=36847f3f-deff-4183-a5bb-800737591de5');
	ourRequest.open('GET', 'data.json', true);
	ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
		receive = ourData.result.results;
		renderHTML(ourData.result.results, data);
		$("a.page:first-child").css({background: "#1b84c9", color: "white"});	
	};
	ourRequest.send(null);
}

function renderHTML(receive, check) {
	document.querySelector('#posts').innerHTML = "";
	document.querySelector('#page').innerHTML = "";
	var HTMLString = "";
	var standByHTML = "";
	var pageHTML = "";
	var a = 0;
	for(i = 0; i < receive.length; i++){
		if (receive[i].address.substr(5, 3) == check)
		{
		  a = a + 1;
			var ss = receive[i].file.split("http");
			HTMLString += `<div class="info-box">` +
			`<div class="up">` +
			`<img class="image" src=http${ss[1]}>` + 
			`</div>` +
			`<div class="down">` +
			`<span class="info-box__stitle">${receive[i].stitle}</span>` + 
			`<button type="button" class="readMore" data-viewNo=${receive[i].RowNumber}>景點介紹</button>` +
			`</div>` +
			`<div class=page${Math.ceil(a / 9)}></div>` +
			`</div>`;			
			console.log(`${receive[i].stitle}`);

		}
		pageNum = Math.ceil(a / 9);
	}
	document.querySelector('#posts').innerHTML = HTMLString;
	for (var i = 0; i < document.querySelectorAll('.page1').length ; i++){
		standByHTML += `<div class="info-box">`+ 
		document.querySelectorAll('.page1')[i].offsetParent.innerHTML +
		`</div>`;
	}
	for (var i = 1; i < pageNum + 1; i++){
		pageHTML += `<a type="button" class="page page${i}">${i}</a>`;
	}
	document.querySelector('#posts').innerHTML = standByHTML;
	document.querySelector('#page').innerHTML = pageHTML;
	readMoreButton();
	choose(receive, check);
}

function readMoreButton() {
	var readMoreButton = document.querySelectorAll('.readMore');
	for (var i = 0; i < readMoreButton.length; i++) {
			readMoreButton[i].addEventListener('click', function(e) {
				showViewData(e.srcElement.getAttribute('data-viewNo'));
			}, false);
		}
}

function showViewData(viewNo) {
	for (var i = 0; i < receive.length; i++) {
			if (viewNo == receive[i].RowNumber) {
					var ss = receive[i].file.split("http");
					img = `http${ss[1]}`;
					document.querySelector('.view-title').textContent = receive[i].stitle || '未提供';
					document.querySelector('.view-img').setAttribute('alt', receive[i].dataPicDesc);
					document.querySelector('.view-img').setAttribute('src', img);
					document.querySelector('.view-content').innerHTML = receive[i].xbody || '未提供';
					document.querySelector('.view-add').innerHTML = receive[i].address || '未提供';
					document.querySelector('.view-tel').innerHTML = receive[i].MEMO_TEL || '未提供';
					document.querySelector('.view-time').innerHTML = receive[i].MEMO_TIME || '未提供';
					document.querySelector('.view-MRT').textContent = receive[i].MRT || '未提供';
					document.querySelector('.view-info').innerHTML = receive[i].info || '未提供';
					break;
			}
	}
	//顯示景點資料框
	document.querySelector('.modal').style.display = 'block';
	listenModalClose();
	codeAddress();
}

function listenModalClose() {
	var closeModalEl = document.querySelector('.modal');
	closeModalEl.addEventListener('click', function(e) {
			if (e.target.classList.contains('button--close')) {
				closeModalEl.style.display = 'none';
			}
	})
}

function choose(receive, check) {
	document.querySelector('#page').addEventListener("click", function(e){
		console.log(e);
		choosePage = e.target.innerHTML;
		chooseHTML(receive, check, choosePage)
	});

}

function chooseHTML(receive, check, choosePage) {
	var page = ".page" + choosePage;
		document.querySelector('#posts').innerHTML = "";
		document.querySelector('#page').innerHTML = "";
		var HTMLString = "";
		var standByHTML = "";
		var pageHTML = "";
		var a = 0;
		for(i = 0; i < receive.length; i++){
			if (receive[i].address.substr(5, 3) == check)
			{
				a = a + 1;
				var ss = receive[i].file.split("http");
				HTMLString += `<div class="info-box">` +
				`<div class="up">` +
				`<img class="image" src=http${ss[1]}>` + 
				`</div>` +
				`<div class="down">` +
				`<span class="info-box__stitle">${receive[i].stitle}</span>` + 
				`<button type="button" class="readMore" data-viewNo=${receive[i].RowNumber}>景點介紹</button>` +
				`</div>` +
				`<div class=page${Math.ceil(a / 9)}></div>` +
				`</div>`;			
			}
		}
		document.querySelector('#posts').innerHTML = HTMLString;
		for (var i = 0; i < document.querySelectorAll(`.page${choosePage}`).length ; i++){
			standByHTML += `<div class="info-box">`+ 
			document.querySelectorAll(`.page${choosePage}`)[i].offsetParent.innerHTML +
			`</div>`;
		}
		for (var i = 1; i < pageNum + 1; i++){
			pageHTML += `<a type="button" class="page page${i}">${i}</a>`;
		}
		document.querySelector('#posts').innerHTML = standByHTML;
		document.querySelector('#page').innerHTML = pageHTML;
		$(".page").css({background: "white", color: "black"});
	  $(page).css({background: "#1b84c9", color: "white"});	
		readMoreButton();
}

var geocoder;
var map;
function codeAddress() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {
		zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: false
	}
	map = new google.maps.Map(document.getElementById('map'), mapOptions);
	var address = $(".view-add").text();
	geocoder.geocode( { 'address': address}, function(results, status) {
		if (status == 'OK') {
			map.setCenter(results[0].geometry.location);
			var marker = new google.maps.Marker({
					map: map,
					position: results[0].geometry.location
			});
		} else {
			alert('Geocode was not successful for the following reason: ' + status);
		}
	});
}

function typetitle(){
	var typingText="整個台北都是我的遊樂場";   
	var count=0;   
	var show=$("#title");   
		
	function type(){   
			if(count<=typingText.length){   
					show.html(typingText.substring(0, count));   
					count++;   
			}else{   
					window.clearInterval(typewriter);      
			}   
	}   
	var typewriter=window.setInterval(type ,200);  
};  