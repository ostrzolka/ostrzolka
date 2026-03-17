-- ==========================================================================
-- unified_entities VIEW
-- ==========================================================================
-- SAFE: creates a READ-ONLY view only.
-- Does NOT alter any existing table, column, row, or constraint.
-- ==========================================================================

CREATE OR REPLACE VIEW public.unified_entities AS

  -- ── Addresses ─────────────────────────────────────────────────────────────
  SELECT
    a.id,
    'address'::text                                          AS entity_type,
    NULLIF(TRIM(CONCAT_WS(' ',
      NULLIF(TRIM(s.teryt_cecha),                      ''),
      NULLIF(TRIM(s.teryt_nazwa_2),                    ''),
      NULLIF(TRIM(s.teryt_nazwa_1),                    ''),
      NULLIF(CAST(a.house_number AS text),              ''),
      NULLIF(TRIM(CAST(a.house_number_detail AS text)), '')
    )), '')                                                  AS label,
    a.name                                                   AS subtitle,
    a.description                                            AS description,
    CAST(a.construction_end AS text)                         AS year,
    a._created_at
  FROM address a
  LEFT JOIN street s ON s.id = a.street_id

  UNION ALL

  -- ── People ────────────────────────────────────────────────────────────────
  SELECT
    p.id,
    'person'::text                                           AS entity_type,
    NULLIF(TRIM(CONCAT_WS(' ',
      NULLIF(TRIM(p.name),    ''),
      NULLIF(TRIM(p.surname), '')
    )), '')                                                  AS label,
    NULL::text                                               AS subtitle,
    p.summary                                                AS description,
    p.birth_date                                             AS year,
    p._created_at
  FROM person p
  WHERE p._deleted_at IS NULL

  UNION ALL

  -- ── Organisations ─────────────────────────────────────────────────────────
  SELECT
    o.id,
    'organisation'::text                                     AS entity_type,
    NULLIF(TRIM(o.name), '')                                 AS label,
    NULL::text                                               AS subtitle,
    NULL::text                                               AS description,
    o.creation_date                                          AS year,
    o._created_at
  FROM organisation o
  WHERE o._deleted_at IS NULL;

GRANT SELECT ON public.unified_entities TO anon, authenticated, service_role;
