import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// -----------------------------------------------------------------
// 🚨 Leafletの必須修正コード
// -----------------------------------------------------------------
import L from 'leaflet';
import 'leaflet/dist/leaflet.css'; // 🚨 必須: 地図タイル表示のためのCSS
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});
// -----------------------------------------------------------------

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);