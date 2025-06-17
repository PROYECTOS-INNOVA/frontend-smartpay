import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css?inline';
import 'leaflet/dist/leaflet.css';

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
});

const SetViewOnChange = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center?.length === 2) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const DeviceMapComponent = ({ latitude, longitude, deviceSerial }) => {
    const [isClient, setIsClient] = useState(false);
    const position = [
        Number(latitude) || 3.824792,
        Number(longitude) || -76.018335
    ];

    useEffect(() => setIsClient(true), []);

    if (!isClient) return null; // Evita renderizar en SSR
    if (!latitude || !longitude) {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
                <p className="font-bold">Ubicación No Disponible</p>
                <p>El dispositivo no ha reportado una ubicación reciente.</p>
            </div>
        );
    }

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
            {/* <MapContainer center={position} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>
                            Ubicación de **{deviceSerial}**
                            <br /> Lat: {latitude}, Lon: {longitude}
                        </Popup>
                    </Marker>
                    <SetViewOnChange center={position} />
                </>
            </MapContainer> */}
        </div>
    );
};

export default DeviceMapComponent;