import React, { Component } from "react";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import { withRouter } from "next/router";

//  todo: don't remember a reason why I've created a comp with class, but I don't see a reason for the class component

export class MapContainer extends Component {
    constructor(props) {
        super(props);
    }

    static defaultProps = {
        zoom: 11,
        mapConf: [
            {
                featureType: "all",
                elementType: "labels.text.fill",
                stylers: [
                    {
                        saturation: 36,
                    },
                    {
                        color: "#333333",
                    },
                    {
                        lightness: 40,
                    },
                ],
            },
            {
                featureType: "all",
                elementType: "labels.text.stroke",
                stylers: [
                    {
                        visibility: "on",
                    },
                    {
                        color: "#ffffff",
                    },
                    {
                        lightness: 16,
                    },
                ],
            },
            {
                featureType: "all",
                elementType: "labels.icon",
                stylers: [
                    {
                        visibility: "off",
                    },
                ],
            },
            {
                featureType: "administrative",
                elementType: "geometry.fill",
                stylers: [
                    {
                        color: "#fefefe",
                    },
                    {
                        lightness: 20,
                    },
                ],
            },
            {
                featureType: "administrative",
                elementType: "geometry.stroke",
                stylers: [
                    {
                        color: "#fefefe",
                    },
                    {
                        lightness: 17,
                    },
                    {
                        weight: 1.2,
                    },
                ],
            },
            {
                featureType: "landscape",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#edebe4",
                    },
                    {
                        lightness: 20,
                    },
                ],
            },
            {
                featureType: "poi",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#f5f5f5",
                    },
                    {
                        lightness: 21,
                    },
                ],
            },
            {
                featureType: "poi.park",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#dedede",
                    },
                    {
                        lightness: 21,
                    },
                ],
            },
            {
                featureType: "poi.park",
                elementType: "geometry.fill",
                stylers: [
                    {
                        color: "#d1ecc7",
                    },
                ],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.fill",
                stylers: [
                    {
                        color: "#ffffff",
                    },
                    {
                        lightness: 17,
                    },
                ],
            },
            {
                featureType: "road.highway",
                elementType: "geometry.stroke",
                stylers: [
                    {
                        color: "#ffffff",
                    },
                    {
                        lightness: 29,
                    },
                    {
                        weight: 0.2,
                    },
                ],
            },
            {
                featureType: "road.arterial",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#ffffff",
                    },
                    {
                        lightness: 18,
                    },
                ],
            },
            {
                featureType: "road.local",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#ffffff",
                    },
                    {
                        lightness: 16,
                    },
                ],
            },
            {
                featureType: "transit",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#f2f2f2",
                    },
                    {
                        lightness: 19,
                    },
                ],
            },
            {
                featureType: "water",
                elementType: "geometry",
                stylers: [
                    {
                        color: "#bddddd",
                    },
                    {
                        lightness: 17,
                    },
                ],
            },
        ],
    };

    render() {
        const mapStyles = {
            width: "100%",
            height: "200px",
            borderRadius: "20px",
            postion: "relative",
        };
        return (
            <div
                className="map-container"
                onClick={() => this.props.router.push("/map")}
            >
                <Map
                    initialCenter={{
                        lat: this.props.locationCoord.lat,
                        lng: this.props.locationCoord.lng,
                    }}
                    //  defaultZoom={this.props.zoom}
                    centerAroundCurrentLocation={false}
                    google={this.props.google}
                    style={{ ...mapStyles }}
                    zoom={18}
                    streetViewControl={false}
                    zoomControl={false}
                    scaleControl={false}
                    rotateControl={false}
                    panControl={false}
                    mapTypeControl={false}
                    fullscreenControl={false}
                    styles={this.props.mapConf}
                    option={{ styles: null }}
                    bounds={this.props.google.maps.LatLngBounds()}
                >
                    <Marker
                        icon={"/static/img/location.png"}
                        position={{
                            lat: this.props.locationCoord.lat,
                            lng: this.props.locationCoord.lng,
                        }}
                    />
                </Map>
            </div>
        );
    }
}

export default withRouter(
    GoogleApiWrapper({
        apiKey: "AIzaSyAaDIPRPv6X2RxLN1Kwu0wY0bG05CRAm2I",
    })(MapContainer),
);
