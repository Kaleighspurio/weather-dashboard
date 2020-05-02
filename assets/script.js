// There will be two inputs.  One for the city and one for the state
// The user will type in a city and state and click the search button
// the text that the user inputs will fill in an ajax query url to get a response with the current weather for that area

// ***** When the search button is clicked*****
$(".search-button").on("click", function () {
  var cityInput = $("#city-input").val();
  console.log(cityInput);
  var stateInput = $("#state").val();
  console.log(stateInput);
  console.log(cityInput);

  var cityAndState = `${cityInput}, ${stateInput}`;
  localStorage.setItem("history", cityAndState);
  var cityButton = $("<button>", {
    class: "button is-info is-fullwidth is-light",
    text: cityAndState,
    "data-city": cityInput,
    "data-state": stateInput
  });
  $("#city-buttons").prepend(cityButton);

  var apiKey = "9d66412a01adf0dc225bf9f09e3633d2";
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput},us&appid=${apiKey}`;
  console.log(currentWeatherUrl);
  // When the search button is click,
  //       -the city and state will be saved into local storage
  //       - an ajax request will run for the current weather (see below)
  $.get(currentWeatherUrl).then(function (response) {
    // empty the #current-weather div if there is already information presented there
    $("#current-weather").empty();
    console.log(response);
    var icon = response.weather[0].icon + ".png";
    var iconUrl = "http://openweathermap.org/img/w/" + icon;
    // convert the temperature from Kelvin to Fahrenheit
    var currentTemperature = Math.round(response.main.temp * 1.8 - 459.67);
    var currentHumidity = response.main.humidity;
    var currentWind = response.wind.speed;
    console.log(currentHumidity);
    $("#current-weather-city").text(response.name);
    // create <p> tags for the temp, humidty and windspeed
    var currentIconEl = $("<img>", {
      src: iconUrl,
    });
    var currentTempEl = $("<p>").text(
      `Current Tempurature: ${currentTemperature} degrees F`
    );
    var currentHumidityEl = $("<p>").text(`Humidity: ${currentHumidity}%`);
    var currentWindspeedEl = $("<p>").text(`Windspeed: ${currentWind} mph`);
    // append the elements just created to the #current-weather div
    $("#current-weather").append(
      currentIconEl,
      currentTempEl,
      currentHumidityEl,
      currentWindspeedEl
    );
    var longitude = response.coord.lon;
    var lattitude = response.coord.lat;
    var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lattitude}&lon=${longitude}`
    $.get(uvIndexUrl).then(function(uvResponse){
        console.log(uvResponse);
        var uvIndexEl = $("<p>").text(`UV Index: ${uvResponse.value}`);
        $("#current-weather").append(uvIndexEl);
    });


  });
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
