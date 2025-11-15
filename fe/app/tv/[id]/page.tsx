// app/tv/[id]/page.tsx
export const dynamic = "force-dynamic";
import { api } from "@/lib/api";
import TVDetails from "@/components/tv-details";

type TVApiResponse = {
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

export default async function TVPage({ params }: PageProps) {
  const { id } = await params;

  const data = await api<TVApiResponse>(`/v1/media/tv/${id}`);

  return (
    <TVDetails
      details={data.details}
      credits={data.credits}
      videos={data.videos}
      recommendations={data.recommendations}
    />
  );
}
