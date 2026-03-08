
CREATE TRIGGER on_transaction_insert
  AFTER INSERT ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.award_hasanat_on_transaction();
