// src/App.tsx

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as inatjs from 'inaturalistjs'; // ✅ 名前付きインポートに変更

// App.tsx内でObservation型を直接定義
interface Observation { 
  id: number;
  latitude: number;
  longitude: number;
  speciesName: string;
  photoUrl: string;
}

// App.tsx内でAPI関数を直接定義
async function fetchObservations(): Promise<Observation[]> {
  try {
    const params = {
      place_id: 110542, // Japan
      iconic_taxa: 'Fungi', 
      per_page: 50,
      order_by: 'created_at',
      order: 'desc',
    };

    const response = await inatjs.observations.search(params);

    return response.results.map((obs: any) => ({
      id: obs.id,
      latitude: obs.geojson?.coordinates[1] ?? 0, 
      longitude: obs.geojson?.coordinates[0] ?? 0,
      speciesName: obs.taxon?.preferred_common_name || obs.species_guess || 'Unknown Species', 
      photoUrl: obs.photos?.[0]?.url.replace('square', 'small') || '', 
    })).filter((obs: Observation) => obs.latitude !== 0);

  } catch (error) {
    console.error('iNaturalist APIの呼び出しエラー:', error);
    return [];
  }
}

function App() {
  const [observations, setObservations] = useState<Observation[]>([]);

  // データ取得ロジック
  useEffect(() => {
    fetchObservations().then(data => {
      console.log(`取得データ数: ${data.length}`);
      setObservations(data);
    });
  }, []);

  const center: [number, number] = [36.2048, 138.2529]; // 日本の中心
  const initialZoom = 6; 

  return (
    <MapContainer 
      center={center} 
      zoom={initialZoom} 
      scrollWheelZoom={true} 
      style={{ height: '100vh', width: '100%' }} // 🚨 必須: styleで高さを指定
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Data from <a href="https://www.inaturalist.org/">iNaturalist</a>'
      />

      {/* マーカーの描画 */}
      {observations.map(obs => (
        <Marker 
          key={obs.id} 
          position={[obs.latitude, obs.longitude]}
        >
          <Popup>
            <div style={{ maxWidth: '200px' }}>
              <strong>{obs.speciesName}</strong>
              {obs.photoUrl && (
                <img 
                  src={obs.photoUrl} 
                  alt={obs.speciesName} 
                  style={{ width: '100%', height: 'auto', display: 'block' }} 
                />
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;