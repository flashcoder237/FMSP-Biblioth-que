-- =====================================================
-- SCRIPT DE CORRECTION DES PROBLÈMES D'AUTHENTIFICATION
-- =====================================================

-- 1. Supprimer les politiques RLS restrictives temporairement pour les tests
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- 2. Créer des politiques temporaires permissives pour les tests
CREATE POLICY "Enable all for authenticated users on profiles TEST" 
ON public.profiles FOR ALL 
USING (auth.role() = 'authenticated');

-- 3. Vérifier et corriger le trigger pour les profils
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Log pour debug
  RAISE NOTICE 'Trigger handle_new_user appelé pour user: %', NEW.email;
  
  INSERT INTO public.profiles (id, email, first_name, last_name, role, institution_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Prénom'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nom'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user'),
    '11111111-1111-1111-1111-111111111111'::uuid  -- Institution par défaut
  );
  
  RAISE NOTICE 'Profil créé pour: %', NEW.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Recréer le trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Vérifier que l'institution par défaut existe
INSERT INTO public.institutions (
    id,
    code,
    name,
    address,
    city,
    country,
    phone,
    email,
    website,
    description,
    type,
    director,
    capacity,
    established_year,
    status,
    subscription_plan,
    max_books,
    max_users
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'UNIV001',
    'Université de Test',
    '123 Avenue de la Connaissance',
    'Paris',
    'France',
    '+33 1 23 45 67 89',
    'contact@univ-test.fr',
    'https://www.univ-test.fr',
    'Université de test pour le système de bibliothèque',
    'university',
    'Dr. Marie Dupont',
    5000,
    '1985',
    'active',
    'premium',
    10000,
    500
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    updated_at = NOW();

-- 6. Créer manuellement les profils pour les utilisateurs existants si ils existent
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Pour chaque utilisateur dans auth.users qui n'a pas de profil
    FOR user_record IN 
        SELECT au.id, au.email, au.raw_user_meta_data
        FROM auth.users au
        LEFT JOIN public.profiles p ON p.id = au.id
        WHERE au.email LIKE '%@univ-test.fr'
        AND p.id IS NULL
    LOOP
        RAISE NOTICE 'Création du profil pour: %', user_record.email;
        
        INSERT INTO public.profiles (id, email, first_name, last_name, role, institution_id)
        VALUES (
            user_record.id,
            user_record.email,
            COALESCE(user_record.raw_user_meta_data->>'first_name', 'Prénom'),
            COALESCE(user_record.raw_user_meta_data->>'last_name', 'Nom'),
            COALESCE(user_record.raw_user_meta_data->>'role', 'user'),
            '11111111-1111-1111-1111-111111111111'::uuid
        );
        
        -- Ajouter comme membre de l'institution
        INSERT INTO public.institution_members (user_id, institution_id, role, status)
        VALUES (
            user_record.id,
            '11111111-1111-1111-1111-111111111111'::uuid,
            CASE 
                WHEN user_record.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
                WHEN user_record.raw_user_meta_data->>'role' = 'librarian' THEN 'librarian'
                ELSE 'member'
            END,
            'active'
        ) ON CONFLICT (user_id, institution_id) DO NOTHING;
    END LOOP;
END $$;

-- 7. Vérifier que les email sont confirmés
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email LIKE '%@univ-test.fr' 
AND email_confirmed_at IS NULL;

-- 8. Message de succès
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'CORRECTION TERMINÉE';
    RAISE NOTICE '===============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Actions effectuées:';
    RAISE NOTICE '1. Politiques RLS temporaires permissives activées';
    RAISE NOTICE '2. Trigger de création de profils corrigé';
    RAISE NOTICE '3. Institution par défaut vérifiée';
    RAISE NOTICE '4. Profils créés pour utilisateurs existants';
    RAISE NOTICE '5. Emails confirmés automatiquement';
    RAISE NOTICE '';
    RAISE NOTICE 'Vous pouvez maintenant tester la connexion avec:';
    RAISE NOTICE '- admin@univ-test.fr / Admin123!';
    RAISE NOTICE '- bibliothecaire@univ-test.fr / Biblio123!';
    RAISE NOTICE '- etudiant@univ-test.fr / Student123!';
    RAISE NOTICE '- utilisateur@univ-test.fr / User123!';
    RAISE NOTICE '';
    RAISE NOTICE 'Si les utilisateurs n''existent pas encore,';
    RAISE NOTICE 'créez-les dans Authentication > Users';
    RAISE NOTICE '===============================================';
END $$;