/**
 * GuitarParty.com Client Library
 * Author: Alex Bartfeld
 */

const method = {
    GET: 'GET'
};

const config = {
    API_KEY: '',
    API_HOST: 'http://api.guitarparty.com/v2/',
    NUMBER_OF_ATTEMPTS: 4,
    TIMEOUT_BETWEEN_ATTEMPTS: 5000
};

/*******************************/
/******** Cache handling *******/
/*******************************/

const cache = {};

/**
 * @param key
 * @return {*}
 */
function getCache(key) {
    return cache[key];
}

/**
 * @param key
 * @param value
 * @param value.data
 * @param value.timeStamp
 */
function setCache(key, value) {
    cache[key] = value;
}

/**
 * @param url
 * @return {*}
 */
function isCached(url) {
    const cacheEntry = getCache(url);

    if (cacheEntry && Date.now() - cacheEntry['timeStamp'] < 5000) {
        return cacheEntry['data'];
    } else {
        return false;
    }
}

/*******************************/
/******** Fetch handling *******/
/*******************************/


/**
 * @param response
 * @return {*}
 * @private
 */
function _checkStatus(response) {
    if (response.ok) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
}

/**
 * @param response
 * @return {any | Promise<any>}
 * @private
 */
function _parseJson(response) {
    return response.json();
}

/**
 * @param url
 * @param method
 * @return {Promise<Response | never | {error: any, status: string}>}
 * @private
 */
function _fetch(url, method) {
    return fetch(url, {method: method, headers: {'Guitarparty-Api-Key': config.API_KEY}})
        .then(_checkStatus)
        .then(_parseJson)
        .then(function(data) {
            return data;
        })
        .catch(function(error) {
            throw error;
        });
}

/**
 * @param url
 * @param {number } [retries = 0]
 * @return {Promise<any>}
 * @private
 */
function _get(url, retries) {
    let cacheEntry = isCached(url);
    retries = retries || 0;

    return new Promise(function(resolve, reject) {
        if (cacheEntry) {
            resolve(cacheEntry)
        } else {
            const formattedURL = url.replace(' ', '+');

            _fetch(formattedURL, method.GET)
                .then(function(response) {
                    setCache(formattedURL, {data: response, timeStamp: Date.now()});
                    resolve(response);
                })
                .catch(function(error) {
                    if (retries === config.NUMBER_OF_ATTEMPTS) return reject(error); // <--- base case!
                    setTimeout(function() {
                        _get(url, retries + 1)
                            .then(resolve)
                            .catch(reject);
                    }, config.TIMEOUT_BETWEEN_ATTEMPTS)
                });
        }
    })
}

/*******************************/
/************* API *************/
/*******************************/

/**
 * @param apiKey
 * @constructor
 */
const GuitarPartyAPI = function(apiKey) {
    config.API_KEY = apiKey;
};

/**
 * @param {string} songName
 * @return {Promise}
 */
GuitarPartyAPI.prototype.searchSongs = function(songName) {
    return _get(config.API_HOST + 'songs/?query=' + songName);
};

/**
 * @param {number} songId
 * @return {Promise}
 */
GuitarPartyAPI.prototype.getSong = function(songId) {
    return _get(config.API_HOST + 'songs/' + songId + '/');
};

/**
 * @param {string} artist
 * @return {Promise}
 */
GuitarPartyAPI.prototype.searchArtists = function(artist) {
    return _get(config.API_HOST + 'artists/?query=' + artist)
};

/**
 * @param {number} artistId
 * @return {Promise}
 */
GuitarPartyAPI.prototype.getArtist = function(artistId) {
    return _get(config.API_HOST + 'artists/' + artistId + '/');
};

/**
 * @param {string} chord - can be a chord name ex. G or chord fingering ex. 32oo33
 * @return {Promise}
 */
GuitarPartyAPI.prototype.searchChords = function(chord) {
    return _get(config.API_HOST + 'chords/?query=' + chord);
};

/**
 * @param chordId
 * @return {Promise}
 */
GuitarPartyAPI.prototype.getChordVariations = function(chordId) {
    return _get(config.API_HOST + 'chords/' + chordId + '/?variations=true');
};

module.exports = GuitarPartyAPI;
