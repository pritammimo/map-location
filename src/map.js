import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker,Polyline } from 'google-maps-react';

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
      cordLatitude:22.6519,
      cordLongitude:88.3786,
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



  render() {
    return (
      <div>
         
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
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyD_Y1rqX4OYQl9CxhkcX_Bhy0hAs2dysgg')
})(Demo1);
