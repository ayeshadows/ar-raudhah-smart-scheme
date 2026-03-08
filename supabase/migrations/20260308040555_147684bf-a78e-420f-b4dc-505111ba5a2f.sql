CREATE OR REPLACE FUNCTION public.award_hasanat_on_transaction()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _plan text;
  _points integer;
BEGIN
  IF NEW.status = 'completed' THEN
    SELECT plan INTO _plan
    FROM public.applications
    WHERE id = NEW.application_id;

    IF _plan = 'pintar_plus' THEN
      _points := 8;
    ELSE
      _points := 2;
    END IF;

    INSERT INTO public.hasanat (user_id, total_points, total_amount, updated_at)
    VALUES (NEW.user_id, _points, NEW.amount, now())
    ON CONFLICT (user_id)
    DO UPDATE SET
      total_points = hasanat.total_points + _points,
      total_amount = hasanat.total_amount + NEW.amount,
      updated_at = now();
  END IF;
  RETURN NEW;
END;
$function$;