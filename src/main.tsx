// src/main.tsx の理想的な構造

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx'; // ★Appコンポーネントが正しくインポートされているか確認
import './index.css';

// ----------------------------------------------------
// Leafletの修正コードをここで実行しているはず
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
// ... デフォルトアイコンの修正コード ...
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});
// ----------------------------------------------------

// HTMLの #root 要素を取得し、そこにAppコンポーネントをレンダリング
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App /> {/* ★Appコンポーネントがここで呼び出されているか確認 */}
  </React.StrictMode>,
);