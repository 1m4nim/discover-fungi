// src/App.tsx

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import * as inatjs from 'inaturalistjs'; 

// Observation型を定義
interface Observation { 
  id: number;
  latitude: number;
  longitude: number;
  speciesName: string;
  photoUrl: string;
}

// API関数を定義 (互換性問題を回避するための最終ロジック)
async function fetchObservations(): Promise<Observation[]> {
  try {
    const params = {
      place_id: 110542, // Japan
      iconic_taxa: 'Fungi', 
      per_page: 50,
      order_by: 'created_at',
      order: 'desc',
    };

    // 🚨 最終修正: inatjsの可能性のある全ての場所をチェック
    // inatjs.default.default, inatjs.default, inatjs の順に試行
    const api = 
        (inatjs as any).default?.default || 
        (inatjs as any).default || 
        inatjs;

    // apiの中にobservationsとsearch関数があることを確認する安全策
    if (!api || !api.observations || typeof api.observations.search !== 'function') {
        // ログを出して、API呼び出しをスキップ
        console.error("iNaturalistjs library failed to load correctly. API call skipped.");
        return [];
    }
    
    // 修正: api変数を使ってobservationsにアクセスし、APIを呼び出す
    const response = await api.observations.search(params);

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
      style={{ height: '100vh', width: '100%' }} // 必須: 高さを指定
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