import { getEntities } from "@/lib/entities";
import ExploreClient from "./ExploreClient";

const VALID_PER_PAGE = [10, 25, 50];

export default async function ExplorePage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; per?: string }>;
}) {
    const { q = "", page = "1", per = "25" } = await searchParams;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const perPage = VALID_PER_PAGE.includes(parseInt(per)) ? parseInt(per) : 25;

    const { entities, total } = await getEntities({ q, page: pageNum, perPage });

    return (
        <ExploreClient
            entities={entities}
            total={total}
            currentPage={pageNum}
            perPage={perPage}
            searchQuery={q}
        />
    );
}
