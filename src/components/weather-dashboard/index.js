import {Component} from 'react';
import {BarChart, Bar, XAxis, YAxis, LabelList} from 'recharts';
import {ThreeDots} from 'react-loader-spinner';
import './index.css';

const HourlyCoverage = props => {
  const {hourDetails} = props;

  return (
    <div className="container11">
      <BarChart
        width={2500}
        height={300}
        data={hourDetails}
        margin={{
          top: 5,
        }}
      >
        <XAxis
          dataKey="datetime"
          tick={{
            stroke: '#6c757d',
            strokeWidth: 1,
            fontSize: 10,
            fontFamily: 'Roboto',
          }}
        />
        <YAxis
          tick={{
            stroke: '#6c757d',
            strokeWidth: 0.5,
            fontSize: 15,
            fontFamily: 'Roboto',
          }}
        />
        <Bar
          dataKey="temp"
          name="temp"
          fill="orange"
          radius={[5, 5, 0, 0]}
          barSize="5%"
        >
          <LabelList dataKey="temp" position="outside" style={{fill: 'white'}} />
        </Bar>
      </BarChart>
    </div>
  );
};

const DailyItem = props => {
  const {forecastDetails, isLoading} = props;
  const {icon, datetime, feelslikemin, feelslikemax, sunrise, sunset} =
    forecastDetails || {};

  const minTemp = feelslikemin ? Math.round((feelslikemin - 32) * 0.55, 2) : '';
  const temp = feelslikemax ? Math.round((feelslikemax - 32) * 0.55, 2) : '';

  const date = datetime ? new Date(datetime) : new Date();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  const month = monthNames[date.getMonth()];
  const da = date.getDate();

  const iconMap = {
    'clear-day': 'https://assets.ccbp.in/frontend/intermediate-rwd/sunny-img.png',
    'partly-cloudy-day':
      'https://assets.ccbp.in/frontend/intermediate-rwd/partly-cloudy-img.png',
    'rain-with-sun':
      'https://assets.ccbp.in/frontend/intermediate-rwd/rain-with-sun-img.png',
  };
  const image = iconMap[icon] || '';

  return (
    <li className="mini1">
      {isLoading ? (
        <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
      ) : (
        <>
          <p className="ph ml-3">
            {da} {month}
          </p>
          <p className="sun">Sunrise: {sunrise}</p>
          <p className="sun">Sunset: {sunset}</p>
          <img src={image} className="icon" alt={icon || 'weather-icon'} />
          <div className="temp">
            <p className="po">
              {temp}
              <sup className="po">o</sup>/
            </p>
            <p className="po1">
              {minTemp}
              <sup className="po1">o</sup>
            </p>
          </div>
          <h1 className="pi">{icon}</h1>
        </>
      )}
    </li>
  );
};

const HourItem = props => {
  const {hourDetails, isLoading} = props;
  const {humidity, temp, datetime} = hourDetails || {};

  return (
    <div className="hour">
      {isLoading ? (
        <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
      ) : (
        <>
          <p className="sun1">hour: {datetime}</p>
          <p className="sun1">
            temp: {temp}
            <sup className="sun1">o</sup>
          </p>
          <p className="sun1">humidity: {humidity}</p>
        </>
      )}
    </div>
  );
};

class WeatherDashboard extends Component {
  state = {
    name: '',
    temp: '',
    searchInput: '',
    location: '',
    mainImg: '',
    condition: '',
    searchedData: '',
    forecast: [],
    windSpeed: 0,
    windDirection: '',
    humidit: 0,
    srise: '',
    sset: '',
    hour: [],
    lat: '',
    lng: '',
    isLoading: false,
    error: null,
  };

