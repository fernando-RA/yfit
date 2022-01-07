import React, { Component } from "react";
import MapContainer from "./components/MapContainer";

const Map = (props) => {
    const { classData } = props;
    return (
        <div className="map">
            <div className="title">location</div>
            {/* <img src={map} alt="" /> */}
            <MapContainer
                locationCoord={classData.location}
                containerElement={<div style={{ height: `200px` }} />}
                mapElement={<div style={{ height: `200px` }} />}
            />
            <h6 className="text title">{classData.location.location_name}</h6>
            {classData.location_notes ? (
                <p className="descr">{classData.location_notes}</p>
            ) : null}
        </div>
    );
};

export default Map;
