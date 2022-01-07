import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import Link from "next/link";

import { useSelector } from "react-redux";

// todo: move (create) config to file with configurations
//  todo: don't remember a reason why I've created a comp with class, but I don't see a reason for the class component
const MapContainer = (props) => {
    const classData = useSelector((RXState) => RXState.classData);
    const mapStyles = {
        width: "100%",
        height: "100%",
        borderRadius: "20px",
        postion: "relative",
    };

    return (
        <>
            <div className="g-maps-header">
                <Link
                    className="back"
                    href={`${classData.classLink}`}
                >{`< Back`}</Link>
                <a href="" className="directions">{`Directions`}</a>
            </div>
            <div className="map-container">
                <Map
                    initialCenter={{
                        lat: classData.classData.location.lat,
                        lng: classData.classData.location.lng,
                    }}
                    //  defaultZoom={this.props.zoom}
                    centerAroundCurrentLocation={false}
                    google={props.google}
                    style={{ ...mapStyles }}
                    zoom={18}
                    streetViewControl={false}
                    zoomControl={false}
                    scaleControl={false}
                    rotateControl={false}
                    panControl={false}
                    mapTypeControl={false}
                    fullscreenControl={false}
                    styles={props.mapConf}
                    option={{ styles: null }}
                    bounds={props.google.maps.LatLngBounds()}
                >
                    <Marker
                        icon={"/static/img/location.png"}
                        position={{
                            lat: classData.classData.location.lat,
                            lng: classData.classData.location.lng,
                        }}
                    />
                </Map>
            </div>
        </>
    );
};

export default GoogleApiWrapper({
    apiKey: "AIzaSyAaDIPRPv6X2RxLN1Kwu0wY0bG05CRAm2I",
})(MapContainer);
