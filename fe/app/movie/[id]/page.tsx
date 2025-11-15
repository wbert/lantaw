export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
import MovieDetails from "@/components/movie-details";
import { Layout } from "@/components/layouts/layout";

type MovieApiResponse = {
  details: any;
  credits: any;
  videos: any;
  recommendations: any;
};

// Next now passes params as a Promise in some server APIs
type PageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 60;

export default async function MoviePage({ params }: PageProps) {
  // ⬅️ this is the important change
  const { id } = await params;

  const data = await api<MovieApiResponse>(`/v1/media/movie/${id}`);

  return (
    <Layout>
      <MovieDetails
        details={data.details}
        credits={data.credits}
        videos={data.videos}
        recommendations={data.recommendations}
      />
    </Layout>
  );
}
