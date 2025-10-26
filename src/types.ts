// 地図表示に必要な最小限の観察データの型
export interface Observation {
  id: number;
  latitude: number;
  longitude: number;
  speciesName: string; // 生物名
  photoUrl: string;    // 写真のURL
}