import inatjs from 'inaturalistjs';
import { Observation } from './types';

// APIからデータを取得する関数
export async function fetchObservations(): Promise<Observation[]> {
  try {
    const params = {
      // 例: 日本付近の鳥類を検索 (適宜変更してください)
      place_id: 110542, // Japan
      iconic_taxa: 'Aves', // 鳥類
      per_page: 50,       // 取得する件数
      order_by: 'created_at',
      order: 'desc',
    };

    const response = await inatjs.observations.search(params);

    // 取得したレスポンスから、Observation型に変換して返す
    return response.results.map((obs: any) => ({
      id: obs.id,
      latitude: obs.geojson?.coordinates[1] ?? 0, // 緯度
      longitude: obs.geojson?.coordinates[0] ?? 0, // 経度
      // 適切な生物名（英語/日本語）を取得
      speciesName: obs.taxon?.preferred_common_name || obs.species_guess || 'Unknown Species', 
      // 写真があれば最初の写真のサムネイルURLを取得
      photoUrl: obs.photos?.[0]?.url.replace('square', 'small') || '', 
    })).filter((obs: Observation) => obs.latitude !== 0); // 緯度経度が0のデータを除外

  } catch (error) {
    console.error('iNaturalist APIの呼び出しエラー:', error);
    return [];
  }
}