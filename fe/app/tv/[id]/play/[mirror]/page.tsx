import { api } from "@/lib/api";
import TVMirrorPlayer from "@/components/tv-mirror-player";
import { Layout } from "@/components/layouts/layout";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ id: string; mirror: string }>;
};

type TVApiResponse = {
  details: any;
  videos: any;
  recommendations: any;
};

export default async function TVMirrorPage({ params }: PageProps) {
  const { id, mirror } = await params;

  const data = await api<TVApiResponse>(`/v1/media/tv/${id}`);

  return (
    <Layout>
      <TVMirrorPlayer
        tvId={data.details.id}
        details={data.details}
        videos={data.videos}
        recommendations={data.recommendations}
        initialMirror={mirror} // 👈 new prop
      />
    </Layout>
  );
}
