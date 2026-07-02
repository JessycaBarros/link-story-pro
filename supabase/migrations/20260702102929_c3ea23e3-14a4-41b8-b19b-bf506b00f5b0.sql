
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.promote_first_user_to_admin() FROM PUBLIC, anon, authenticated;
