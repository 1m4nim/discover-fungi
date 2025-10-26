import inatjs from 'inaturalistjs';
// 💡 StackBlitzでの問題を回避するため、拡張子を明記
import { Observation } from './types.ts'; 

export async function fetchObservations(): Promise<Observation[]> {
  try {
    const params = {
      place_id: 110542, // Japan
      iconic_taxa: 'Fungi', 
      per_page: 50,
      order_by: 'created_at',
      order: 'desc',
    };

    const response = await inatjs.observations.search(params);

    return response.results.map((obs: any) => ({
      id: obs.id,
      latitude: obs.geojson?.coordinates[1] ?? 0, 
      longitude: obs.geojson?.coordinates[0] ?? 0,
      speciesName: obs.taxon?.preferred_common_name || obs.species_guess || 'Unknown Species', 
      photoUrl: obs.photos?.[0]?.url.replace('square', 'small') || '', 
    })).filter((obs: Observation) => obs.latitude !== 0);

  } catch (error) {
    console.error('iNaturalist APIの呼び出しエラー:', error);
    return [];
  }
}