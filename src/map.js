import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker,Polyline } from 'google-maps-react';
import Autocomplete from "react-google-autocomplete";
const mapStyles = {
  width: '100%',
  height: '100%'
};

class Demo1 extends Component {
  constructor() {
    super();
    this.state = {
      name: "React",
      latitude:null,
      longitude:null,
      error: null,
      concat: null,
      coords:[],
      x: 'false',
      cordLatitude:null,
      cordLongitude:null,
    };  
    this.mergeLot = this.mergeLot.bind(this);
  }
  componentDidMount() {
    navigator.geolocation.watchPosition(
        position => {
            this.setState({
                latitude:position.coords.latitude,
                longitude:position.coords.longitude,
                error:null,
            });
         this.mergeLot();
        },
        (error) => this.setState({ error: error.message }),
        { enableHighAccuracy: false, timeout: 200000, maximumAge: 1000 },  
      );
 
  }
  mergeLot(){
    if (this.state.latitude != null && this.state.longitude!=null)
     {
       let concatLot = this.state.latitude +","+this.state.longitude
       this.setState({
         concat: concatLot
       }, () => {
        this.getDirections(concatLot, "-6.270565,106.759550");
       });
     }

   }
   async getDirections(startLoc, destinationLoc) {

    try {
        let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
        let respJson = await resp.json();
        let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
        let coords = points.map((point, index) => {
            return  {
                latitude : point[0],
                longitude : point[1]
            }
        })
        this.setState({coords: coords})
        this.setState({x: "true"})
        return coords
    } catch(error) {
      console.log('masuk fungsi')
        this.setState({x: "error"})
        return error
    }
}
onPlaceSelected = (place) => {
  console.log('plc', place);
  console.log('latvalue', place.geometry.location.lat())
  console.log('lngValue', place.geometry.location.lng())
  this.setState({
    cordLatitude:place.geometry.location.lat(),
    cordLongitude:place.geometry.location.lng()
  })
}


  render() {
    return (
      <div>
       <h1>React map location tracking</h1>  
       <Autocomplete
              style={{
                                width: '100%',
                                height: '40px',
                                paddingLeft: '16px',
                                marginTop: '2px',
                                marginBottom: '2rem'
                  }}
                            apiKey={'AIzaSyDDyNPwlw8xWftanmnKCenndPU0Pfu25yc'}
                            // onPlaceSelected={(place) => {
                            //   console.log(place);
                            // }}
                          onPlaceSelected={this.onPlaceSelected}
                            types={['(regions)']}
                        />
        <Map
          google={this.props.google}
          zoom={18}
          style={mapStyles}
          center={{
            lat: this.state.latitude,
            lng: this.state.longitude
          }}
        >
           
       {!!this.state.cordLatitude && !!this.state.cordLongitude && <Marker
          position={{lat:this.state.cordLatitude,lng:this.state.cordLongitude}}
          title={"Your Destination"}
        />}
         <Marker name={"This is test name"} 
         position={{ lat: this.state.latitude, lng: this.state.longitude }}/>
         
          {!!this.state.latitude && !!this.state.longitude && this.state.x == 'error' && <Polyline
          path={[
              {lat: this.state.latitude, lng: this.state.longitude},
              {lat: this.state.cordLatitude, lng: this.state.cordLongitude},
          ]}
          strokeWidth={2}
          strokeColor="red"/>
         }
                      
        </Map>
        {/* <Autocomplete
  apiKey={'AIzaSyD_Y1rqX4OYQl9CxhkcX_Bhy0hAs2dysgg'}
  onPlaceSelected={(place) => {
    console.log(place);
  }}
/> */}

      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyDDyNPwlw8xWftanmnKCenndPU0Pfu25yc')
})(Demo1);
