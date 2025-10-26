import inatjs from 'inaturalistjs';
// 🚨 修正: 拡張子 (.ts) を明示的に追加
import { Observation } from './types.ts';

// APIからデータを取得する関数
export async function fetchObservations(): Promise<Observation[]> {
  try {
    const params = {
      // 例: 日本付近の菌類（fungi）を検索
      place_id: 110542, // Japan
      iconic_taxa: 'Fungi', // 菌類
      per_page: 50,       // 取得する件数
      order_by: 'created_at',
      order: 'desc',
    };

    const response = await inatjs.observations.search(params);

    // レスポンスデータを Observation 型に変換
    return response.results.map((obs: any) => ({
      id: obs.id,
      // iNaturalistのgeojsonは [経度, 緯度] の順なので注意
      latitude: obs.geojson?.coordinates[1] ?? 0, 
      longitude: obs.geojson?.coordinates[0] ?? 0,
      speciesName: obs.taxon?.preferred_common_name || obs.species_guess || 'Unknown Species', 
      // 写真URLをサムネイルサイズに変更
      photoUrl: obs.photos?.[0]?.url.replace('square', 'small') || '', 
    })).filter((obs: Observation) => obs.latitude !== 0); // 座標がないデータは除外

  } catch (error) {
    console.error('iNaturalist APIの呼び出しエラー:', error);
    return [];
  }
}