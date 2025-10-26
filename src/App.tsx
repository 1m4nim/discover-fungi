import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { fetchObservations } from './api';
import { Observation } from './types';

function App() {
  // 観察データを格納するための状態を初期化
  const [observations, setObservations] = useState<Observation[]>([]);

  // コンポーネントがマウントされたときにAPIからデータを取得
  useEffect(() => {
    fetchObservations().then(data => {
      setObservations(data);
    });
  }, []);

  // マップの中心座標（日本の中心付近）
  const center: [number, number] = [35.6895, 139.6917]; 

  return (
    // MapContainerに高さを指定しないと、地図は表示されません！
    <MapContainer 
      center={center} 
      zoom={6} 
      scrollWheelZoom={true} // マウスホイールでのズームを有効に
      style={{ height: '100vh', width: '100%' }} 
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
                  style={{ width: '100%', height: 'auto', marginBottom: '10px' }} 
                />
              )}
              <a href={`https://www.inaturalist.org/observations/${obs.id}`} target="_blank" rel="noopener noreferrer">
                iNaturalistで詳細を見る
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}

export default App;