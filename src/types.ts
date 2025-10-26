// src/types.ts

// データを扱うためのインターフェース
export interface Observation { 
  id: number;
  latitude: number;
  longitude: number;
  speciesName: string;
  photoUrl: string;
}