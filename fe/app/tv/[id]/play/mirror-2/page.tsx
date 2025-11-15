import { api } from "@/lib/api";
import TVMirrorPlayer from "@/components/tv-mirror-player";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string }>;
};

type TmdbGenre = {
  id: number;
  name: string;
};

type TmdbSeason = {
  season_number: number;
  episode_count: number;
  air_date: string | null;
  name: string;
  poster_path: string | null;
};

type TmdbTVDetails = {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  last_air_date: string;
  number_of_episodes: number;
  number_of_seasons: number;
  genres: TmdbGenre[];
  seasons: TmdbSeason[];
};

type TmdbVideo = {
  id: string;
  key: string;
  site: string;
  type: string;
};

type TVApiResponse = {
  details: TmdbTVDetails;
  videos: { results: TmdbVideo[] };
  recommendations: { results: TmdbTVDetails[] };
};

export default async function TVMirrorPage({ params }: PageProps) {
  const { id } = await params;

  const data = await api<TVApiResponse>(`/v1/media/tv/${id}`);

  return (
    <TVMirrorPlayer
      tvId={data.details.id}
      details={data.details}
      videos={data.videos}
      recommendations={data.recommendations}
    />
  );
}
