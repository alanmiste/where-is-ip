import './App.css';
import { useState, useEffect } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import { Icon } from 'leaflet'
import { css } from "@emotion/react";
import SyncLoader from "react-spinners/SyncLoader";

const override = css`
  display: block;
  margin: 2;
  border-color: #61dafb;
`;

function App() {
  //creating IP state
  const [ip, setIP] = useState('');

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get('https://api.ipify.org/')
    console.log(res.data);
    setIP(res.data)
  }

  useEffect(() => {
    //passing getData method to the lifecycle method
    getData()

  }, [])

  const [location, setLocation] = useState();
  const getLoc = async () => {
    const loc = await axios.get('https://geo.ipify.org/api/v2/country,city?apiKey=at_3v49w0Le5WYW22vFmCEtQJHg9WWp7&ipAddress=' + ip)
    console.log(loc.data.location.country)
    // setLocation([loc.data.location.lat, loc.data.location.lng])
    setLocation(loc.data)
    console.log(location)
  }
  const flag = `https://flagcdn.com/w160/${location?.location.country.toLowerCase()}.png`
  const city = location?.location.city;
  let date = new Date();
  useEffect(() => {
    //passing getData method to the lifecycle method
    getLoc()

  }, [])

  function WaitForIT() {
    while (!location) {
      return (
        <div className="sweet-loading">
          <h4>Map is Loading</h4>
          <SyncLoader loading={true} css={override} size={20} />
        </div>
      )
    }

    return (
      <MapContainer center={[location.location.lat, location.location.lng]} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[location.location.lat, location.location.lng]} icon={new Icon({ iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41] })}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>
    )
  }
  return (
    <div className="App">
      <div className='userData'>
        <img
          src={flag}
          width="160"
          height="120"
          alt="South Africa"></img>
        <h2>Your IP Address is</h2>
        <h4>{ip}</h4>
        <p>You are currently located in {city}</p>
        <p>your local time is: {date.toLocaleTimeString()}</p> 
      </div>
      <div className='map'>
        {WaitForIT()}
      </div>
    </div>
  );
}

export default App;