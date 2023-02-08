const clientId = '07745df9262c4de48f0f8d25213b10a3';
const clientSecret = 'c7e3a9d7bfad4498af076f0ca496f6e7';
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
lyricContainer = document.getElementById("lyrics").value
var query = document.getElementById('inputSong');
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
  init()
  
//listens for the enter key while in the textbox, if someone presses enter, triggers a click event on submit
query.addEventListener('keyup', function(event){
  if (event.keyCode === 13){
    document.getElementById('addBtn').click()
  }
})
//listens for a click event on an element with the id addBtn
document.getElementById('addBtn').addEventListener("click", function(){
//checks if the user has less than 5 playlists if they dont then else runs
  if(allPlaylists.length < 5){
//declares song as user input, calls on addToPlaylist
  var song = query.value
  addToPlaylist(song);
}else{
  indicator.textContent = 'The Max Number Of Playlists Is 5'
}
//clears the input field
  query.value = ''
});
//defines playlist as an empty array
let allPlaylists = []
let playlist = [];
//defines "songList" "playlistDisplay" and "indicator"
var songList = document.querySelector('.songDisplay')
var playlistDisplay = document.querySelector('.playlistsDisplay')
var indicator = document.querySelector('#addedOrNot')
//adds "song" to "playlist"
function addToPlaylist(song){
//check to make sure it contains any characters, the playlist has 10 or less songs 
  if (song !== '' && playlist.length < 10){
//pushes the 
    playlist.push(song)
    document.querySelector('#addedOrNot').textContent = 'Song Added!'
//adds each song to the songList div
    var newSong = document.createElement('li');
    newSong.textContent = (song)
    songList.appendChild(newSong)
// triggers if the song input field is blank, if thats not the case then the next statement triggers when theres already 10 songs
  } else if(song === ''){
    indicator.textContent = 'Please Enter A Song Name'
  }else{
    indicator.textContent = 'The Maximum Length Of A Playlist Is 10 Songs'
  }
}
//adds the contents of "playlist" to an array called "allPlaylists" and clears the current playlist so you can make a new one
document.getElementById('savePlaylist').addEventListener("click", function(){
//checks if 
  if (playlist != '' && allPlaylists.length < 5){
//adds the playlist array to another array containing all playlists
    allPlaylists.push(playlist);
//removes the songs displayed on screen
    songList.innerHTML = ''
//adds each playlist to the playlistDisplay class
    var newPlaylist = document.createElement('h2');
    newPlaylist.textContent = (playlist + ' -PLAYLIST')
    playlistDisplay.appendChild(newPlaylist)
//resets the playlist to empty so you're able to make a brand new playlist
    playlist = [];
//removes any text from the textbox
    query.value = ''
  }else{
//triggers when the user is unable to add another playlist, (playlist) is empty or you already have 5 playlists
    indicator.textContent = 'You Can\'t Add An Empty Playlist'
  }
})