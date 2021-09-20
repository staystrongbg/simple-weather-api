const url = 'http://api.weatherapi.com/v1';
const key = 'a6326300603a447aad861555210508';

const url_b = url + '/forecast.json?key=' + key + '&q=belgrade'; //default city

const fetchData = async (city) => {
  try {
    const resp = await fetch(`${url}/current.json?key=${key}&q=${city}`);
    const data = await resp.json();

    const resp_b = await fetch(url_b + '&days=3');
    const data_b = await resp_b.json();

    ui(data, data_b.forecast.forecastday);
  } catch (error) {
    console.log(error);
  }
};
//ovde menjas grad
fetchData('belgrade');

const ui = (data, forecast) => {
  console.log(data, forecast);

  let hours = forecast.map(({ hour }) => {
    return { hour };
  });

  let clock = hours[0].hour[9].time;
  let clock_mid = hours[0].hour[16].time;
  let clock_eve = hours[0].hour[23].time;
  let timeOfDay = forecast[0];

  clock = clock.slice(clock.length - 5, clock.length);
  clock_mid = clock_mid.slice(clock_mid.length - 5, clock_mid.length);
  clock_eve = clock_eve.slice(clock_eve.length - 5, clock_eve.length);

  const weatherBody = document.createElement('div');
  weatherBody.setAttribute('class', 'body');
  const card = document.querySelector('.card');

  const html = /*html */ `
        <p id="city">${data.location.name}</p>
        <img class='icon' src=${data.current.condition.icon} alt="condition" />
        <p style='margin-top:0'>${data.current.condition.text}</p> 
        <h1 class="temp">${data.current.temp_c}°</h1>
        <button class='btn active'>today</button>
        <button class='btn'>tommorow</button>
        <button class='btn'>after</button>
        <div class="days">
          <div class='day'>
            ${clock}<br>
            <img id='icon_today' class='icon' src=${timeOfDay.hour[9].condition.icon} alt="icon" />
            <h1 id='today'>${timeOfDay.hour[9].temp_c}°</h1>
          </div>
          <div class='day'>
            ${clock_mid}<br>
            <img id='icon_tommorow' class='icon' src=${timeOfDay.hour[16].condition.icon} alt="icon" />
            <h1 id='tommorow'> ${timeOfDay.hour[16].temp_c}°</h1>
          </div>
          <div class='day'>
            ${clock_eve}<br>
            <img id='icon_after' class='icon' src=${timeOfDay.hour[23].condition.icon} alt="icon" />
            <h1 id='after'> ${timeOfDay.hour[23].temp_c}°</h1>
          </div>
        </div>
        <h3 style='text-align:left; margin: 15px;font-weight:500'>Additional info</h3>
        <div class='dets'>
          <p>Cludiness: ${data.current.cloud}%</p>
          <p>Humidity: ${data.current.humidity}%</p>
          <p>Wind dir: ${data.current.wind_dir}</p>
          <p>Wind speed:  ${data.current.wind_kph}km/h</p>
        </div>
        <p id='updated'>last updated: ${data.current.last_updated}</p>
        `;

  weatherBody.innerHTML = html;

  card.appendChild(weatherBody);

  const btns = document.querySelectorAll('.btn');

  const addActiveClass = (e) => {
    btns.forEach((btn, idx) => {
      btn.classList.remove('active');
    });
    e.target.classList.add('active');
    if (e.target.textContent === 'tommorow') {
      timeOfDay = forecast[1];
      changeDay();
    }
    if (e.target.textContent === 'after') {
      timeOfDay = forecast[2];
      changeDay();
    }
    if (e.target.textContent === 'today') {
      timeOfDay = forecast[0];
      changeDay();
    }
  };

  const changeDay = () => {
    document.getElementById('icon_today').src =
      timeOfDay.hour[9].condition.icon;
    document.getElementById('icon_tommorow').src =
      timeOfDay.hour[16].condition.icon;
    document.getElementById('icon_after').src =
      timeOfDay.hour[23].condition.icon;
    document.getElementById('today').innerText = timeOfDay.hour[9].temp_c;
    document.getElementById('tommorow').innerText = timeOfDay.hour[16].temp_c;
    document.getElementById('after').innerText = timeOfDay.hour[23].temp_c;
  };

  btns.forEach((btn) => btn.addEventListener('click', addActiveClass));
};
