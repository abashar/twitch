//Rule 1: A simple API that hits Twitch API
var twitch = function(){
				
	var button = document.getElementById("search");
	var input = document.getElementById("q");
	var errormessage = document.getElementById("message");
	var query = (window.location.search).split('=')[1];
	var current = document.getElementById("currentpage");
	var total = document.getElementById("totalpage");
	
	//Data layer
	function jsonLoader(){
	
		window.onload = function () {
		
			if(query != undefined){
				input.value = query
				//Rule 2: Use JSONP
				var script = document.createElement("script");
				script.type = "text/javascript";
				script.id = "jsonSrc";
				//Rule 3: Build URL based on user input
				script.src = "https://api.twitch.tv/kraken/search/streams?q="+  query +"&callback=twitch.myFunction";
				
				document.getElementsByTagName("head")[0].appendChild(script);
			} else {
				input.value = "Search...";
				errormessage.innerHTML = "Please Enter a Search term";
			};
		};
	};
	
	//Search Trigger
	function search(){

		button.onclick = function(){
			query = input.value; 
			
			if(query.length > 0 && query != "Search..."){
				window.location.search = 'q=' + query;
			} else {
				errormessage.innerHTML = "Please Enter a Search term";
			}
		};
	};
	
	//Pagibnation Status
	function pageStatus(pagecounter){
		var elems = document.getElementsByClassName("streamlist");
		for(var i = 0; i < elems.length; i++) {
			elems[i].style.display = 'none';
		}
		document.getElementById("set" + pagecounter).style.display = 'block';
		current.innerHTML = pagecounter + 1;
	};
	
	//Render View / list
	function myFunction(arr) {
		if(arr.streams.length > 0) {
			document.getElementById("pagination").style.display = 'block';

			var totalpage = Math.ceil(arr.streams.length / 5);
			var pagecounter = 0;
			var leftarrow = document.getElementById("leftpage");
			var rightarrow =  document.getElementById("rightpage");
				
			if(arr.streams.length > 5){
				
				current.innerHTML = 1;
				total.innerHTML = totalpage;
				
				leftarrow.style.display = 'none';
		
				rightarrow.onclick = function(){
					pagecounter++;
					leftarrow.style.display = 'inline-block';
					
					if(pagecounter == (totalpage - 1)){
						rightarrow.style.display = 'none';
					}
					
					pageStatus(pagecounter);
				}
				
				leftarrow.onclick = function(){
					pagecounter--;
					rightarrow.style.display = 'inline-block';
					
					if(pagecounter == 0){
						leftarrow.style.display = 'none';
					}
					
					pageStatus(pagecounter);
				}
			} else {
				leftarrow.style.display = 'none';
				rightarrow.style.display = 'none';
				current.innerHTML = 1;
				total.innerHTML = totalpage;
			}
				
			//Rule 4: Bulid list as shown in the mock
			var out = "";
			for(var i = 0; i < Math.ceil(arr.streams.length / 5); i++){
				out += '<ul class="streamlist" id="set' + i + '">';
					for(var j = (i * 5); j < (5 * (i + 1)); j++) {
						if(j < arr.streams.length) {
							out += '<li>' +
									'<div class="container">' + 
										'<a href="' + arr.streams[j].channel.url + '">' +
											'<img src="' + arr.streams[j].preview.medium + '" alt="' + arr.streams[j].channel.display_name + '" width="120" height="100" />' +
										'</a>' +
										'<div class="content">' + 
											'<a href="' + arr.streams[j].channel.url + '">' +
												'<h2>' + arr.streams[j].channel.display_name + '</h2>' +
											'</a>' +
											'<p>' + arr.streams[j].game + ' - ' + arr.streams[j].viewers + ' viewers</p>' +
											'<p>' + arr.streams[j].channel.status + '</p>' +
										'</div>' +
									'</div>' +
								'</li>';
						}
					}
				out += "</ul>";
			}
		
			document.getElementById("totalresults").innerHTML = "Total results: " + arr.streams.length;
			document.getElementById("list").innerHTML = out;
		} else {
			document.getElementById("message").innerHTML = "No Results found";
			document.getElementById("pagination").style.display = 'none';
		}
	}
	
	return {
		jsonLoader: jsonLoader,
		search: search,
		myFunction: myFunction
	}

}();

twitch.jsonLoader();
twitch.search();
		