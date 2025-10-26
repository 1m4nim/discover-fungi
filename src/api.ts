import inatjs from 'inaturalistjs';
// 🚨 types.ts からのインポート。StackBlitzでの問題を回避するため、拡張子を明記します。
import inatjs from 'inaturalistjs';
// 🚨 修正: 拡張子を明記
import { Observation } from './types.ts';

// APIからデータを取得する関数
export async function fetchObservations(): Promise<Observation[]> {
  try {
    const params = {
      place_id: 110542, // Japan
      iconic_taxa: 'Fungi', // 菌類
      per_page: 50,
      order_by: 'created_at',
      order: 'desc',
    };

    const response = await inatjs.observations.search(params);

    // データの変換ロジック
    return response.results.map((obs: any) => ({
      id: obs.id,
      // iNaturalistのgeojsonは [経度, 緯度] の順
      latitude: obs.geojson?.coordinates[1] ?? 0, 
      longitude: obs.geojson?.coordinates[0] ?? 0,
      speciesName: obs.taxon?.preferred_common_name || obs.species_guess || 'Unknown Species', 
      photoUrl: obs.photos?.[0]?.url.replace('square', 'small') || '', 
    })).filter((obs: Observation) => obs.latitude !== 0);

  } catch (error) {
    console.error('iNaturalist APIの呼び出しエラー:', error);
    // 💡 エラーが発生してもアプリ全体がクラッシュしないように、空配列を返します
    return [];
  }
}