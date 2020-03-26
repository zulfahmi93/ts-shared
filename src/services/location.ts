let googleMapsIsInitialized     = !!(window as any).google;
let initialiseGoogleMapsResolve: Function;
let initialiseGoogleMapsReject: OnErrorEventHandler;
let initialiseGoogleMapsPromise = new Promise<void>((resolve, reject) => {
  initialiseGoogleMapsResolve = resolve;
  initialiseGoogleMapsReject  = reject;
});


function initialiseGoogleMaps(apiKey: string): Promise<void> {
  if (googleMapsIsInitialized) {
    return initialiseGoogleMapsPromise;
  }

  googleMapsIsInitialized   = true;
  window.googleMapsCallback = () => initialiseGoogleMapsResolve(window.google);

  const script   = document.createElement('script');
  script.async   = true;
  script.defer   = true;
  script.src     = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=${apiKey}&callback=googleMapsCallback`;
  script.onerror = initialiseGoogleMapsReject;
  document.querySelector('head')?.appendChild(script);

  return initialiseGoogleMapsPromise;
}

async function getCurrentLocation(options: PositionOptions): Promise<GetCurrentLocationResult> {
  const result: GetCurrentLocationResult = { isSuccess: false };

  if (!window.navigator.geolocation) {
    result.error = GetCurrentLocationError.BROWSER_DOES_NOT_SUPPORT_GEOLOCATION;
    return result;
  }

  if (window.navigator.permissions) {
    const status = await window.navigator.permissions.query({ name: 'geolocation' });
    if (status.state === 'denied') {
      result.error = GetCurrentLocationError.ACCESS_DENIED;
      return result;
    }
  }

  const promise = new Promise<Position>((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition((e) => resolve(e), (e) => reject(e), options);
  });

  try {
    result.data      = await promise;
    result.isSuccess = true;
  } catch (e) {
    switch (e.code) {
      case 1:
        result.error = GetCurrentLocationError.ACCESS_DENIED;
        break;
      case 2:
        result.error = GetCurrentLocationError.POSITION_UNAVAILABLE;
        break;
      case 3:
        result.error = GetCurrentLocationError.TIMED_OUT;
        break;
      default:
        throw e;
    }
  }

  return result;
}

async function reverseGeocode(lat: number, lng: number): Promise<google.maps.GeocoderResult | string> {
  return new Promise<google.maps.GeocoderResult>(((resolve, reject) => {
    if (!window.google) {
      reject('Google Maps is not initialised!');
    }

    if (!window.geocoder) {
      window.geocoder = new google.maps.Geocoder();
    }

    const geocoder = window.geocoder;
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK && results[0]) {
        resolve(results[0]);
        return;
      }

      reject('Unable to reverse geocode the given coordinate.');
    });
  }));
}

function distanceBetween(p1: Coordinate, p2: Coordinate): number {
  const ll1 = new google.maps.LatLng(p1.latitude, p1.longitude);
  const ll2 = new google.maps.LatLng(p2.latitude, p2.longitude);
  return google.maps.geometry.spherical.computeDistanceBetween(ll1, ll2);
}


enum GetCurrentLocationError {
  BROWSER_DOES_NOT_SUPPORT_GEOLOCATION,
  ACCESS_DENIED,
  POSITION_UNAVAILABLE,
  TIMED_OUT
}

interface GetCurrentLocationResult {
  isSuccess: boolean,
  data?: Position,
  error?: GetCurrentLocationError,
}

interface Coordinate {
  latitude: number,
  longitude: number;
}


const LocationService = {
  distanceBetween,
  getCurrentLocation,
  initialiseGoogleMaps,
  reverseGeocode,
};

export default LocationService;
