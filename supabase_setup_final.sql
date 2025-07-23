-- =====================================================
-- SCRIPT SQL POUR SUPABASE - SYSTÈME DE BIBLIOTHÈQUE
-- VERSION FINALE COMPATIBLE
-- =====================================================

-- =====================================================
-- 1. SUPPRESSION DES TABLES EXISTANTES (OPTIONNEL)
-- =====================================================
-- Décommentez ces lignes si vous voulez recréer les tables
-- DROP TABLE IF EXISTS public.borrow_history CASCADE;
-- DROP TABLE IF EXISTS public.borrowers CASCADE;
-- DROP TABLE IF EXISTS public.documents CASCADE;
-- DROP TABLE IF EXISTS public.categories CASCADE;
-- DROP TABLE IF EXISTS public.authors CASCADE;
-- DROP TABLE IF EXISTS public.institution_members CASCADE;
-- DROP TABLE IF EXISTS public.institutions CASCADE;
-- DROP TABLE IF EXISTS public.profiles CASCADE;

-- =====================================================
-- 2. CRÉATION DES TABLES PRINCIPALES
-- =====================================================

-- Table des institutions
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    logo TEXT,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('school', 'university', 'library', 'other')) DEFAULT 'library',
    director VARCHAR(255),
    capacity INTEGER DEFAULT 1000,
    established_year VARCHAR(4),
    status VARCHAR(20) CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    subscription_plan VARCHAR(20) CHECK (subscription_plan IN ('basic', 'premium', 'enterprise')) DEFAULT 'basic',
    max_books INTEGER DEFAULT 1000,
    max_users INTEGER DEFAULT 100,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des profils utilisateurs (étend auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('super_admin', 'admin', 'librarian', 'user')) DEFAULT 'user',
    institution_id UUID REFERENCES public.institutions(id) ON DELETE SET NULL,
    avatar_url TEXT,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de liaison institution-membres
CREATE TABLE IF NOT EXISTS public.institution_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    role VARCHAR(20) CHECK (role IN ('admin', 'librarian', 'member')) DEFAULT 'member',
    status VARCHAR(20) CHECK (status IN ('active', 'pending', 'suspended')) DEFAULT 'active',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, institution_id)
);

-- Table des auteurs
CREATE TABLE IF NOT EXISTS public.authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    biography TEXT,
    birth_date DATE,
    nationality VARCHAR(100),
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    -- Champs de synchronisation
    local_id VARCHAR(50),
    remote_id VARCHAR(50),
    sync_status VARCHAR(20) CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')) DEFAULT 'synced',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des catégories
CREATE TABLE IF NOT EXISTS public.categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7), -- Code couleur hex
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    -- Champs de synchronisation
    local_id VARCHAR(50),
    remote_id VARCHAR(50),
    sync_status VARCHAR(20) CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')) DEFAULT 'synced',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des documents/livres
