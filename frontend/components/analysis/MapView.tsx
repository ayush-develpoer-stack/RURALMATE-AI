'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import type { MapMarker } from '@/types/business';
import './MapView.css';

const COLORS: Record<MapMarker['type'], string> = {
  user: '#1f7a4d',
  market: '#2563eb',
  competitor: '#dc3545',
  supplier: '#d98a04',
};

function makeIcon(type: MapMarker['type']): L.DivIcon {
  const color = COLORS[type];
  const size = type === 'user' ? 22 : 16;
  return L.divIcon({
    className: 'map-pin',
    html: `<span style="
      display:block;width:${size}px;height:${size}px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 6px rgba(0,0,0,0.35);"></span>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

interface MapViewProps {
  center: { lat: number; lng: number };
  markers: MapMarker[];
}

export default function MapView({ center, markers }: MapViewProps) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={12}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Circle
        center={[center.lat, center.lng]}
        radius={2500}
        pathOptions={{ color: '#1f7a4d', fillColor: '#1f7a4d', fillOpacity: 0.06, weight: 1 }}
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.lat, m.lng]} icon={makeIcon(m.type)}>
          <Popup>
            <strong>{m.label}</strong>
            <br />
            <span style={{ textTransform: 'capitalize' }}>{m.type}</span>
            {m.detail ? ` · ${m.detail}` : ''}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
