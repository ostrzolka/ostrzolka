import { supabaseAdmin } from "./supabase";
import { BibEntry, flattenBibliography } from "./addresses";

// ─── Types ────────────────────────────────────────────────────────────────────

export type EntityType = "address" | "person" | "organisation";

export interface EntityCard {
    id: string;
    entityType: EntityType;
    label: string;
    subtitle: string | null;
    description: string | null;
    year: string | null;
}

export interface PersonDetail {
    id: string;
    name: string | null;
    surname: string | null;
    nameVariants: string[] | null;
    surnameVariants: string[] | null;
    summary: string | null;
    birthDate: string | null;
    birthPlace: string | null;
    deathDate: string | null;
    deathPlace: string | null;
    occupations: string[] | null;
    denominations: string[] | null;
    bibliography: BibEntry[];
}

export interface OrganisationDetail {
    id: string;
    name: string | null;
    nameVariants: string[] | null;
    creationDate: string | null;
    dissolutionDate: string | null;
    bibliography: BibEntry[];
}


export async function getEntities({
    q = "",
    page = 1,
    perPage = 25,
    entityType = "",
}: {
    q?: string;
    page?: number;
    perPage?: number;
    entityType?: string;
} = {}): Promise<{ entities: EntityCard[]; total: number }> {
    const trimmed = q.trim();
    const from = (page - 1) * perPage;

    let countQ: any = supabaseAdmin
        .from("unified_entities")
        .select("id", { count: "exact", head: true });
    if (trimmed) countQ = countQ.or(`label.ilike.%${trimmed}%,description.ilike.%${trimmed}%`);
    if (entityType) countQ = countQ.eq("entity_type", entityType);

    let dataQ: any = supabaseAdmin
        .from("unified_entities")
        .select("id, entity_type, label, subtitle, description, year")
        .range(from, from + perPage - 1)
        .order("label");
    if (trimmed) dataQ = dataQ.or(`label.ilike.%${trimmed}%,description.ilike.%${trimmed}%`);
    if (entityType) dataQ = dataQ.eq("entity_type", entityType);

    const [{ count }, { data, error }] = await Promise.all([countQ, dataQ]);

    if (error) {
        console.error("[getEntities] Supabase error:", error.message);
        return { entities: [], total: 0 };
    }

    const entities: EntityCard[] = (data ?? []).map((row: any) => ({
        id: String(row.id),
        entityType: row.entity_type as EntityType,
        label: row.label ?? "",
        subtitle: row.subtitle ?? null,
        description: row.description ?? null,
        year: row.year ?? null,
    }));

    return { entities, total: count ?? 0 };
}


export async function getPersonById(id: string): Promise<PersonDetail | null> {
    const { data, error } = await supabaseAdmin
        .from("person")
        .select(`
            id,
            name,
            surname,
            name_variants,
            surname_variants,
            summary,
            birth_date,
            birth_place,
            death_date,
            death_place,
            occupations,
            denominations,
            entry_person (
                entry (
                    id, description, topics, scope, _processing_status, creator,
                    entry_source (
                        source ( id, title, authors, publisher, year, description )
                    )
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getPersonById] Supabase error:", error.message);
        return null;
    }

    return {
        id: String(data.id),
        name: data.name ?? null,
        surname: data.surname ?? null,
        nameVariants: Array.isArray(data.name_variants) ? data.name_variants : null,
        surnameVariants: Array.isArray(data.surname_variants) ? data.surname_variants : null,
        summary: data.summary ?? null,
        birthDate: data.birth_date ?? null,
        birthPlace: data.birth_place ?? null,
        deathDate: data.death_date ?? null,
        deathPlace: data.death_place ?? null,
        occupations: Array.isArray(data.occupations) ? data.occupations : null,
        denominations: Array.isArray(data.denominations) ? data.denominations : null,
        bibliography: flattenBibliography((data as any).entry_person ?? []),
    };
}


export async function getOrganisationById(id: string): Promise<OrganisationDetail | null> {
    const { data, error } = await supabaseAdmin
        .from("organisation")
        .select(`
            id,
            name,
            name_variants,
            creation_date,
            dissolution_date,
            entry_organisation (
                entry (
                    id, description, topics, scope, _processing_status, creator,
                    entry_source (
                        source ( id, title, authors, publisher, year, description )
                    )
                )
            )
        `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("[getOrganisationById] Supabase error:", error.message);
        return null;
    }

    return {
        id: String(data.id),
        name: data.name ?? null,
        nameVariants: Array.isArray(data.name_variants) ? data.name_variants : null,
        creationDate: data.creation_date ?? null,
        dissolutionDate: data.dissolution_date ?? null,
        bibliography: flattenBibliography((data as any).entry_organisation ?? []),
    };
}
