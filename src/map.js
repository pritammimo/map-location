import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker  } from 'google-maps-react';

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
    };  
  }
 
  componentDidMount() {
   if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        position => {
   
            this.setState({
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            })
         

        }
        
    
      );
   }
  }
  render() {
    return (
      <div>
         
        <Map
          google={this.props.google}
          zoom={25}
          style={mapStyles}
          center={{
            lat: this.state.latitude,
            lng: this.state.longitude
          }}
        >
         <Marker name={"This is test name"} 
         position={{ lat: this.state.latitude, lng: this.state.longitude }}/>
        </Map>
      </div>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: ('AIzaSyD_Y1rqX4OYQl9CxhkcX_Bhy0hAs2dysgg')
})(Demo1);
