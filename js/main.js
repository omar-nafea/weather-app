const headers = document.querySelector('.header h1'),
    body = document.querySelector('.body'),
    inputField = document.querySelector('.body .search_bar'),
    findBtn = document.querySelector('.findMyLocation'),
    image = document.querySelector('.data .imag img'),
    data = document.querySelector('.data'),
    theTemp = document.querySelector('.data .temp .value'),
    theDescription = document.querySelector('.data .description .value'),
    theCityName = document.querySelector('.data .cityName .city'),
    theHumidity = document.querySelector('.data .humidity .value'),
    theSpeed = document.querySelector('.data .windSpeed .value'),
    search = document.querySelector('.body .search');
const apiKey = "98697bf8903a24b9c89d81cd3aaed666";
window.addEventListener('DOMContentLoaded', () => { inputField.focus() });

function request(city) {
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    bring()
}

function bring() {
    inputField.value = "Getting Details...";
    inputField.classList.add('details');
    inputField.setAttribute('readonly', 'true');
    search.style.display = 'none';
    fetch(api)
        .then((response) => {
            if (!response.ok) {
                inputField.value = "That is invalid city"
                inputField.classList.add('alt_error');
                inputField.setAttribute('readonly', 'true');
                search.style.display = 'none';
                throw new Error("No weather found.");
            }
            body.style.display = "none"
            data.style.display = "grid"
            return response.json();
        })
        .then((data) => {
            visualizing(data)
        });
}



function visualizing(data) {
    let { temp, humidity } = data.main;
    let cityName = data.name;
    let country = data.sys.country;
    let { description, id } = data.weather[0];
    let windSpeed = data.wind.speed;
    if (id == 800) {
        image.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
        image.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
        image.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
        image.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
        image.src = "icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
        image.src = "icons/rain.svg";
    }
    theTemp.innerHTML = temp.toFixed(0);
    theDescription.innerHTML = description;
    theCityName.innerHTML = `${cityName}, ${country}`;
    theHumidity.innerHTML = humidity;
    theSpeed.innerHTML = windSpeed.toFixed(1);
    document.body.style.backgroundImage =
        "url('https://source.unsplash.com/1600x900/?" + cityName + "')";
}
findBtn.addEventListener("click", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    } else {
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position) {
    const { latitude, longitude } = position.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`;
    bring();
}

function onError(error) {
    alert(error.message);
}

inputField.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (inputField.value !== '' && inputField.value.length > 1) {
            request(inputField.value);
        }
    }
});

search.addEventListener('click', function(e) {
    if (inputField.value !== '' && inputField.value.length > 1) {
        request(inputField.value);
    }
});

headers.addEventListener('click', () => {
    body.style.display = "grid"
    data.style.display = "none"
    inputField.classList.remove('alt_error');
    inputField.removeAttribute('readonly');
    inputField.value = "Getting Details...";
    inputField.classList.remove('details');
    inputField.value = '';
    search.style.display = 'block';
    inputField.focus();
});