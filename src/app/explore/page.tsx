import { getAddresses } from "@/lib/addresses";
import ExploreClient from "./ExploreClient";

export default async function ExplorePage() {
    const addresses = await getAddresses();
    return <ExploreClient addresses={addresses} />;
}
