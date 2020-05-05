var m = moment().format("MMMM Do, YYYY");
var condensedM = moment().format("l");

// ***** When the search button is clicked*****
$(".search-button").on("click", function () {
  // the 5-day forecast divs become visible
  $(".five-day-container").empty();
  var cityInput = $("#city-input").val();
  var stateInput = $("#state").val();
  var cityAndState = `${cityInput}, ${stateInput}`;
  //   save the last city and state to local storage
  localStorage.setItem("history", cityAndState);
  //   when the search button is clicked, a new button with the city and state just searched is created and appended below the search button
  var cityButton = $("<button>", {
    class: "button  is-fullwidth is-light city-button",
    text: cityAndState,
    "data-city": cityInput,
    "data-state": stateInput,
  });
  $("#city-buttons").prepend(cityButton);

  var apiKey = "9d66412a01adf0dc225bf9f09e3633d2";
  var currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput},${stateInput},us&appid=${apiKey}`;
  console.log(currentWeatherUrl);
  // ajax request for the current weather with city and state parameters, for searching inside the US
  $.get(currentWeatherUrl).then(function (response) {
    // This empties the #current-weather div if there is already information presented there
    $("#current-weather").empty();
    console.log(response);
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
    // append the elements just created to the #current-weather div
    $("#current-weather").append(
      currentIconEl,
      currentTempEl,
      currentHumidityEl,
      currentWindspeedEl
    );
    var longitude = response.coord.lon;
    var lattitude = response.coord.lat;
    var uvIndexUrl = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lattitude}&lon=${longitude}`;
    $.get(uvIndexUrl).then(function (uvResponse) {
      console.log(uvResponse);
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
        uvIndexEl.css("background-color", "#ff0000");
      } else {
        uvIndexEl.css("background-color", "#a30214");
      }
      //   append the uvIndex element to the current weather div
      $("#current-weather").append(uvIndexEl);
    });
    // this url give a response with a 7 day weather forecast using the lat. and long. received on the previous request
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${lattitude}&lon=${longitude}&exclude=current,hourly&appid=${apiKey}`;
    // makes a request for 7 day forcast
    $.get(fiveDayURL).then(function (fiveDayData) {
      console.log(fiveDayData);
      var dailyForecastArray = fiveDayData.daily;
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

  //       -a button will be created with that city and state information and will recall the request for that location
});
