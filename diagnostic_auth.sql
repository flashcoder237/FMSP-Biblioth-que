-- =====================================================
-- SCRIPT DE DIAGNOSTIC AUTHENTIFICATION SUPABASE
-- =====================================================

-- 1. Vérifier les utilisateurs dans auth.users
SELECT 
    '=== UTILISATEURS AUTH.USERS ===' as section,
    id,
    email,
    email_confirmed_at,
    created_at,
    last_sign_in_at,
    raw_user_meta_data
FROM auth.users 
WHERE email LIKE '%@univ-test.fr'
ORDER BY created_at;

-- 2. Vérifier les profils dans public.profiles
SELECT 
    '=== PROFILS PUBLIC.PROFILES ===' as section,
    id,
    email,
    first_name,
    last_name,
    role,
    institution_id,
    is_active,
    created_at
FROM public.profiles 
WHERE email LIKE '%@univ-test.fr'
ORDER BY created_at;

-- 3. Vérifier les institutions
SELECT 
    '=== INSTITUTIONS ===' as section,
    id,
    code,
    name,
    status
FROM public.institutions
ORDER BY created_at;

-- 4. Vérifier les membres d'institution
SELECT 
    '=== MEMBRES INSTITUTION ===' as section,
    im.user_id,
    p.email,
    p.first_name,
    p.last_name,
    im.role,
    im.status,
    i.name as institution_name
FROM public.institution_members im
LEFT JOIN public.profiles p ON p.id = im.user_id
LEFT JOIN public.institutions i ON i.id = im.institution_id
WHERE p.email LIKE '%@univ-test.fr'
ORDER BY p.email;

-- 5. Compter les enregistrements
SELECT 
    '=== RÉSUMÉ ===' as section,
    (SELECT COUNT(*) FROM auth.users WHERE email LIKE '%@univ-test.fr') as auth_users_count,
    (SELECT COUNT(*) FROM public.profiles WHERE email LIKE '%@univ-test.fr') as profiles_count,
    (SELECT COUNT(*) FROM public.institutions) as institutions_count,
    (SELECT COUNT(*) FROM public.institution_members) as members_count;

-- 6. Vérifier les politiques RLS
SELECT 
    '=== POLITIQUES RLS ===' as section,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. Instructions pour créer manuellement les utilisateurs
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'INSTRUCTIONS POUR CRÉER LES UTILISATEURS';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Si les utilisateurs n''existent pas dans auth.users:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Allez dans Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '2. Cliquez "Add User" pour chaque utilisateur:';
    RAISE NOTICE '';
    RAISE NOTICE 'UTILISATEUR 1:';
    RAISE NOTICE 'Email: admin@univ-test.fr';
    RAISE NOTICE 'Password: Admin123!';
    RAISE NOTICE 'Email Confirm: Yes';
    RAISE NOTICE 'Raw User Meta Data (JSON):';
    RAISE NOTICE '{"first_name":"Marie","last_name":"Admin","role":"admin"}';
    RAISE NOTICE '';
    RAISE NOTICE 'UTILISATEUR 2:';
    RAISE NOTICE 'Email: bibliothecaire@univ-test.fr';
    RAISE NOTICE 'Password: Biblio123!';
    RAISE NOTICE 'Email Confirm: Yes';
    RAISE NOTICE 'Raw User Meta Data (JSON):';
    RAISE NOTICE '{"first_name":"Jean","last_name":"Bibliothécaire","role":"librarian"}';
    RAISE NOTICE '';
    RAISE NOTICE 'UTILISATEUR 3:';
    RAISE NOTICE 'Email: etudiant@univ-test.fr';
    RAISE NOTICE 'Password: Student123!';
    RAISE NOTICE 'Email Confirm: Yes';
    RAISE NOTICE 'Raw User Meta Data (JSON):';
    RAISE NOTICE '{"first_name":"Pierre","last_name":"Étudiant","role":"user"}';
    RAISE NOTICE '';
    RAISE NOTICE 'UTILISATEUR 4:';
    RAISE NOTICE 'Email: utilisateur@univ-test.fr';
    RAISE NOTICE 'Password: User123!';
    RAISE NOTICE 'Email Confirm: Yes';
    RAISE NOTICE 'Raw User Meta Data (JSON):';
    RAISE NOTICE '{"first_name":"Sophie","last_name":"Utilisateur","role":"user"}';
    RAISE NOTICE '';
    RAISE NOTICE 'Les profils seront créés automatiquement avec le trigger!';
    RAISE NOTICE '===============================================';
END $$;