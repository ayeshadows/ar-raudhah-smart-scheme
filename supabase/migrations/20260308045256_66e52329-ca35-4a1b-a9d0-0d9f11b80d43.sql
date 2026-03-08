
CREATE OR REPLACE FUNCTION public.award_hasanat_on_transaction()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
DECLARE
  _plan text;
  _points_per_tx integer;
  _tx_count integer;
  _total numeric;
BEGIN
  IF NEW.status = 'completed' THEN
    -- Get the plan from the application
    SELECT plan INTO _plan
    FROM public.applications
    WHERE id = NEW.application_id;

    -- Determine points per transaction based on plan
    IF _plan = 'pintar_plus' THEN
      _points_per_tx := 8;
    ELSE
      _points_per_tx := 2;
    END IF;

    -- Count all completed transactions for this user
    SELECT COUNT(*), COALESCE(SUM(amount), 0)
    INTO _tx_count, _total
    FROM public.transactions
    WHERE user_id = NEW.user_id
      AND status = 'completed';

    -- Upsert hasanat with recalculated totals
    INSERT INTO public.hasanat (user_id, total_points, total_amount, updated_at)
    VALUES (NEW.user_id, _tx_count * _points_per_tx, _total, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_points = _tx_count * _points_per_tx,
      total_amount = _total,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$$;

-- Recreate trigger to ensure it's attached
DROP TRIGGER IF EXISTS trg_award_hasanat ON public.transactions;
CREATE TRIGGER trg_award_hasanat
  AFTER INSERT OR UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.award_hasanat_on_transaction();
