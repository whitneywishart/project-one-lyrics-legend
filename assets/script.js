const clientId = '07745df9262c4de48f0f8d25213b10a3';
const clientSecret = 'c7e3a9d7bfad4498af076f0ca496f6e7';
const encodedCredentials = btoa(`${clientId}:${clientSecret}`);
lyricContainer = document.getElementById("lyrics")
var query = "free bird";
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
