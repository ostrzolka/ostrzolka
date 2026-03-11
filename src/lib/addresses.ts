import { supabaseAdmin } from "./supabase";

// ─── Types ────

export interface AddressCard {
    id: string;
    addressLabel: string;
    name: string | null;
    description: string | null;
    year: string | null;
    longitude: number | null;
    latitude: number | null;
}

export interface BibEntry {
    sourceId: string;
    title: string | null;
    year: string | null;
    authors: string | null;
    publisher: string | null;
    sourceDescription: string | null;
    entryId: string;
    entryDescription: string | null;
    entryScope: string | null;
    topics: string[] | null;
}

export interface AddressDetail {
    id: string;
    addressLabel: string;
    name: string | null;
    description: string | null;
    constructionStart: string | null;
    constructionEnd: string | null;
    buildingType: string | null;
    longitude: number | null;
    latitude: number | null;
    tags: string[];
    bibliography: BibEntry[];
}

// ─── Helpers ───

/**
 * combines street and house number parts into full addres

 */

export function buildAddressLabel(address: any): string {
    const parts: string[] = [];
    const street = address.street;
    if (street) {
        if (street.teryt_cecha) parts.push(street.teryt_cecha);
        if (street.teryt_nazwa_2) parts.push(street.teryt_nazwa_2);
        if (street.teryt_nazwa_1) parts.push(street.teryt_nazwa_1);
    }
    if (address.house_number) parts.push(String(address.house_number));
    if (address.house_number_detail) parts.push(String(address.house_number_detail));

    return parts.join(" ").trim() || "Nieznany adres";
}

function flattenTopics(entryAddress: any[]): string[] {
    const topicSet = new Set<string>();
    for (const ea of entryAddress ?? []) {
        const entry = ea.entry;
        if (!entry || entry._processing_status !== "processed") continue;
        if (Array.isArray(entry.topics)) {
            for (const topic of entry.topics) {
                if (topic) topicSet.add(String(topic));
            }
        }
    }
    return Array.from(topicSet);
}

/**
 * flattens entries
 * processes entries with _processing_status === 'processed'
 */

function flattenBibliography(entryAddress: any[]): BibEntry[] {
    const results: BibEntry[] = [];
    for (const ea of entryAddress ?? []) {
        const entry = ea.entry;
        if (!entry || entry._processing_status !== "processed") continue;

        const sources: any[] = entry.entry_source ?? [];

        if (sources.length === 0) {
            results.push({
                sourceId: "",
                title: null,
                year: null,
                authors: null,
                publisher: null,
                sourceDescription: null,
                entryId: String(entry.id),
                entryDescription: entry.description ?? null,
                entryScope: entry.scope ?? null,
                topics: Array.isArray(entry.topics) ? entry.topics : null,
            });
        } else {
            for (const es of sources) {
                const src = es.source;
                results.push({
                    sourceId: src ? String(src.id) : "",
                    title: src?.title ?? null,
                    year: src?.year ? String(src.year) : null,
                    authors: src?.authors ?? null,
                    publisher: src?.publisher ?? null,
                    sourceDescription: src?.description ?? null,
                    entryId: String(entry.id),
                    entryDescription: entry.description ?? null,
                    entryScope: entry.scope ?? null,
                    topics: Array.isArray(entry.topics) ? entry.topics : null,
                });
            }
        }
    }
    return results;
}

// data fetching

export async function getAddresses({
    q = "",
    page = 1,
    perPage = 25,
}: {
    q?: string;
    page?: number;
    perPage?: number;
} = {}): Promise<{ addresses: AddressCard[]; total: number }> {
    const trimmed = q.trim();
    const from = (page - 1) * perPage;

    // resolve street id matching the query parallel with count
    const streetIdsPromise: Promise<string[]> = trimmed
        ? Promise.resolve(
            supabaseAdmin
                .from("street")
                .select("id")
                .or(`teryt_nazwa_1.ilike.%${trimmed}%,teryt_nazwa_2.ilike.%${trimmed}%`)
                .then(({ data }) => (data ?? []).map((r: any) => String(r.id)))
        )
        : Promise.resolve([]);

    // build the OR filter string for ids
    const streetIds = await streetIdsPromise;
    const buildFilter = (): string | null => {
        if (!trimmed) return null;
        const parts = [
            `name.ilike.%${trimmed}%`,
            `description.ilike.%${trimmed}%`,
        ];
        if (streetIds.length > 0) {
            parts.push(`street_id.in.(${streetIds.join(",")})`);
        }
        return parts.join(",");
    };
    const filter = buildFilter();

    // count (HEAD only, no joins) + data (25 rows + street join) in parallel
    let countQ: any = supabaseAdmin
        .from("address")
        .select("id", { count: "exact", head: true });
    if (filter) countQ = countQ.or(filter);

    let dataQ: any = supabaseAdmin
        .from("address")
        .select(`
            id,
            house_number,
            house_number_detail,
            name,
            description,
            construction_end,
            longitude,
            latitude,
            street!address_street_id_fkey ( teryt_cecha, teryt_nazwa_2, teryt_nazwa_1 )
        `)
        .range(from, from + perPage - 1)
        .order("id");
    if (filter) dataQ = dataQ.or(filter);

    const [{ count }, { data, error }] = await Promise.all([countQ, dataQ]);

    if (error) {
        console.error("[getAddresses] Supabase error:", error.message);
        return { addresses: [], total: 0 };
    }

    const addresses = (data ?? []).map((row: any) => ({
        id: String(row.id),
        addressLabel: buildAddressLabel(row),
        name: row.name ?? null,
        description: row.description ?? null,
        year: row.construction_end ? String(row.construction_end) : null,
        longitude: row.longitude ?? null,
        latitude: row.latitude ?? null,
    }));

    return { addresses, total: count ?? 0 };
}


export async function getAddressById(id: string): Promise<AddressDetail | null> {
    const { data, error } = await supabaseAdmin
        .from("address")
        .select(`
            id,
            house_number,
            house_number_detail,
            name,
            description,
            construction_start,
            construction_end,
            building_type,
            longitude,
            latitude,
            street!address_street_id_fkey ( teryt_cecha, teryt_nazwa_2, teryt_nazwa_1 ),
            entry_address (
                entry (
                    id, description, topics, scope, _processing_status,
                    entry_source (
                        source ( id, title, authors, publisher, year, description )
                    )
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getAddressById] Supabase error:", error.message);
        return null;
    }

    if (!data) return null;

    const raw = data as any;

    return {
        id: String(raw.id),
        addressLabel: buildAddressLabel(raw),
        name: raw.name ?? null,
        description: raw.description ?? null,
        constructionStart: raw.construction_start ? String(raw.construction_start) : null,
        constructionEnd: raw.construction_end ? String(raw.construction_end) : null,
        buildingType: raw.building_type ?? null,
        longitude: raw.longitude ?? null,
        latitude: raw.latitude ?? null,
        tags: flattenTopics(raw.entry_address ?? []),
        bibliography: flattenBibliography(raw.entry_address ?? []),
    };
}
