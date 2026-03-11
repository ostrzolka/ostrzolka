import { getAddresses } from "@/lib/addresses";
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

    const { addresses, total } = await getAddresses({ q, page: pageNum, perPage });

    return (
        <ExploreClient
            addresses={addresses}
            total={total}
            currentPage={pageNum}
            perPage={perPage}
            searchQuery={q}
        />
    );
}