  componentDidMount() {
    this.getMyLocation();
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value});
  };

  getBlogItemData = async o => {
    this.setState({
      isLoading: true,
    });
    this.setState({searchInput: ''});

    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${o}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    );
    const r = await re.json();

    this.setState({forecast: r.days.slice(1, 8)});
    const {sunrise, sunset, hours} = r.days[0];

    const hourDetail = hours.map(eachHourData => ({
      temp: Math.round((eachHourData.temp - 32) * 0.55, 2),
      datetime: eachHourData.datetime,
      humidity: eachHourData.humidity,
    }));

    this.setState({hour: hourDetail, srise: sunrise, sset: sunset});

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${o}&aqi=yes`,
    );

    const data = await response.json();

    this.setState({searchedData: data}, this.updateData);
  };

  getAnyData = async () => {
    this.setState({
      isLoading: true,
    });
    const {searchInput} = this.state;

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${searchInput}&aqi=yes`,
    );

    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInput}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    );
    if (response.ok === true && re.ok === true) {
      const r = await re.json();
      this.setState({forecast: r.days.slice(1, 8)});
      const {hours} = r.days[0];

      const hoursDetail = hours.map(eachHourData => ({
        temp: Math.round((eachHourData.temp - 32) * 0.55, 2),
        datetime: eachHourData.datetime,
        humidity: eachHourData.humidity,
      }));

      this.setState({hour: hoursDetail});
      const data = await response.json();
      this.setState({searchedData: data}, this.updateData);
    } else {
      this.fake();
    }
  };

  fake = () => {
    alert('wrong input');
    this.setState({searchInput: ''});
    this.setState({
      isLoading: false,
    });
  };

  updateData = () => {
    const {searchedData} = this.state;

    if (searchedData?.current && searchedData?.location) {
      const {current, location} = searchedData;
      this.setState({
        temp: current.temp_c,
        location: location.name,
        condition: current.condition?.text || '',
        mainImg: current.condition?.icon || '',
        humidit: current.humidity,
        windDirection: current.wind_dir,
        windSpeed: current.wind_kph,
        isLoading: false,
      });
    } else {
      console.error('Invalid API response structure', searchedData);
      this.setState({error: 'Invalid API response format.', isLoading: false});
    }
  };

  enter = event => {
    if (event.key === 'Enter') {
      this.getAnyData();
    }
  };

  getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation;

    if (location) {
      this.setState({isLoading: true, error: null});
      location.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          this.setState({lat: latitude, lng: longitude}, () => {
            this.getLoc(latitude, longitude);
          });
        },
        error => {
          console.error('Error getting location:', error);
          this.setState({
            lat: 'err-latitude',
            lng: 'err-longitude',
            error: 'Could not retrieve location.',
            isLoading: false,
          });
        },
        {timeout: 10000},
      );
    } else {
      this.setState({error: 'Geolocation is not supported by your browser.', isLoading: false});
    }
  };

  getLoc = async (l1, l2) => {
    try {
      const locResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${l1}&lon=${l2}`,
      );
      if (!locResponse.ok) {
        throw new Error(`Error fetching location: ${locResponse.status}`);
      }
      const locData = await locResponse.json();
      this.getBlogItemData(locData?.display_name);
    } catch (error) {
      console.error('Error fetching location name:', error);
      this.setState({error: 'Failed to retrieve location name.', isLoading: false});
    }
  };

  empty = () => {
    this.setState({searchInput: ''});
  };

  render() {
    const {
      temp,
      searchInput,
      location,
      mainImg,
      condition,
      forecast,
      windSpeed,
      windDirection,
      humidit,
      sset,
      srise,
      hour,
      lat,
      lng,
      isLoading,
      error,
    } = this.state;

    return (
      <div className="bg1">
        <h1>Weather Dashboard</h1>
        <div className="search-input-container">
          <input
            type="search"
            placeholder="Search"
            className="search-input"
            value={searchInput}
            onChange={this.onChangeSearchInput}
            onKeyDown={this.enter}
            onClick={this.empty}
          />
          <img
            src="https://assets.ccbp.in/frontend/react-js/app-store/app-store-search-img.png"
            alt="search icon"
            className="search-icon"
            onClick={this.getAnyData}
          />
        </div>
        <button className="home" type="button" onClick={this.getMyLocation}>
          home
        </button>
        {error && <p className="error-message">{error}</p>}
        <div className="upper">
          {isLoading ? (
            <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
          ) : (
            <>
              <h1 className="h1">{location}</h1>
              <p className="p p1">
                Temparature: {temp} <sup className="p p1">o</sup>
              </p>
              <p className="p p2">{condition}</p>
              <p className="p p3">humidity: {humidit}</p>
              <p className="p p5">wind speed: {windSpeed}</p>
              <p className="p p5">wind direction: {windDirection}</p>
              <p className="p p4">wind speed: {windSpeed}</p>
              <p className="p p3">wind direction: {windDirection}</p>
              <p className="p p2">Sunrise: {srise}</p>
              <p className="p p1">latitude: {lat}</p>
              <p className="p p2">longitude: {lng}</p>
              <p className="p p1">Sunset: {sset}</p>
              <img src={mainImg} className="img" alt="img" />
            </>
          )}
        </div>
        <h1>Daily Forecast</h1>
        <ul className="bg2">
          {forecast.map(day => (
            <DailyItem key={day?.datetime} forecastDetails={day} isLoading={isLoading} />
          ))}
        </ul>
        <h1>Hourly Forecast</h1>
        <div className="bg3">
          <HourlyCoverage hourDetails={hour} />
        </div>
        <div className="bg4">
          {hour.map(day => (
            <HourItem key={day?.datetime} hourDetails={day} isLoading={isLoading} />
          ))}
        </div>
      </div>
    );
  }
}

export default WeatherDashboard;