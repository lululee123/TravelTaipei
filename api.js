var receive = "";
var a = 0;
var pageNum = "";

function districtChange(data) {
	var ourRequest = new XMLHttpRequest();
	ourRequest.open('GET', 'http://data.taipei/opendata/datalist/apiAccess?scope=resourceAquire&rid=36847f3f-deff-4183-a5bb-800737591de5');
	ourRequest.onload = function() {
    var ourData = JSON.parse(ourRequest.responseText);
		console.log(ourData.result.results);
		receive = ourData.result.results;
		renderHTML(ourData.result.results, data);	
	};
	ourRequest.send();
}

function renderHTML(receive, check) {
	document.querySelector('#posts').innerHTML = "";
	var HTMLString = "";
	var standByHTML = "";
	var pageHTML = "";
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
			`<span class="info-box__span">${receive[i].stitle}</span>` + 
			`<button type="button" class="readMore" data-viewNo=${receive[i].RowNumber}>景點介紹</span>` +
			`</div>` +
			`<div class=page${Math.ceil(a / 9)}></div>` +
			`</div>`;			
		}
		pageNum = Math.ceil(a / 9)
	}
	document.querySelector('#posts').innerHTML = HTMLString;
	for (var i = 0; i < document.querySelectorAll('.page1').length ; i++){
		standByHTML += document.querySelectorAll('.page1')[i].offsetParent.innerHTML;
	}
	for (var i = 1; i < pageNum + 1; i++){
		pageHTML += `<button type="button" class="page">${i}</span>`;
	}
	document.querySelector('#posts').innerHTML = standByHTML;
	document.querySelector('#page').innerHTML = pageHTML;
	readMoreButton();
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
}

function listenModalClose() {
	var closeModalEl = document.querySelector('.modal');
	closeModalEl.addEventListener('click', function(e) {
			if (e.target.className == 'modal' || e.target.classList.contains('button--close')) {
					document.querySelector('.modal').style.display = 'none';
			}
	})
}


