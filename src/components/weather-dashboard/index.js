import {Component} from 'react';

import {BarChart, Bar, XAxis, YAxis,LabelList} from 'recharts';

import {ThreeDots} from 'react-loader-spinner'

import './index.css';

const HourlyCoverage = props => {

  const {hourDetails} = props

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
           <LabelList dataKey="temp" position="outside" style= { { fill: "white" }} />

           </Bar>
      </BarChart>
    </div>
  )
}

const DailyItem = props => {
  const {forecastDetails,isLoading} = props

  const {icon, datetime, feelslikemin, feelslikemax, sunrise, sunset} =
    forecastDetails

  const minTemp = Math.round((feelslikemin - 32) * 0.55, 2)
  const temp = Math.round((feelslikemax - 32) * 0.55, 2)

  const date = new Date(datetime)
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const month = monthNames[date.getMonth()]

  const da = date.getDate()

  const k1 = 'https://assets.ccbp.in/frontend/intermediate-rwd/sunny-img.png'
  const k2 =
    'https://assets.ccbp.in/frontend/intermediate-rwd/partly-cloudy-img.png'
  const k3 =
    'https://assets.ccbp.in/frontend/intermediate-rwd/rain-with-sun-img.png'

  let image = ''

  if (icon === 'clear-day') {
    image = k1
  } else if (icon === 'partly-cloudy-day') {
    image = k2
  } else {
    image = k3
  }

  return (
    <>
      <li className="mini1">
        {isLoading?(<ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />):(<>
        <p className="ph ml-3">
          {da} {month}
        </p>
        <p className="sun">Sunrise: {sunrise}</p>
        <p className="sun">Sunset: {sunset}</p>
        <img src={image} className="icon" alt="img" />
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
        <h1 className="pi">{icon}</h1></>)}
      </li>
    </>
  )
}

const HourItem = props => {
  const {hourDetails,isLoading} = props
  const {humidity, temp, datetime} = hourDetails

  return (
    <>
      <div className="hour">
        {isLoading?(<ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />):(
        <>
        <p className="sun1">hour: {datetime}</p>
        <p className="sun1">
          temp: {temp}
          <sup className="sun1">o</sup>
        </p>
        <p className="sun1">humidity: {humidity}</p></>)}
      </div>
    </>
  )
}

class WeatherDashboard extends Component {
  state = {
    name:'',
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
    lat:'',
    lng:'',
    isLoading: false,
  }

  componentDidMount() {
    this.getMyLocation()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getBlogItemData = async (o) => {

    this.setState({
      isLoading: true,
    })

    this.setState({searchInput: ''})

    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${o}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    )
    const r = await re.json()

    this.setState({forecast: r.days.slice(1, 8)})
    const {sunrise, sunset, hours} = r.days[0]

    
      const hourDetail=hours.map(
        eachHourData => ({
          temp:Math.round((eachHourData.temp - 32) * 0.55, 2),
          datetime:eachHourData.datetime,
          humidity:eachHourData.humidity,
        }),
      )

    this.setState({hour: hourDetail})
    this.setState({srise: sunrise})
    this.setState({sset: sunset})

   
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${o}&aqi=yes`,
    )

    const data = await response.json()

    this.setState({searchedData: data})

    this.updateData()
  }

  getAnyData = async () => {
    this.setState({
      isLoading: true,
    })
    const {searchInput} = this.state

    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=2cab70eda4434e46b0165459240402&q=${searchInput}&aqi=yes`,
    )

    const re = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchInput}?unitGroup=us&key=3BHQ74CEVSVY3MJMWHJJG7HFM&contentType=json`,
    )
    if (response.ok === true && re.ok === true) {
      const r = await re.json()
      this.setState({forecast: r.days.slice(1, 8)})
      const {hours} = r.days[0]

      const hoursDetail=hours.map(
        eachHourData => ({
          temp:Math.round((eachHourData.temp - 32) * 0.55, 2),
          datetime:eachHourData.datetime,
          humidity:eachHourData.humidity,
        }),
      )

      this.setState({hour: hoursDetail})
      const data = await response.json()
      this.setState({searchedData: data})

      this.updateData()
    } else {
      this.fake()
    }
  }

  fake = () => {
    alert('wrong input')
    this.setState({searchInput: ''})
    this.setState({
      isLoading: false,
    })

  }

  updateData = () => {
    const { searchedData } = this.state;
  
    if (searchedData.current && searchedData.location) {
      const currentTemp = searchedData.current.temp_c;
      const loc = searchedData.location.name;
      const cond = searchedData.current.condition.text;
      const img1 = searchedData.current.condition.icon;
      const humidit = searchedData.current.humidity;
      const windDirection = searchedData.current.wind_dir;
      const windSpeed = searchedData.current.wind_kph;
  
      this.setState({
        temp: currentTemp,
        location: loc,
        condition: cond,
        mainImg: img1,
        humidit,
        windDirection,
        windSpeed,
        isLoading: false,
      });
    } else {
      console.error("Invalid API response structure", searchedData);
    }
  };
  

  enter = event => {
    if(event.key === 'Enter') {
      this.getAnyData()
    }
  }
  

  getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation;
    
    if (location) {
      location.getCurrentPosition((position) => {
  
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const r1=lat
        const r2=lng
        this.setState({ lat, lng });
        this.getLoc(r1,r2)
      }, (error) => {
        this.setState({ lat: 'err-latitude', lng: 'err-longitude' });
      });
    }
  };
  
   getLoc= async (l1,l2)=>{

    const loc = await fetch (`https://nominatim.openstreetmap.org/reverse?format=json&lat=${l1}&lon=${l2}`)
    console.log(loc)
    const l =  await loc.json()
    console.log(l)
    this.getBlogItemData(l.display_name)
   }
  render() {
    const {
      name,
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
    } = this.state
     
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
        <div  className="upper">
          {isLoading?(
           <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
           )
         :(<>
          <h1 className="h1">{name}{location}</h1>
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
          <img src={mainImg} className="img" alt="img" /></>
        )}
      </div>
        <h1>Daily Forecast</h1>
        <ul className="bg2">
          {forecast.map(day => (
            <DailyItem key={day.datetime} forecastDetails={day} isLoading={isLoading}/>
        
          ))}
        </ul>
        <h1>Hourly Forecast</h1>
        <div className="bg3">
        {isLoading?(<ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />):(
            <HourlyCoverage  hourDetails={hour} isLoading={isLoading}/>)}
        </div>
        <div className="bg4">
        {hour.map(day => (
            <HourItem key={day.datetime} hourDetails={day} isLoading={isLoading}/>
          ))}
        </div>
      </div>
    )
  }
}

export default WeatherDashboard