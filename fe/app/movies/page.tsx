import { api } from "@/lib/api";
import MediaGrid from "@/components/media-grid";
import { Layout } from "@/components/layouts/layout";

export const revalidate = 60;

export default async function MoviesHome() {
  const data = await api<{ results: any[] }>(
    "/v1/discover?type=movie&sort_by=popularity.desc&page=1",
  );

  return (
    <Layout>
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 space-y-6">
        <MediaGrid
          items={data.results}
          mediaType="movie"
          title="Trending Movies"
        />
      </div>
    </Layout>
  );
}
