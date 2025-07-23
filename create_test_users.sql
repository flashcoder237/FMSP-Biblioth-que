-- =====================================================
-- SCRIPT POUR CRÉER LES UTILISATEURS DE TEST
-- =====================================================

-- Note: Ce script crée les profils. Les utilisateurs d'authentification 
-- doivent être créés via l'interface Supabase Authentication.

-- Vérifier les utilisateurs existants
DO $$
BEGIN
    RAISE NOTICE '=== VÉRIFICATION DES UTILISATEURS EXISTANTS ===';
    RAISE NOTICE 'Utilisateurs dans auth.users: %', (SELECT COUNT(*) FROM auth.users);
    RAISE NOTICE 'Profils dans public.profiles: %', (SELECT COUNT(*) FROM public.profiles);
END $$;

-- Supprimer les profils existants (si nécessaire)
DELETE FROM public.institution_members WHERE user_id IN (
    SELECT id FROM public.profiles WHERE email IN (
        'admin@univ-test.fr',
        'bibliothecaire@univ-test.fr',
        'etudiant@univ-test.fr',
        'utilisateur@univ-test.fr'
    )
);

DELETE FROM public.profiles WHERE email IN (
    'admin@univ-test.fr',
    'bibliothecaire@univ-test.fr',
    'etudiant@univ-test.fr',
    'utilisateur@univ-test.fr'
);

-- =====================================================
-- CRÉER LES PROFILS MANUELLEMENT
-- =====================================================

-- Note: Vous devez d'abord créer les utilisateurs dans Supabase Authentication
-- avec ces IDs spécifiques, puis exécuter ce script

-- Profil Administrateur
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    institution_id,
    is_active,
    created_at,
    updated_at
) VALUES (
    '11111111-2222-3333-4444-555555555555',
    'admin@univ-test.fr',
    'Marie',
    'Admin',
    'admin',
    '11111111-1111-1111-1111-111111111111',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    institution_id = EXCLUDED.institution_id,
    updated_at = NOW();

-- Profil Bibliothécaire
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    institution_id,
    is_active,
    created_at,
    updated_at
) VALUES (
    '22222222-3333-4444-5555-666666666666',
    'bibliothecaire@univ-test.fr',
    'Jean',
    'Bibliothécaire',
    'librarian',
    '11111111-1111-1111-1111-111111111111',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    institution_id = EXCLUDED.institution_id,
    updated_at = NOW();

-- Profil Étudiant
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    institution_id,
    is_active,
    created_at,
    updated_at
) VALUES (
    '33333333-4444-5555-6666-777777777777',
    'etudiant@univ-test.fr',
    'Pierre',
    'Étudiant',
    'user',
    '11111111-1111-1111-1111-111111111111',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    institution_id = EXCLUDED.institution_id,
    updated_at = NOW();

-- Profil Utilisateur
INSERT INTO public.profiles (
    id,
    email,
    first_name,
    last_name,
    role,
    institution_id,
    is_active,
    created_at,
    updated_at
) VALUES (
    '44444444-5555-6666-7777-888888888888',
    'utilisateur@univ-test.fr',
    'Sophie',
    'Utilisateur',
    'user',
    '11111111-1111-1111-1111-111111111111',
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    role = EXCLUDED.role,
    institution_id = EXCLUDED.institution_id,
    updated_at = NOW();

-- Ajouter les utilisateurs comme membres de l'institution
INSERT INTO public.institution_members (
    user_id,
    institution_id,
    role,
    status,
    joined_at
) VALUES 
(
    '11111111-2222-3333-4444-555555555555',
    '11111111-1111-1111-1111-111111111111',
    'admin',
    'active',
    NOW()
),
(
    '22222222-3333-4444-5555-666666666666',
    '11111111-1111-1111-1111-111111111111',
    'librarian',
    'active',
    NOW()
),
(
    '33333333-4444-5555-6666-777777777777',
    '11111111-1111-1111-1111-111111111111',
    'member',
    'active',
    NOW()
),
(
    '44444444-5555-6666-7777-888888888888',
    '11111111-1111-1111-1111-111111111111',
    'member',
    'active',
    NOW()
) ON CONFLICT (user_id, institution_id) DO UPDATE SET
    role = EXCLUDED.role,
    status = EXCLUDED.status;

-- Vérification finale
DO $$
BEGIN
    RAISE NOTICE '=== RÉSULTAT FINAL ===';
    RAISE NOTICE 'Profils créés: %', (SELECT COUNT(*) FROM public.profiles WHERE email LIKE '%@univ-test.fr');
    RAISE NOTICE 'Membres institution: %', (SELECT COUNT(*) FROM public.institution_members WHERE institution_id = '11111111-1111-1111-1111-111111111111');
    RAISE NOTICE '';
    RAISE NOTICE 'PROCHAINES ÉTAPES:';
    RAISE NOTICE '1. Allez dans Supabase Dashboard > Authentication > Users';
    RAISE NOTICE '2. Cliquez "Add User" pour chaque utilisateur:';
    RAISE NOTICE '';
    RAISE NOTICE 'USER 1:';
    RAISE NOTICE 'Email: admin@univ-test.fr';
    RAISE NOTICE 'Password: Admin123!';
    RAISE NOTICE 'User ID: 11111111-2222-3333-4444-555555555555';
    RAISE NOTICE '';
    RAISE NOTICE 'USER 2:';
    RAISE NOTICE 'Email: bibliothecaire@univ-test.fr';
    RAISE NOTICE 'Password: Biblio123!';
    RAISE NOTICE 'User ID: 22222222-3333-4444-5555-666666666666';
    RAISE NOTICE '';
    RAISE NOTICE 'USER 3:';
    RAISE NOTICE 'Email: etudiant@univ-test.fr';
    RAISE NOTICE 'Password: Student123!';
    RAISE NOTICE 'User ID: 33333333-4444-5555-6666-777777777777';
    RAISE NOTICE '';
    RAISE NOTICE 'USER 4:';
    RAISE NOTICE 'Email: utilisateur@univ-test.fr';
    RAISE NOTICE 'Password: User123!';
    RAISE NOTICE 'User ID: 44444444-5555-6666-7777-888888888888';
    RAISE NOTICE '';
    RAISE NOTICE 'IMPORTANT: Utilisez exactement ces User IDs !';
END $$;