import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchObservations } from './api';
import { Observation } from './types';

function App() {
  const [observations, setObservations] = useState<Observation[]>([]);

  // データ取得ロジック
  useEffect(() => {
    // 💡 API呼び出し
    fetchObservations().then(data => {
      console.log(`${data.length}件の観察データを取得しました。`);
      setObservations(data);
    });
  }, []);

  // マップの中心と初期ズーム
  const center: [number, number] = [36.2048, 138.2529]; // 日本の中心
  const initialZoom = 6; 

  return (
    // 🚨 必須: styleで高さを指定しないと、地図は見えません
    <MapContainer 
      center={center} 
      zoom={initialZoom} 
      scrollWheelZoom={true} 
      style={{ height: '100vh', width: '100%' }} // 画面いっぱいに表示
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
              <a href={`https://www.inaturalist.org/observations/${obs.id}`} target="_blank" rel="noopener noreferrer">
                詳細を見る
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;