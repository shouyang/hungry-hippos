class Location {
    // Data class representing one row from the Google Sheets Document.
    constructor(entry) {
      // Unpacks interesting entries from the Google Sheets JSON API into a simpler object.
      this.id = entry.id.$t;
  
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
      return !!(!!this.lat && !!this.long);
    }

    // TODO: Probably add some functionality to unpack attributes (addresses, hours, cusine types etc...)
    // TODO: Maybe add resolvers to Google Maps, Food Delivery etc...
  }
  
export default Location; 