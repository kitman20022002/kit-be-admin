/* eslint-disable no-secrets/no-secrets */
import axios from 'axios';

let countryData:any = {};
let stateAndCountryCodeData:any = {};
function isNumber(value: any): value is number {
  return typeof value === 'number' && !isNaN(value);
}


const getCountryByGeoNameAPI = async () => {
  const result = await axios.get(
    'http://api.geonames.org/countryInfoJSON?username=kitman200220022002',
  );
  const keyedByCountry = result.data.geonames.reduce((acc:any, location:any) => {
    acc[location.countryName] = location;
    return acc;
  }, {} as Record<string, Location[]>);

  return keyedByCountry;
};

const getStateByGeoNameAPI = async (countryCode : number) => {
  const result = await axios.get(
    `http://api.geonames.org/childrenJSON?geonameId=${countryCode}&username=kitman200220022002`,
  );    
  const keyedByStateAndCountry = result.data.geonames.reduce((acc:any, location:any) => {
    const stateCodeAndCountryCode = location.adminName1 + '-' + countryCode;
    acc[stateCodeAndCountryCode] = location;
    return acc;
  }, {} as Record<string, Location[]>);
  return keyedByStateAndCountry;
};

//////////////////////////////////////////////////////////////////////////////////////////////
// CORE LOGIC: Have to make sure this does not break and consist across the application
//////////////////////////////////////////////////////////////////////////////////////////////
export const getCountryCodeBy = async (country: string | number) => {
  const assumeThisIsACorrectCountryCode = isNumber(country);
  const hasCacheData = countryData.length > 0;
  if (assumeThisIsACorrectCountryCode) {
    return country;
  }

  if (hasCacheData) {
    return countryData[country].geonameId;
  }

  //Added DB just in case the API cannot connect 
  const result = await getCountryByGeoNameAPI();
  countryData = result;
  return countryData[country].geonameId;
  //If all method does not work we can store a json 
};

//////////////////////////////////////////////////////////////////////////////////////////////
// CORE LOGIC: Have to make sure this does not break and consist across the application
//////////////////////////////////////////////////////////////////////////////////////////////
export const getStateCodeBy = async (state:number | string, country: number | string) => {
  const assumeThisIsACorrectStateCode = isNumber(state);
  const countryCode = await getCountryCodeBy(country);
  if (!countryCode) {
    throw new Error('Errrrrr u did not give me the countryCode:' + countryCode);
  }
  if (assumeThisIsACorrectStateCode) {
    return state;
  }
  const stateAndCountryCode = state + '-' + countryCode;
  if (stateAndCountryCodeData[stateAndCountryCode]) {
    return stateAndCountryCodeData[stateAndCountryCode].geonameId;
  }
  
  //Added DB just in case the API cannot connect
  const result = await getStateByGeoNameAPI(countryCode);
  stateAndCountryCodeData = { ...stateAndCountryCodeData, ...result };
  return stateAndCountryCodeData[stateAndCountryCode].geonameId;
  //If all method does not work we can store a json 
};

