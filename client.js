/* =============================================================================
 * EECE/CS 3093C Software Engineering — Lab 4
 * client.js — code skeleton provided by Dr. Phu Phung in Lab1
 * Code complete implementation by Marcus Nguyen
 * ===============================================================================
 */

// UI DOM references
var searchBtnElm = document.getElementById('search-button');
if(!searchBtnElm) {
    console.log("Error in getting 'search-button' button");
}

searchBtnElm.addEventListener('click', () => {
    search();
    searchInput.value = ''; // clear the field after an explicit Enter search
});

var searchInput = document.getElementById('search-input');
if(!searchInput) {
    console.log("Error in getting 'search-input' input");
}

// Instant Ajax Request - at least 2 characters before suggesting and debounce ~300ms after the last keystroke
var debounceTimer = null;
searchInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter'){
        clearTimeout(debounceTimer);
        search();
        searchInput.value = ''; // clear the field after an explicit Enter search
        return;
    }
    clearTimeout(debounceTimer);
    var query = searchInput.value.trim();
    if (query.length < 2) return;               // AC5: need at least 2 characters before suggesting
    debounceTimer = setTimeout(search, 300);    // AC7: debounce ~300ms after the last keystroke
});

const BASE_URL = "https://nguye8tu-uscities-microservices-gmebhjdvhmcxa2fe.canadacentral-01.azurewebsites.net/"
async function search(){
    var query = searchInput.value.trim();
    if(!query || query.length === 0) return; // AC-02.2: empty messages are ignored
    console.log(`Debug>query: ${query}`); // for UI testing only
    try {
        const response = await fetch(`${BASE_URL}/uscities-search/${encodeURIComponent(query)}`);
        if (!response.ok) {
            throw new Error(`Unexpected status ${response.status}`); // AC4/AC11: fail safely, not open
        }
        const data = await response.json();
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('Malformed response'); // AC10: validate shape before display
        }
        displaySearch(data);
    } catch (err) {
        console.log(`Debug>search error: ${err.message}`);
        response.textContent = 'Error: could not load results.'; // AC4/AC11
    }
}

var responsesElm = document.getElementById('response');
function displaySearch(data){
    if (!responsesElm) {
        console.log('Error in getting "response" element');
        return;
    }
    // AC1/AC2: matches found - this version shows the raw JSON text
    // AC3: no matches - explicit message instead of a blank/empty display
    // textContent for now
    //responsesElm.textContent = data.length === 0 ? 'No cities found' : JSON.stringify(data, null, 2);
    responsesElm.innerHTML = json2htmltable(data);
}

// AC9/AC10: sanitize every field before it is rendered as HTML
function data_sanitize(v){
    return DOMPurify.sanitize(typeof v === 'string' ? v : '');
}
function json2htmltable(data){
    if (!Array.isArray(data) || data.length === 0) return "No cities found"; // AC10/AC11
    var items = data.map(function (c) {
        return '<li class="city-card"><strong>' + data_sanitize(c.city) + '</strong>, ' + 
        data_sanitize(c.state_name) + ' <span class ="zips">' + data_sanitize(c.zips) + '</span></li>';
    }).join('');
    return '<ul class="city-list">' + items + '</ul>';
}