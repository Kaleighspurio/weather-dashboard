// There will be two inputs.  One for the city and one for the state
// The user will type in a city and state and click the search button
// the text that the user inputs will fill in an ajax query url to get a response with the current weather for that area


// ***** When the search button is clicked*****
$(".search-button").on("click", function(){
    var cityInput = $("#city-input").val()
    var stateInput = $("#state").val();
    console.log(stateInput);
    console.log(cityInput);

    var apiKey = "9d66412a01adf0dc225bf9f09e3633d2";
    var currentWeatherUrl = ``;
    // When the search button is click, 
//       -the city and state will be saved into local storage
//       - an ajax request will run for the current weather (see below)
//       -a button will be created with that city and state information and will recall the request for that location
});



// ***** To get the current weather*****
// inside the click event:
// run an ajax request for the parameters the user inputs
// create elements dynamically for the city, date, icon, temperature, humidity, and wind in the #current-weather div

//***** To get the UV index *****
//  inside the current weather ajax request, do another ajax request for the UVIndex
//      - select the long and lat from the current weather request, store them in variables, and then put those variables into the queryurl for the uv index
//      - create a new <p> tag for the uv index and append it to the #current-weather div

// ******  To get the 5 day forecast *****
// inside the click event do another ajax request for the 5 day forcast