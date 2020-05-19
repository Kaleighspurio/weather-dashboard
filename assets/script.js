var m = moment().format("MMMM Do, YYYY");
var condensedM = moment().format("l");
var cityInput;
var stateInput;
var cityAndState;

// Take the last searched city from local storage and create a button with that city containing the appropriate data attributes and appends them to the #city-buttons div. Also run an ajax request so the last searched city's weather is displayed.
var localStoreCity = localStorage.getItem("city-history");
var localStoreState = localStorage.getItem("state-history");
if (localStoreCity != null && localStoreState != null) {
  var savedCity = $("<button>", {
    class: "button  is-fullwidth is-light city-button",
    "data-city": localStoreCity,
    "data-state": localStoreState,
    text: localStoreCity + ", " + localStoreState,
  });
  $("#city-buttons").append(savedCity);
}
cityInput = localStoreCity;
stateInput = localStoreState;
$("#city-input").val(localStoreCity);
$("#state").val(localStoreState);
if (localStoreCity && localStoreState){
  ajaxRequestFunctionNoNewButton();
}


// When the search button is clicked run the ajax request function
$(".search-button").on("click", function () {
  // if an error message is already displayed, it will disappear when the search button is clicked
  $(".input-error-message").empty();
  cityInput = $("#city-input").val();
  if (cityInput === "") {
    //   If nothing is typed in the input, a <p> is created with a message and appended above the input
    var typeCityMessage = $("<p>", {
      class: "input-error-message",
      text: "Oops, you forgot something. Please type a city",
    });
    $(".city-search").prepend(typeCityMessage);
  } else {
    ajaxRequestFunction();
  }
  $("#city-input").val("");
});

