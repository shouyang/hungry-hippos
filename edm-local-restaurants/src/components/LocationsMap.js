import React from 'react';
import L from 'leaflet'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'

var greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

class LocationsMap extends React.Component {
    renderLocationMarker(location) {
      return (
        <Marker position={ [location.lat, location.long]} icon={greenIcon}>
          <Popup>{location.name}</Popup>
        </Marker>
      )
    }
  
    render() {
      const position = [this.props.lat, this.props.lng];
      const locationsWithLongLat = this.props.locations.filter( (location) => {return location.hasLocationData()})
  
      return (
        <Map center={position} zoom={this.props.zoom}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'
          />
          <Marker position={position}>
            <Popup>
              A pretty CSS3 popup. <br/> Easily customizable.
            </Popup>
          </Marker>
  
          {locationsWithLongLat.map(this.renderLocationMarker)}
        </Map>
      );
    }
  }

export default LocationsMap;