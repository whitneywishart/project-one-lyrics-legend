const clientId = '07745df9262c4de48f0f8d25213b10a3';
const clientSecret = 'c7e3a9d7bfad4498af076f0ca496f6e7';
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
lyricContainer = document.getElementById("lyrics")
var queryEl = document.getElementById("query")
var search = document.getElementById("searchBtn")
var query = "mother";
var player = document.getElementById("player")


init = function(){
fetch('https://accounts.spotify.com/api/token', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${encodedCredentials}`,
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
})
  .then(response => response.json())
  .then(data => {
    const accessToken = data.access_token;
    console.log(`Access token: ${accessToken}`);

    var url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data.tracks.items);
        playSong(data.tracks.items)
      })
      .catch(error => console.error(error));
  })
  .catch(error => console.error(error));
}


  playSong = function(songs){
    title = songs[0].name
    artist = songs[0].artists[0].name
    uri = songs[0].uri
    player.src = `https://open.spotify.com/embed/track/${uri.split(':')[2]}`
    getLyrics(title,artist)
  }


getLyrics = function(title,artist){           
    fetch(`https://cors-anywhere.herokuapp.com/http://api.chartlyrics.com/apiv1.asmx/SearchLyricDirect?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(title)}`)
      .then(response => {
        if (response.ok) {
          return response.text();
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .then(data => {
        console.log(data);
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, "text/xml");
        const lyricNodes = xmlDoc.getElementsByTagName("Lyric");
        if (lyricNodes.length > 0) {
            const lyric = lyricNodes[0].textContent;
            console.log(lyric);
            if (lyric){
                lyricContainer.textContent = lyric
                lyricFormat()
            } else {
                lyricContainer.textContent = "No Lyrics Found"
            }
          } else {
            console.error("Error: Could not find lyrics in XML response");
          }
      })
      .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
      });
    
}

var formSubmitHandler = function (event) {
  event.preventDefault();
  query = queryEl.value.trim()
  init()
}
var lyricFormat = function (){
  var replace = /\W+(?=[A-Z][a-z])/g;
  var text = document.getElementById("lyrics").innerHTML;
  text = text.replace(replace, '$&<br>');
  console.log(text)
}


  init()
  search.addEventListener("click", formSubmitHandler)

//Add line breaks at each upper case lyric
//This works when I add text directly to the html file
queryEl.addEventListener("keyup", (event) => {
  if (event.keyCode === 13) {
    search.click()
  }
 });
 
 
 var songContainer = document.querySelector('.songContainer');
 
 
 function songHistoryOnStartup(){
  songList = JSON.parse(localStorage.getItem('songNames')) || []
  for(i = 0; i < songList.length; i++){
    songItem = document.createElement('button');
    songItem.textContent = songList[i];
    songContainer.append(songItem);
  }
 }
 songHistoryOnStartup()
 
 
 function songHistory(){
  songList = JSON.parse(localStorage.getItem('songNames')) || [];
  if(!songList.includes(query)){
    songList.push(query);
    localStorage.setItem('songNames',JSON.stringify(songList));
  }
  songContainer.innerHTML = '';
  for(i = 0; i < songList.length; i++){
    songItem = document.createElement('button');
    songItem.textContent = songList[i];
    songContainer.append(songItem);
  }
 }
 
 
 document.querySelector('.songContainer').addEventListener('click', () => {
  if (event.target.id !== 'emptyCheck'){
    queryEl.value = (event.target.textContent)
          search.click();
  }
 })
 
 
 document.getElementById('clearBtn').addEventListener('click', () => {
  localStorage.clear();
  songContainer.innerHTML = ''
 })
 
 
 document.getElementById('songAddBtn').addEventListener('click', () => {
  songHistory()
 })
 
  var cssStyle = document.getElementById('styling')
  document.getElementById('toggleMode').addEventListener('click', function(){
    if(cssStyle.href.includes('dark-style')){
      cssStyle.href = './assets/light-style.css';
    }else{
      cssStyle.href = './assets/dark-style.css';
    }
  });
  