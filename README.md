### Installation
```
npm install guitarparty-client
```

### Authentication
To use the Guitarparty API you must provide an API key. You can get an API key <a href="http://www.guitarparty.com/developers/api-key/">here</a> (must be a Guitarparty user and logged in).

### Usage
```
import GuitarParty from 'guitarparty';
const gpapi = new GuitarParty('YOUR_TOKEN')
```
More information about the API can be found at <a href="http://www.guitarparty.com/developers/api-docs/getting-started/introduction/">GuitarParty.com website</a>

### Available methods
- searchSongs
- getSong
- searchArtists
- getArtist
- searchChords
- getChordVariations

### Notes
There is a constant <a target="_blank" href="https://tech.mybuilder.com/handling-retries-and-back-off-attempts-with-javascript-promises/">backoff</a> algorithm implemented in case of Network error with 4 attempts and 5sec intervals.
