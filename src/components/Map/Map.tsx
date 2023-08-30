import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from "react-redux";
import 'react-virtualized/styles.css';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from "react-leaflet";
import { LatLng, LatLngExpression } from "leaflet";
import List, {ListProps, ListRowProps, RenderedRows} from 'react-virtualized/dist/commonjs/List';
import './Map.css';
import {IEmpireMessage, IEmpireTarget, RootState} from "../../types/EmpireMessage";
import { ListTargetItem } from "./ListTargetItem";
import { calculateDistanceBetweenTwoPoints } from "../../utils/Functions";

interface IMap {
    empireTargets: IEmpireTarget[];
    onTargetRowRendered(targetA: IEmpireMessage, targetB: IEmpireMessage): void;
}

interface IMapContent {
    onUserPositionSet(userPosition: LatLngExpression): void;
}

export const Map = ({
    empireTargets,
    onTargetRowRendered
}: IMap) => {
    const [userPosition, setUserPosition] = useState<LatLng>();
    const [sortedDistances, setSortedDistances] = useState<IEmpireMessage[]>([]);
    const mapParentRef = useRef<any>(null);
    const listRef = useRef<any>(null);
    const decryptedMessageState = useSelector((state: RootState) => state.empireMessageSlice);
    const rowHeight = 242;

    useEffect(() => {
        if(userPosition){
            const distances:[IEmpireMessage, number][] = empireTargets.map(coord => {
                return [coord, calculateDistanceBetweenTwoPoints(userPosition, new LatLng(coord.lat ?? 0,coord.long ?? 0) )]
            });
            const sortedCoordinates = distances.sort((a, b) => a[1] - b[1]).map(item => item[0]);
            setSortedDistances(sortedCoordinates)
        }

        if(listRef.current){
            listRef.current.forceUpdate();
        }
    }, [userPosition]);

    const handleUserPositionSet = (userPosition: LatLng) => {
        setUserPosition(userPosition);
    };

    const handleRenderRow = ({ startIndex }: RenderedRows) => {
        onTargetRowRendered(sortedDistances[startIndex * 2], sortedDistances[startIndex * 2 + 1]);
    };

    const renderRow = ({ key, index, style }: ListRowProps) => {
        const targetA = decryptedMessageState.find((decryptedMessage) => decryptedMessage.id === sortedDistances[index * 2].id)
        const targetB = decryptedMessageState.find((decryptedMessage) => decryptedMessage.id === sortedDistances[index * 2 + 1].id)

        return (
            <ListTargetItem
                style={style}
                key={key}
                empireTargetA={targetA}
                empireTargetB={targetB}
            />
        )
    }

    return (
        <div ref={mapParentRef} style={{ width: '100vh' }}>
            <div className="empire-member-positions">
                {userPosition && sortedDistances.length > 0 &&
                    <List
                        ref={listRef}
                        height={rowHeight}
                        sortBy={null}
                        rowCount={empireTargets.length / 2}
                        rowHeight={rowHeight}
                        rowRenderer={renderRow}
                        onRowsRendered={handleRenderRow}
                        width={mapParentRef?.current?.clientWidth}
                        autoWidth
                    />
                }
            </div>

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

                <MapContent onUserPositionSet={handleUserPositionSet} />
            </MapContainer>
        </div>
    )
};

const MapContent = ({
    onUserPositionSet
}: IMapContent) => {
    const [userMarker, setUserMarker] = useState<LatLngExpression>();
    const userMarkerRef = useRef<any>(null);

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
                <Marker position={userMarker} ref={userMarkerRef}>
                    <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                </Marker>
            }
        </>
    );
}