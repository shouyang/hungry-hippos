function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}

class Location {
    // Data class representing one row from the Google Sheets Document.
    constructor(entry) {
      // Unpacks interesting entries from the Google Sheets JSON API into a simpler object.
      this.id = entry.id.$t;
      this.shouldBeShown = true;
  
      this.name                = entry["gsx$name"].$t;
      this.status              = entry["gsx$status"].$t;
      this.cusine              = entry["gsx$cusine"].$t;
      this.area                = entry["gsx$area"].$t;
      this.hours               = entry["gsx$hours-unsureofcovid-19hours"].$t;
      this.delivery            = entry["gsx$delivery"].$t;
      this.pickup              = entry["gsx$pickup"].$t;
      this.giftcards           = entry["gsx$giftcards"].$t;
      this.dietaryNeeds        = entry["gsx$dietaryneedsserved"].$t;
      this.address             = entry["gsx$address"].$t;
      this.comments            = entry["gsx$comments"].$t;
  
      this.lat                 = entry["gsx$lat"].$t;
      this.long                = entry["gsx$long"].$t;
    }
  

    hasLocationData() {
      return (!!this.lat && !!this.long);
    }

    distanceToLocationMeters(lat, long) { 
      return distanceInKmBetweenEarthCoordinates(lat,long, this.lat, this.long) * 1000;
    }

    // TODO: Probably add some functionality to unpack attributes (addresses, hours, cusine types etc...)
    // TODO: Maybe add resolvers to Google Maps, Food Delivery etc...
  }
  
export default Location; 