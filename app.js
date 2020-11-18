'use strict';

const apiKey = 'E37nX8N0Kzg4xNImwdsUuQowpxDlgtzjcPxsatyn';
const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson, limit) {
    console.log(responseJson);
    // if there are previous results, remove them
    $('#results-list').empty();
    // iterate through the array, stopping at the max number of results
    for (let i = 0; i < responseJson.data.length & i < limit; i++) {
      // for each object in the array,
      // add a list item to the results
      // list with park name, address, description, and website
      $('#results-list').append(
        `<li><h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].addresses[0].line1}, ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode}, ${responseJson.data[i].addresses[0].postalCode}</p>
        <p>${responseJson.data[i].description}</p>
        <p><a href="${responseJson.data[i].url}">Visit Park Website</a></p>
        </li>`
      )};
    //display the results section  
    $('#results').removeClass('hidden');
};

function getParks(state, limit=10) {
    const params = {
        api_key: apiKey,
        stateCode: state,
        limit: limit
    };

    const queryString = formatQueryParams(params);
    const url = searchUrl + '?' + queryString;

    console.log(url);

    // const options = {
    //     headers: new Headers({
    //       "x-rapidapi-key": apiKey})
    // };

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, limit))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      const state = $('#js-state').val().toUpperCase();
      const limit = $('#js-limit-results').val();
      getParks(state, limit);
    });
}

$(watchForm);
