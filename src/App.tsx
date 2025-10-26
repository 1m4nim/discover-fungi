// src/App.tsx

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchObservations } from './api'; // ★ステップ1で作成したAPI関数をインポート
import { Observation } from './types'; // ★型定義をインポート

function App() {
  // 観察データを格納するための状態
  const [observations, setObservations] = useState<Observation[]>([]);

  // コンポーネントがマウントされたときにデータを取得
  useEffect(() => {
    fetchObservations().then(data => {
      setObservations(data);
    });
  }, []);

  // マップの中心座標 (データを取得する場所付近に設定すると良い)
  const center: [number, number] = [35.6895, 139.6917]; 

  return (
    <MapContainer 
      center={center} 
      zoom={8} 
      style={{ height: '100vh', width: '100%' }} // 必ず高さを指定！
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors | Data from <a href="https://www.inaturalist.org/">iNaturalist</a>'
      />

      {/* 取得したデータをループしてマーカーを配置 */}
      {observations.map(obs => (
        <Marker 
          key={obs.id} 
          position={[obs.latitude, obs.longitude]} // 緯度経度を指定
        >
          <Popup>
            <div style={{ maxWidth: '200px' }}>
              <strong>{obs.speciesName}</strong>
              <p>観察ID: {obs.id}</p>
              {obs.photoUrl && (
                <img 
                  src={obs.photoUrl} 
                  alt={obs.speciesName} 
                  style={{ width: '100%', height: 'auto' }} 
                />
              )}
              <a href={`https://www.inaturalist.org/observations/${obs.id}`} target="_blank" rel="noopener noreferrer">
                iNaturalistで見る
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;