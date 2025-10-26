import L from 'leaflet';
// CSSのインポートはここで行ってもOK
import 'leaflet/dist/leaflet.css';

// -----------------------------------------------------------------
// 💡 マーカーアイコンの画像パス問題を解決するためのコード
// -----------------------------------------------------------------
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'leaflet/dist/images/marker-icon-2x.png',
  iconUrl: 'leaflet/dist/images/marker-icon.png',
  shadowUrl: 'leaflet/dist/images/marker-shadow.png',
});
// -----------------------------------------------------------------