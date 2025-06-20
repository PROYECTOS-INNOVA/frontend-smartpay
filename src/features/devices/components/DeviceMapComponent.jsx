// src/components/DeviceMapComponent.jsx
import React, { useEffect, useState } from 'react';
// ELIMINAR BaseLayer de aquí
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet'; // <--- CAMBIADO
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Importa tu icono personalizado de teléfono móvil
import phoneIcon from '../../../assets/icons/phone-icon.png'; // <--- ASUNCIÓN: Ajusta esta ruta a tu archivo de icono real

// Componente auxiliar para cambiar la vista del mapa cuando las props 'center' cambian
const SetViewOnChange = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && typeof center[1] === 'number') {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

// Función para crear un icono div personalizado con solo la imagen
const createCustomDeviceIcon = (iconUrl, size = 32) => {
    const iconHtml = `<img src="${iconUrl}" style="width: ${size}px; height: ${size}px;">`;

    return L.divIcon({
        html: iconHtml,
        className: 'custom-device-marker',
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
};


const DeviceMapComponent = ({ latitude, longitude, deviceSerial }) => {
    const [isClient, setIsClient] = useState(false);

    const defaultLatitude = 3.824792; // Latitud de Pitalito, Huila, Colombia
    const defaultLongitude = -76.018335; // Longitud de Pitalito, Huila, Colombia

    const currentLatitude = Number(latitude);
    const currentLongitude = Number(longitude);

    const position = [
        isNaN(currentLatitude) ? defaultLatitude : currentLatitude,
        isNaN(currentLongitude) ? defaultLongitude : currentLongitude
    ];

    const deviceIcon = createCustomDeviceIcon(phoneIcon, 32);

    useEffect(() => setIsClient(true), []);

    if (!isClient) {
        return <div className="text-center py-8 text-gray-500">Cargando mapa...</div>;
    }

    return (
        <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                className="h-full w-full"
            >
                <LayersControl position="topright" collapsed={false}>
                    <TileLayer
                        checked // Mantener 'checked' para el mapa predeterminado
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        name="Calles (OpenStreetMap)" // El 'name' ahora va en el TileLayer
                    />

                    <Marker position={position} icon={deviceIcon}>
                        <Popup>
                            Ubicación de **{deviceSerial || 'Dispositivo'}**
                            <br /> Lat: {position[0]}, Lon: {position[1]}
                            {(isNaN(currentLatitude) || isNaN(currentLongitude)) &&
                                <span className="text-red-500 block text-xs mt-1">
                                    (Ubicación por defecto: datos reales no disponibles)
                                </span>
                            }
                        </Popup>
                    </Marker>

                </LayersControl>

                <SetViewOnChange center={position} />
            </MapContainer>
        </div>
    );
};

export default DeviceMapComponent;