//  ********  Ajax request function *****
function ajaxRequestFunction() {
  // the 5-day forecast divs become visible
  $(".five-day-container").empty();
  // This empties the #current-weather div if there is already information presented there
  $("#current-weather").empty();

  //   Take the input values from the city and state input areas and store them in local storage
  cityInput = $("#city-input").val();
  stateInput = $("#state").val();
  cityAndState = `${cityInput}, ${stateInput}`;
  localStorage.setItem("city-history", cityInput);
  localStorage.setItem("state-history", stateInput);

  //   when the search button is clicked, a new button with the city and state just searched is created and appended below the search button
  var cityButton = $("<button>", {
    class: "button  is-fullwidth is-light city-button",
    text: cityAndState,
    "data-city": localStorage.getItem("city-history"),
    "data-state": localStorage.getItem("state-history"),
  });
  $("#city-buttons").prepend(cityButton);

  var apiKey = "9d66412a01adf0dc225bf9f09e3633d2";
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput},us&appid=${apiKey}`;

  // ***** ajax request for the current weather with city and state parameters, for searching inside the US
  $.get(currentWeatherUrl).then(function (response) {
    // create a variable for the source of the icon image that will be appended
    var icon = response.weather[0].icon + ".png";
    var iconUrl = "https://openweathermap.org/img/w/" + icon;
    // convert the temperature from Kelvin to Fahrenheit
    var currentTemperature = Math.round(response.main.temp * 1.8 - 459.67);
    var currentHumidity = response.main.humidity;
    var currentWind = response.wind.speed;
    // add the current city searched to the current weather span
    $("#current-weather-city").text(response.name);
    $("#current-date").text("on " + m);
    // create <p> tags for the temp, humidty and windspeed
    var currentIconEl = $("<img>", {
      src: iconUrl,
      width: "70px",
    });
    var currentTempEl = $("<p>").text(
      `Current Temp: ${currentTemperature} ° F`
    );
    var currentHumidityEl = $("<p>").text(`Humidity: ${currentHumidity}%`);
    var currentWindspeedEl = $("<p>").text(`Windspeed: ${currentWind} mph`);
    // append the icon, temp, humidity, and wind elements to the #current-weather div
    $("#current-weather").append(
      currentIconEl,
      currentTempEl,
      currentHumidityEl,
      currentWindspeedEl
    );

    // Use the lattitude and longitude from the previous ajax response in a request for the uv index
    var longitude = response.coord.lon;
    var lattitude = response.coord.lat;
    var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lattitude}&lon=${longitude}`;
    //  Ajax request for the UV-index
    $.get(uvIndexUrl).then(function (uvResponse) {
      console.log(uvResponse);
      //   create a <p> to display the UV-index
      var uvIndexEl = $("<p>", {
        class: "uv-index",
      }).text(`UV Index: ${uvResponse.value}`);
      //   if the uv-index falls within certain ranges, the background of the uvUndexEl will change to indicate the severity of the current index
      if (uvResponse.value < 3) {
        uvIndexEl.css("background-color", "green");
      } else if (
        uvResponse.value === 3.0 ||
        (uvResponse.value < 6.0 && uvResponse.value > 3.0)
      ) {
        uvIndexEl.css("background-color", "#fff34a");
      } else if (
        uvResponse.value === 6.0 ||
        (uvResponse.value < 8.0 && uvResponse.value > 6.0)
      ) {
        uvIndexEl.css("background-color", "#ff9d00");
      } else if (
        uvResponse.value === 8.0 ||
        (uvResponse.value < 11.0 && uvResponse.value > 8.0)
      ) {
        uvIndexEl.css({"background-color": "#ff0000", "color": "white"});
      } else {
        uvIndexEl.css({"background-color": "#a30214", "color": "white"});
      }
      //   append the uvIndex element to the current weather div
      $("#current-weather").append(uvIndexEl);
    });

    // this url give a response with a 7 day weather forecast using the lat. and long. received on the previous request
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=current,hourly&appid=${apiKey}`;
    // make a request for 7 day forcast
    $.get(fiveDayURL).then(function (fiveDayData) {
      console.log(fiveDayData);
      var dailyForecastArray = fiveDayData.daily;
      //   for the first 5 days in the forecast, create <p> and <img> elements to display the icons, dates, temps, and humidity for each day and append it to the five-day-container div
      for (i = 0; i < 5; i++) {
        var dateEl = $("<p>", {
          class: "date-element",
        }).text(moment.unix(dailyForecastArray[i].dt).format("l"));
        var fiveDayIconUrl =
          "https://openweathermap.org/img/w/" +
          dailyForecastArray[i].weather[0].icon +
          ".png";
        var fiveDayIconEl = $("<img>", {
          src: fiveDayIconUrl,
          width: "60px",
        });
        var fiveDayTempEl = $("<p>").text(
          "Temp: " +
            Math.round(dailyForecastArray[i].temp.day * 1.8 - 459.67) +
            "°"
        );
        var fiveDayHumidityEl = $("<p>").text(
          "Humidity: " + dailyForecastArray[i].humidity + "%"
        );
        var fiveDayDivEl = $("<div>", {
          class: "tile is-child box five-day",
        });
        $(".five-day-container").append(fiveDayDivEl);
        fiveDayDivEl.append(
          dateEl,
          fiveDayIconEl,
          fiveDayTempEl,
          fiveDayHumidityEl
        );
      }
    });
  });
}

// When the user clicks one of the cities they have searched before, the data attribute of the target is grabbed and used to rerun the ajax request
$(document).on("click", ".city-button", function () {
  var cityInput = $(this).attr("data-city");
  var stateInput = $(this).attr("data-state");
  $("#city-input").val(cityInput);
  $("#state").val(stateInput);
  ajaxRequestFunctionNoNewButton();
});

function ajaxRequestFunctionNoNewButton() {
  // the 5-day forecast divs become visible
  $(".five-day-container").empty();
  // This empties the #current-weather div if there is already information presented there
  $("#current-weather").empty();

  //   Take the input values from the city and state input areas and store them in local storage
  cityInput = $("#city-input").val();
  stateInput = $("#state").val();
  cityAndState = `${cityInput}, ${stateInput}`;
  localStorage.setItem("city-history", cityInput);
  localStorage.setItem("state-history", stateInput);

  var apiKey = "9d66412a01adf0dc225bf9f09e3633d2";
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput},us&appid=${apiKey}`;

  $.get(currentWeatherUrl).then(function (response) {
    // create a variable for the source of the icon image that will be appended
    var icon = response.weather[0].icon + ".png";
    var iconUrl = "https://openweathermap.org/img/w/" + icon;
    // convert the temperature from Kelvin to Fahrenheit
    var currentTemperature = Math.round(response.main.temp * 1.8 - 459.67);
    var currentHumidity = response.main.humidity;
    var currentWind = response.wind.speed;
    // add the current city searched to the current weather span
    $("#current-weather-city").text(response.name);
    $("#current-date").text("on " + m);
    // create <p> tags for the temp, humidty and windspeed
    var currentIconEl = $("<img>", {
      src: iconUrl,
      width: "70px",
    });
    var currentTempEl = $("<p>").text(
      `Current Temp: ${currentTemperature} ° F`
    );
    var currentHumidityEl = $("<p>").text(`Humidity: ${currentHumidity}%`);
    var currentWindspeedEl = $("<p>").text(`Windspeed: ${currentWind} mph`);
    // append the icon, temp, humidity, and wind elements to the #current-weather div
    $("#current-weather").append(
      currentIconEl,
      currentTempEl,
      currentHumidityEl,
      currentWindspeedEl
    );

    // Use the lattitude and longitude from the previous ajax response in a request for the uv index
    var longitude = response.coord.lon;
    var lattitude = response.coord.lat;
    var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lattitude}&lon=${longitude}`;
    //  Ajax request for the UV-index
    $.get(uvIndexUrl).then(function (uvResponse) {
      //   create a <p> to display the UV-index
      var uvIndexEl = $("<p>", {
        class: "uv-index",
      }).text(`UV Index: ${uvResponse.value}`);
      //   if the uv-index falls within certain ranges, the background of the uvUndexEl will change to indicate the severity of the current index
      if (uvResponse.value < 3) {
        uvIndexEl.css("background-color", "green");
      } else if (
        uvResponse.value === 3.0 ||
        (uvResponse.value < 6.0 && uvResponse.value > 3.0)
      ) {
        uvIndexEl.css("background-color", "#fff34a");
      } else if (
        uvResponse.value === 6.0 ||
        (uvResponse.value < 8.0 && uvResponse.value > 6.0)
      ) {
        uvIndexEl.css("background-color", "#ff9d00");
      } else if (
        uvResponse.value === 8.0 ||
        (uvResponse.value < 11.0 && uvResponse.value > 8.0)
      ) {
        uvIndexEl.css({"background-color": "#ff0000", "color": "white"});
      } else {
        uvIndexEl.css({"background-color": "#a30214", "color": "white"});
      }
      //   append the uvIndex element to the current weather div
      $("#current-weather").append(uvIndexEl);
    });

    // this url give a response with a 7 day weather forecast using the lat. and long. received on the previous request
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=current,hourly&appid=${apiKey}`;
    // make a request for 7 day forcast
    $.get(fiveDayURL).then(function (fiveDayData) {
      var dailyForecastArray = fiveDayData.daily;
      //   for the first 5 days in the forecast, create <p> and <img> elements to display the icons, dates, temps, and humidity for each day and append it to the five-day-container div
      for (i = 0; i < 5; i++) {
        var dateEl = $("<p>", {
          class: "date-element",
        }).text(moment.unix(dailyForecastArray[i].dt).format("l"));
        var fiveDayIconUrl =
          "https://openweathermap.org/img/w/" +
          dailyForecastArray[i].weather[0].icon +
          ".png";
        var fiveDayIconEl = $("<img>", {
          src: fiveDayIconUrl,
          width: "60px",
        });
        var fiveDayTempEl = $("<p>").text(
          "Temp: " +
            Math.round(dailyForecastArray[i].temp.day * 1.8 - 459.67) +
            "°"
        );
        var fiveDayHumidityEl = $("<p>").text(
          "Humidity: " + dailyForecastArray[i].humidity + "%"
        );
        var fiveDayDivEl = $("<div>", {
          class: "tile is-child box five-day",
        });
        $(".five-day-container").append(fiveDayDivEl);
        fiveDayDivEl.append(
          dateEl,
          fiveDayIconEl,
          fiveDayTempEl,
          fiveDayHumidityEl
        );
      }
    });
  });
}
