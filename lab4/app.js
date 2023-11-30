document.addEventListener("DOMContentLoaded", function () {
  const currentLocationBtn = document.getElementById("currentLocationBtn");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const sunriseSunsetInfo = document.getElementById("sunriseSunsetInfo");
  const errorDisplay = document.getElementById("errorDisplay");

  currentLocationBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchSunriseSunsetData(latitude, longitude);
        },
        (error) => {
          displayError("Error getting the current location. Please try again.");
        }
      );
    } else {
      displayError("Geolocation is not supported by this browser.");
    }
  });

  searchBtn.addEventListener("click", () => {
    const locationQuery = searchInput.value;
    const geocodeApiUrl = `https://geocode.maps.co/search?q=${encodeURIComponent(
      locationQuery
    )}&_=${Date.now()}`;

    fetch(geocodeApiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Geocode API request failed with status ${response.status}`
          );
        }
        return response.json();
      })
      .then((data) => {
        console.log("Geocode API Data:", data);

        if (data && data.length > 0) {
          const { lat, lon } = data[0];
          fetchSunriseSunsetData(lat, lon);
        } else {
          displayError(
            "Location not found or invalid response from the geocode API."
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching data from the geocode API:",
          error.message
        );
        displayError(
          "An error occurred while fetching data. Please try again."
        );
      });
  });

  function fetchSunriseSunsetData(latitude, longitude) {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const apiUrlToday = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${
      today.toISOString().split("T")[0]
    }`;
    const apiUrlTomorrow = `https://api.sunrisesunset.io/json?lat=${latitude}&lng=${longitude}&date=${
      tomorrow.toISOString().split("T")[0]
    }`;

    Promise.all([fetch(apiUrlToday), fetch(apiUrlTomorrow)])
      .then(([responseToday, responseTomorrow]) => {
        return Promise.all([responseToday.json(), responseTomorrow.json()]);
      })
      .then(([dataToday, dataTomorrow]) => {
        console.log("Sunrise Sunset API Response Today:", dataToday);
        console.log("Sunrise Sunset API Response Tomorrow:", dataTomorrow);
        updateDashboard(dataToday, dataTomorrow);
      })
      .catch((error) => {
        displayError("Error fetching data from the Sunrise Sunset API.");
      });
  }

  function updateDashboard(dataToday, dataTomorrow) {
    const sunriseTimeToday = formatTime(dataToday.results.sunrise);
    const sunsetTimeToday = formatTime(dataToday.results.sunset);
    const dawnTimeToday = formatTime(dataToday.results.dawn);
    const duskTimeToday = formatTime(dataToday.results.dusk);
    const dayLengthToday = formatDuration(dataToday.results.day_length);
    const solarNoonToday = formatTime(dataToday.results.solar_noon);

    const sunriseTimeTomorrow = formatTime(dataTomorrow.results.sunrise);
    const sunsetTimeTomorrow = formatTime(dataTomorrow.results.sunset);
    const dawnTimeTomorrow = formatTime(dataTomorrow.results.dawn);
    const duskTimeTomorrow = formatTime(dataTomorrow.results.dusk);
    const dayLengthTomorrow = formatDuration(dataTomorrow.results.day_length);
    const solarNoonTomorrow = formatTime(dataTomorrow.results.solar_noon);

    sunriseSunsetInfo.innerHTML = `
    <div class="day-info">
      <p>Today:</p>
      <p>Sunrise: ${sunriseTimeToday}</p>
      <p>Sunset: ${sunsetTimeToday}</p>
      <p>Dawn: ${dawnTimeToday}</p>
      <p>Dusk: ${duskTimeToday}</p>
      <p>Day Length: ${dayLengthToday}</p>
      <p>Solar Noon: ${solarNoonToday}</p>
    </div>

    <div class="day-info">
      <p>Tomorrow:</p>
      <p>Sunrise: ${sunriseTimeTomorrow}</p>
      <p>Sunset: ${sunsetTimeTomorrow}</p>
      <p>Dawn: ${dawnTimeTomorrow}</p>
      <p>Dusk: ${duskTimeTomorrow}</p>
      <p>Day Length: ${dayLengthTomorrow}</p>
      <p>Solar Noon: ${solarNoonTomorrow}</p>
    </div>
  `;
  }

  function formatTime(timeString) {
    // You can add additional formatting if needed
    return timeString;
  }

  function formatDuration(durationString) {
    // You can add additional formatting if needed
    return durationString;
  }

  function displayError(errorMessage) {
    errorDisplay.textContent = errorMessage;
  }
});
