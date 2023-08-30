import React, { useEffect, useRef, useState } from 'react';
import classNames from "classnames";
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import L, { LatLng, LatLngExpression } from "leaflet";
import './Map.css';
import { IEmpireTarget } from "../../types/EmpireMessage";
import { ListTargetItem } from "./ListTargetItem";
import { calculateDistanceBetweenTwoPoints } from "../../utils/Functions";
import { strings } from "../../assets/Strings";

interface IMap {
    empireTargets: IEmpireTarget[];
}

interface IMapContent extends IMap{
    onUserPositionSet(userPosition: LatLngExpression): void;
}

export const Map = ({
    empireTargets,
}: IMap) => {
    const [userPosition, setUserPosition] = useState<LatLng>();
    const [sortedDistances, setSortedDistances] = useState<IEmpireTarget[]>([]);

    useEffect(() => {
        if(userPosition){
            const distances:[IEmpireTarget, number][] = empireTargets.map(coord => {
                return [coord, calculateDistanceBetweenTwoPoints(userPosition, new LatLng(coord.lat ?? 0,coord.long ?? 0) )]
            });
            const sortedTargets = distances.sort((a, b) => a[1] - b[1]).map(item => item[0]);
            setSortedDistances(sortedTargets)
        }
    }, [userPosition]);

    const handleUserPositionSet = (userPosition: LatLng) => {
        setUserPosition(userPosition);
    };

    return (
        <div style={{ width: '100%' }}>
            <p className={classNames('lbl-marker-instructions', userPosition && 'hide')}>
                { strings.lblMarkerInstructions }
            </p>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                scrollWheelZoom
                style={{height: '50vh', width: '100%'}}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapContent
                    empireTargets={empireTargets}
                    onUserPositionSet={handleUserPositionSet}
                />
            </MapContainer>
            <div className={classNames('empire-member-positions', userPosition && 'open')}>
                {userPosition &&
                    sortedDistances.map((sortedDistance) =>
                        <ListTargetItem
                            distance={calculateDistanceBetweenTwoPoints(userPosition, new LatLng(sortedDistance.lat ?? 0,sortedDistance.long ?? 0) )}
                            key={sortedDistance.id}
                            empireTarget={sortedDistance}
                        />
                    )
                }
            </div>
        </div>
    )
};

const MapContent = ({
    onUserPositionSet,
    empireTargets
}: IMapContent) => {
    const [userMarker, setUserMarker] = useState<LatLngExpression>();
    const userMarkerRef = useRef<any>(null);
    const DEFAULT_ICON = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';

    useMapEvents({
        click: (e) => {
            setUserMarker(e.latlng);
        }
    });

    useEffect(() => {
        if (userMarker) {
            onUserPositionSet(userMarkerRef.current.getLatLng());
        }
    }, [userMarker])

    return (
        <>
            {userMarker &&
                <Marker position={userMarker} ref={userMarkerRef} />
            }
            {
                empireTargets.map((target) =>
                    <Marker
                        key={`marker_${target.id}.`}
                        position={new LatLng(target.lat, target.long)}
                        icon={new L.Icon({
                            iconUrl: target.image ?? DEFAULT_ICON,
                            iconSize: [30, 30],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41],

                        })}
                    >
                        <Popup className="popup-target">
                            <b>{target.name}</b>
                        </Popup>
                    </Marker>
                )
            }
        </>
    );
}