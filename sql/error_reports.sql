CREATE TABLE public.error_reports (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    object_id uuid NOT NULL,
    object_type text NOT NULL CHECK (object_type IN ('address', 'person', 'organisation')),
    object_name text NOT NULL,
    message text NOT NULL,
    status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    
    PRIMARY KEY (id)
);


COMMENT ON TABLE public.error_reports IS 'Stores user-submitted error reports for entries';
COMMENT ON COLUMN public.error_reports.object_type IS 'Type of the entity being reported (address, person, organisation)';
COMMENT ON COLUMN public.error_reports.status IS 'Status of the error report (new, in_progress, resolved)';
ALTER TABLE public.error_reports ENABLE ROW LEVEL SECURITY;
