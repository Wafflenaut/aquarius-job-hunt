require('dotenv').config();
const axios = require('axios');

apiKey = process.env.BINGMAPS_API_KEY;

//Paramters: A city and state (abbreviation of state)
//Function: Returns an object with a validity of true if location matches
  //and a GeoJSON point object
//Output: An object with validity and a geojson object
  //.valid will access a bool true/false for the validity of request
  //.geolocation will access a Point type geoJson item
const findGeolocationCityState = async (city, state) => {

  try{
	  geocodeUrl = 'http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&adminDistrict='
	  + state
	  + '&locality=' 
	  + city 
	  + '&key=' 
	  + apiKey;
	  
	  var response = await axios.get(geocodeUrl);
	  response = response.data.resourceSets;

	  const cityCheck = response[0].resources[0].address.locality;
	  const stateCheck = response[0].resources[0].address.adminDistrict;
	   
	  if(cityCheck == city && state == stateCheck){
	    var longitude = response[0].resources[0].point.coordinates[1];
		var latitude = response[0].resources[0].point.coordinates[0];
		
		payload = {};
		payload.valid = true;
		payload.geolocation = new Object();
		payload.geolocation.type = "Point";
		payload.geolocation.coordinates = [longitude, latitude];
		
		return await payload;
	  }
	  //Else the response does not match the original query - invalid request
	  else{
		payload = {};
		payload.valid = false;
		payload.geolocation = new Object();
		payload.geolocation.type = "Point";
		payload.geolocation.coordinates = [0, 0];
	  
		return await payload;
	  }
	  
  } catch (e) {
    console.log("API Call w/ Error: " + geocodeUrl);
    throw new Error("Unable to get location by city/state");
  }
};


//Paramters: A zip code in string format
//Function: Returns an object with a validity of true if it is a valid zip code
//Output: An object with validity and a geojson object
  //.valid will access a bool true/false for the validity of request
  //.geolocation will access a Point type geoJson item
const findGeolocationZip = async (zip) => {

  try{
	  
	  geocodeUrl = 'http://dev.virtualearth.net/REST/v1/Locations?CountryRegion=US&postalCode='
	  + zip
	  + '&key=' 
	  + apiKey;
	  
	  var response = await axios.get(geocodeUrl);
	  response = response.data.resourceSets;
	  

	if(response[0].resources[0].entityType != "CountryRegion"){
		var longitude = response[0].resources[0].point.coordinates[1];
		var latitude = response[0].resources[0].point.coordinates[0];
		
		payload = {};
		payload.valid = true;
		payload.geolocation = new Object();
		payload.geolocation.type = "Point";
		payload.geolocation.coordinates = [longitude, latitude];
		
		return await payload;
	  }
	  else{
		payload = {};
		payload.valid = false;
		payload.geolocation = new Object();
		payload.geolocation.type = "Point";
		payload.geolocation.coordinates = [0, 0];
	  
		return await payload;
	  }
	  
  } catch (e) {
    console.log("API Call w/ Error: " + geocodeUrl);
    throw new Error("Unable to get location by zip");
  }
};

const getGeolocationCityStateTEST = async (city, state) => {
	var payload = await findGeolocationCityState(city, state);
	
	console.log(payload.geolocation);
	console.log(payload.valid);

}

const getGeolocationZipTEST = async (zip) => {
	var payload = await findGeolocationZip(zip);
	
	console.log(payload.geolocation);
	console.log(payload.valid);

}


module.exports = { 
  findGeolocationCityState,
  findGeolocationZip
};

