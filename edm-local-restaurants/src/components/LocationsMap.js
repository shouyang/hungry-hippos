import React from 'react';
import L from 'leaflet'

import { Map, Marker, Popup, TileLayer } from 'react-leaflet'


class LocationsMap extends React.Component {
  // Leaflet map used to display locations. Uses a combination of 'leaflet' and 'react-leaflet' to render. 

  render() {
    const userPosition = [this.props.lat, this.props.lng];
    const locationsWithMapData = this.props.locations.filter( (location) => {return location.hasLocationData()})

    return (
      <Map center={userPosition} zoom={this.props.zoom}>
        <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url='https://{s}.tile.osm.org/{z}/{x}/{y}.png'/>
        <Marker position={userPosition}>
          <Popup> A pretty CSS3 popup. <br/> Easily customizable.</Popup>
        </Marker>

        {locationsWithMapData.map(this.renderLocationMarker)}
      </Map>
    );
  }

  static greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  renderLocationMarker(location) {
    // Helper function to render location map markers.
    return (
      <Marker position={[location.lat, location.long]} icon={LocationsMap.greenIcon}>
        <Popup>{location.name}</Popup>
      </Marker>
    )
  }

}

export default LocationsMap;