CREATE TABLE IF NOT EXISTS public.documents (
    id SERIAL PRIMARY KEY,
    -- Champs principaux requis
    auteur VARCHAR(255) NOT NULL,
    titre VARCHAR(500) NOT NULL,
    editeur VARCHAR(255) NOT NULL,
    lieu_edition VARCHAR(255),
    annee VARCHAR(4) NOT NULL,
    descripteurs TEXT, -- Mots-clés séparés par des virgules
    cote VARCHAR(100) NOT NULL, -- Référence de classification
    type VARCHAR(20) CHECK (type IN ('book', 'mémoire', 'thèse', 'rapport', 'article', 'autre')) DEFAULT 'book',
    
    -- Champs optionnels
    isbn VARCHAR(17),
    description TEXT,
    couverture TEXT, -- URL de la couverture
    
    -- Statut d'emprunt
    est_emprunte BOOLEAN DEFAULT false,
    emprunteur_id INTEGER,
    date_emprunt TIMESTAMP WITH TIME ZONE,
    date_retour_prevu TIMESTAMP WITH TIME ZONE,
    date_retour TIMESTAMP WITH TIME ZONE,
    nom_emprunteur VARCHAR(255),
    
    -- Métadonnées
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    author_id INTEGER REFERENCES public.authors(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
    
    -- Champs de synchronisation
    local_id VARCHAR(50),
    remote_id VARCHAR(50),
    sync_status VARCHAR(20) CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')) DEFAULT 'synced',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des emprunteurs
CREATE TABLE IF NOT EXISTS public.borrowers (
    id SERIAL PRIMARY KEY,
    type VARCHAR(20) CHECK (type IN ('student', 'staff')) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    matricule VARCHAR(50) UNIQUE NOT NULL,
    
    -- Spécifique aux étudiants
    classe VARCHAR(100),
    
    -- Spécifique au personnel
    cni_number VARCHAR(50),
    position VARCHAR(100),
    
    -- Informations de contact
    email VARCHAR(255),
    phone VARCHAR(20),
    
    -- Métadonnées
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    
    -- Champs de synchronisation
    local_id VARCHAR(50),
    remote_id VARCHAR(50),
    sync_status VARCHAR(20) CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')) DEFAULT 'synced',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table de l'historique des emprunts
CREATE TABLE IF NOT EXISTS public.borrow_history (
    id SERIAL PRIMARY KEY,
    document_id INTEGER REFERENCES public.documents(id) ON DELETE CASCADE,
    borrower_id INTEGER REFERENCES public.borrowers(id) ON DELETE CASCADE,
    borrow_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expected_return_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_return_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) CHECK (status IN ('active', 'returned', 'overdue')) DEFAULT 'active',
    notes TEXT,
    
    -- Métadonnées
    institution_id UUID REFERENCES public.institutions(id) ON DELETE CASCADE,
    
    -- Champs de synchronisation
    local_id VARCHAR(50),
    remote_id VARCHAR(50),
    sync_status VARCHAR(20) CHECK (sync_status IN ('synced', 'pending', 'conflict', 'error')) DEFAULT 'synced',
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    version INTEGER DEFAULT 1,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. FONCTION POUR GÉRER LES PROFILS AUTOMATIQUEMENT
-- =====================================================

-- Fonction déclenchée lors de l'inscription d'un utilisateur
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'Prénom'),
    COALESCE(NEW.raw_user_meta_data->>'last_name', 'Nom'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger pour créer automatiquement les profils
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- 4. CRÉATION DES INDEX
-- =====================================================

-- Index pour institutions
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_institutions_code ON public.institutions(code);
    CREATE INDEX IF NOT EXISTS idx_institutions_status ON public.institutions(status);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Index pour profiles
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
    CREATE INDEX IF NOT EXISTS idx_profiles_institution_id ON public.profiles(institution_id);
    CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- Index pour documents
DO $$ BEGIN
    CREATE INDEX IF NOT EXISTS idx_documents_institution_id ON public.documents(institution_id);
    CREATE INDEX IF NOT EXISTS idx_documents_auteur ON public.documents(auteur);
    CREATE INDEX IF NOT EXISTS idx_documents_titre ON public.documents(titre);
    CREATE INDEX IF NOT EXISTS idx_documents_cote ON public.documents(cote);
    CREATE INDEX IF NOT EXISTS idx_documents_est_emprunte ON public.documents(est_emprunte);
EXCEPTION WHEN duplicate_table THEN NULL;
END $$;

-- =====================================================
-- 5. TRIGGERS POUR UPDATED_AT
-- =====================================================

-- Fonction pour mettre à jour updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Créer les triggers seulement s'ils n'existent pas
DO $$ BEGIN
    CREATE TRIGGER update_institutions_updated_at 
        BEFORE UPDATE ON public.institutions 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TRIGGER update_profiles_updated_at 
        BEFORE UPDATE ON public.profiles 
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- 6. POLITIQUES RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Activer RLS sur toutes les tables
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institution_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.borrow_history ENABLE ROW LEVEL SECURITY;

-- Politiques temporaires permissives pour les tests
-- ATTENTION: En production, configurez des politiques plus restrictives

-- Politiques pour institutions
DROP POLICY IF EXISTS "Enable read access for all users" ON public.institutions;
CREATE POLICY "Enable read access for all users" ON public.institutions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users" ON public.institutions;
CREATE POLICY "Enable insert for authenticated users" ON public.institutions FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.institutions;
CREATE POLICY "Enable update for authenticated users" ON public.institutions FOR UPDATE USING (auth.role() = 'authenticated');

-- Politiques pour profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Politiques permissives pour les autres tables (à ajuster en production)
DROP POLICY IF EXISTS "Enable all for authenticated users on institution_members" ON public.institution_members;
CREATE POLICY "Enable all for authenticated users on institution_members" ON public.institution_members FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users on documents" ON public.documents;
CREATE POLICY "Enable all for authenticated users on documents" ON public.documents FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users on authors" ON public.authors;
CREATE POLICY "Enable all for authenticated users on authors" ON public.authors FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users on categories" ON public.categories;
CREATE POLICY "Enable all for authenticated users on categories" ON public.categories FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users on borrowers" ON public.borrowers;
CREATE POLICY "Enable all for authenticated users on borrowers" ON public.borrowers FOR ALL USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable all for authenticated users on borrow_history" ON public.borrow_history;
CREATE POLICY "Enable all for authenticated users on borrow_history" ON public.borrow_history FOR ALL USING (auth.role() = 'authenticated');

-- =====================================================
-- 7. INSERTION DES DONNÉES DE TEST
-- =====================================================

-- Nettoyer les données existantes
DELETE FROM public.borrow_history;
DELETE FROM public.borrowers;
DELETE FROM public.documents;
DELETE FROM public.categories;
DELETE FROM public.authors;
DELETE FROM public.institution_members;
DELETE FROM public.institutions;

-- Institutions de test
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
), (
    '22222222-2222-2222-2222-222222222222',
    'LIB001',
    'Bibliothèque Municipale de Test',
    '456 Rue des Livres',
    'Lyon',
    'France',
    '+33 4 56 78 90 12',
    'contact@biblio-test.fr',
    'https://www.biblio-test.fr',
    'Bibliothèque municipale de test',
    'library',
    'Jean Martin',
    2000,
    '1920',
    'active',
    'basic',
    5000,
    200
);

-- Catégories de test
INSERT INTO public.categories (name, description, color, institution_id) VALUES
('Informatique', 'Livres sur l''informatique et la programmation', '#3498db', '11111111-1111-1111-1111-111111111111'),
('Littérature', 'Romans, nouvelles et œuvres littéraires', '#e74c3c', '11111111-1111-1111-1111-111111111111'),
('Sciences', 'Livres scientifiques et techniques', '#2ecc71', '11111111-1111-1111-1111-111111111111'),
('Histoire', 'Livres d''histoire et biographies', '#f39c12', '11111111-1111-1111-1111-111111111111'),
('Philosophie', 'Ouvrages philosophiques et de réflexion', '#9b59b6', '11111111-1111-1111-1111-111111111111');

-- Auteurs de test
INSERT INTO public.authors (name, biography, birth_date, nationality, institution_id) VALUES
('Donald Knuth', 'Informaticien américain, auteur de "The Art of Computer Programming"', '1938-01-10', 'Américaine', '11111111-1111-1111-1111-111111111111'),
('Robert C. Martin', 'Développeur logiciel et auteur, connu pour "Clean Code"', '1952-12-05', 'Américaine', '11111111-1111-1111-1111-111111111111'),
('Victor Hugo', 'Écrivain français du XIXe siècle, auteur des "Misérables"', '1802-02-26', 'Française', '11111111-1111-1111-1111-111111111111'),
('Albert Einstein', 'Physicien théoricien allemand, prix Nobel de physique', '1879-03-14', 'Allemande', '11111111-1111-1111-1111-111111111111'),
('Simone de Beauvoir', 'Écrivaine, philosophe et féministe française', '1908-01-09', 'Française', '11111111-1111-1111-1111-111111111111');

-- Documents de test
INSERT INTO public.documents (
    auteur, titre, editeur, lieu_edition, annee, descripteurs, cote, type,
    isbn, description, couverture, est_emprunte, institution_id, author_id, category_id
) VALUES
('Donald Knuth', 'The Art of Computer Programming, Volume 1', 'Addison-Wesley', 'Reading, MA', '1997',
 'informatique, algorithmes, programmation', '004.01 KNU', 'book', '978-0201896831',
 'Volume fondateur sur les algorithmes et structures de données',
 'https://images-na.ssl-images-amazon.com/images/I/41d+gKGqWQL._SX379_BO1,204,203,200_.jpg',
 false, '11111111-1111-1111-1111-111111111111', 1, 1),

('Robert C. Martin', 'Clean Code: A Handbook of Agile Software Craftsmanship', 'Prentice Hall', 'Upper Saddle River, NJ', '2008',
 'développement, bonnes pratiques, code propre', '005.1 MAR', 'book', '978-0132350884',
 'Guide pour écrire du code propre et maintenable',
 'https://images-na.ssl-images-amazon.com/images/I/41jEbK-jG+L._SX374_BO1,204,203,200_.jpg',
 false, '11111111-1111-1111-1111-111111111111', 2, 1),

('Victor Hugo', 'Les Misérables', 'Gallimard', 'Paris', '1862',
 'littérature, roman, France, XIXe siècle', '843 HUG', 'book', '978-2070409228',
 'Chef-d''œuvre de la littérature française',
 'https://images-na.ssl-images-amazon.com/images/I/51XiAmHpGEL._SX195_.jpg',
 true, '11111111-1111-1111-1111-111111111111', 3, 2),

('Albert Einstein', 'La Relativité restreinte et générale', 'Dunod', 'Paris', '1916',
 'physique, relativité, Einstein', '530.11 EIN', 'book', '978-2100547357',
 'Explication accessible de la théorie de la relativité',
 'https://images-na.ssl-images-amazon.com/images/I/41nQHQtKJeL._SX312_BO1,204,203,200_.jpg',
 false, '11111111-1111-1111-1111-111111111111', 4, 3),

('Simone de Beauvoir', 'Le Deuxième Sexe', 'Gallimard', 'Paris', '1949',
 'philosophie, féminisme, société', '305.42 BEA', 'book', '978-2070323548',
 'Œuvre fondatrice du féminisme moderne',
 'https://images-na.ssl-images-amazon.com/images/I/51QJ7XHPS7L._SX195_.jpg',
 false, '11111111-1111-1111-1111-111111111111', 5, 5);

-- Emprunteurs de test
INSERT INTO public.borrowers (
    type, first_name, last_name, matricule, classe, cni_number, position,
    email, phone, institution_id
) VALUES
('student', 'Marie', 'Dubois', 'STU001', 'L3 Informatique', null, null,
 'marie.dubois@etudiant.univ-test.fr', '+33 6 12 34 56 78', '11111111-1111-1111-1111-111111111111'),

('student', 'Pierre', 'Martin', 'STU002', 'M1 Littérature', null, null,
 'pierre.martin@etudiant.univ-test.fr', '+33 6 23 45 67 89', '11111111-1111-1111-1111-111111111111'),

('staff', 'Dr. Sophie', 'Lefevre', 'STAFF001', null, '1234567890123', 'Professeure de Physique',
 'sophie.lefevre@univ-test.fr', '+33 1 34 56 78 90', '11111111-1111-1111-1111-111111111111'),

('staff', 'Jean', 'Moreau', 'STAFF002', null, '2345678901234', 'Bibliothécaire',
 'jean.moreau@univ-test.fr', '+33 1 45 67 89 01', '11111111-1111-1111-1111-111111111111');

-- Historique des emprunts de test
INSERT INTO public.borrow_history (
    document_id, borrower_id, borrow_date, expected_return_date, actual_return_date,
    status, notes, institution_id
) VALUES
(3, 2, NOW() - INTERVAL '10 days', NOW() + INTERVAL '20 days', null,
 'active', 'Emprunt pour mémoire de littérature', '11111111-1111-1111-1111-111111111111'),

(2, 1, NOW() - INTERVAL '45 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '10 days',
 'returned', 'Livre rendu en bon état', '11111111-1111-1111-1111-111111111111'),

(1, 3, NOW() - INTERVAL '60 days', NOW() - INTERVAL '30 days', null,
 'overdue', 'Emprunt en retard - relance nécessaire', '11111111-1111-1111-1111-111111111111');

-- =====================================================
-- 8. FONCTIONS UTILITAIRES
-- =====================================================

-- Fonction pour obtenir les statistiques d'une institution
CREATE OR REPLACE FUNCTION get_institution_stats(institution_uuid UUID)
RETURNS JSON AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_documents', (SELECT COUNT(*) FROM public.documents WHERE institution_id = institution_uuid AND deleted_at IS NULL),
        'borrowed_documents', (SELECT COUNT(*) FROM public.documents WHERE institution_id = institution_uuid AND est_emprunte = true AND deleted_at IS NULL),
        'available_documents', (SELECT COUNT(*) FROM public.documents WHERE institution_id = institution_uuid AND est_emprunte = false AND deleted_at IS NULL),
        'total_authors', (SELECT COUNT(*) FROM public.authors WHERE institution_id = institution_uuid AND deleted_at IS NULL),
        'total_categories', (SELECT COUNT(*) FROM public.categories WHERE institution_id = institution_uuid AND deleted_at IS NULL),
        'total_borrowers', (SELECT COUNT(*) FROM public.borrowers WHERE institution_id = institution_uuid AND deleted_at IS NULL),
        'total_students', (SELECT COUNT(*) FROM public.borrowers WHERE institution_id = institution_uuid AND type = 'student' AND deleted_at IS NULL),
        'total_staff', (SELECT COUNT(*) FROM public.borrowers WHERE institution_id = institution_uuid AND type = 'staff' AND deleted_at IS NULL),
        'overdue_documents', (SELECT COUNT(*) FROM public.borrow_history WHERE institution_id = institution_uuid AND status = 'overdue' AND deleted_at IS NULL)
    ) INTO stats;
    
    RETURN stats;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 9. VUES UTILES
-- =====================================================

-- Vue pour les documents avec informations complètes
CREATE OR REPLACE VIEW documents_with_details AS
SELECT 
    d.*,
    a.name as author_name,
    c.name as category_name,
    c.color as category_color,
    i.name as institution_name,
    CASE 
        WHEN d.est_emprunte THEN (
            SELECT json_build_object(
                'borrower_name', b.first_name || ' ' || b.last_name,
                'borrower_type', b.type,
                'borrow_date', bh.borrow_date,
                'expected_return_date', bh.expected_return_date
            )
            FROM public.borrow_history bh
            JOIN public.borrowers b ON b.id = bh.borrower_id
            WHERE bh.document_id = d.id AND bh.status = 'active'
            LIMIT 1
        )
        ELSE NULL
    END as current_borrow_info
FROM public.documents d
LEFT JOIN public.authors a ON a.id = d.author_id
LEFT JOIN public.categories c ON c.id = d.category_id
LEFT JOIN public.institutions i ON i.id = d.institution_id
WHERE d.deleted_at IS NULL;

-- Vue pour l'historique des emprunts avec détails
CREATE OR REPLACE VIEW borrow_history_with_details AS
SELECT 
    bh.*,
    d.titre as document_title,
    d.auteur as document_author,
    d.cote as document_cote,
    b.first_name || ' ' || b.last_name as borrower_name,
    b.type as borrower_type,
    b.matricule as borrower_matricule,
    i.name as institution_name
FROM public.borrow_history bh
JOIN public.documents d ON d.id = bh.document_id
JOIN public.borrowers b ON b.id = bh.borrower_id
JOIN public.institutions i ON i.id = bh.institution_id
WHERE bh.deleted_at IS NULL;

-- =====================================================
-- 10. MESSAGE DE SUCCÈS
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'INSTALLATION TERMINÉE AVEC SUCCÈS !';
    RAISE NOTICE '===============================================';
    RAISE NOTICE 'Tables créées avec données de test';
    RAISE NOTICE 'Trigger automatique pour profils configuré';
    RAISE NOTICE '';
    RAISE NOTICE 'ÉTAPES SUIVANTES :';
    RAISE NOTICE '1. Allez dans Authentication > Users';
    RAISE NOTICE '2. Créez les utilisateurs suivants :';
    RAISE NOTICE '';
    RAISE NOTICE 'UTILISATEURS À CRÉER :';
    RAISE NOTICE '- admin@univ-test.fr (mot de passe: Admin123!)';
    RAISE NOTICE '  Raw user meta data: {"first_name":"Marie","last_name":"Admin","role":"admin"}';
    RAISE NOTICE '';
    RAISE NOTICE '- bibliothecaire@univ-test.fr (mot de passe: Biblio123!)';
    RAISE NOTICE '  Raw user meta data: {"first_name":"Jean","last_name":"Bibliothécaire","role":"librarian"}';
    RAISE NOTICE '';
    RAISE NOTICE '- etudiant@univ-test.fr (mot de passe: Student123!)';
    RAISE NOTICE '  Raw user meta data: {"first_name":"Pierre","last_name":"Étudiant","role":"user"}';
    RAISE NOTICE '';
    RAISE NOTICE '- utilisateur@univ-test.fr (mot de passe: User123!)';
    RAISE NOTICE '  Raw user meta data: {"first_name":"Sophie","last_name":"Utilisateur","role":"user"}';
    RAISE NOTICE '';
    RAISE NOTICE 'CODES INSTITUTION :';
    RAISE NOTICE '- UNIV001 (Université de Test)';
    RAISE NOTICE '- LIB001 (Bibliothèque Municipale)';
    RAISE NOTICE '';
    RAISE NOTICE 'Les profils seront créés automatiquement !';
    RAISE NOTICE '===============================================';
END $$;