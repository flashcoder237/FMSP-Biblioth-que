# Guide de Résolution des Problèmes d'Authentification

## Problème Actuel
L'authentification avec les utilisateurs de test (admin@univ-test.fr, etc.) ne fonctionne pas.

## Solution Étape par Étape

### Étape 1: Diagnostic
1. Connectez-vous à votre tableau de bord Supabase
2. Allez dans **SQL Editor**
3. Exécutez le script `diagnostic_auth.sql` pour voir l'état actuel

### Étape 2: Correction des Problèmes
1. Dans **SQL Editor**, exécutez le script `fix_auth_issues.sql`
2. Ce script va :
   - Créer des politiques RLS temporaires permissives
   - Corriger le trigger de création de profils
   - Créer les profils manquants
   - Confirmer les emails automatiquement

### Étape 3: Créer les Utilisateurs (si nécessaire)
Si les utilisateurs n'existent pas dans `auth.users` :

1. Allez dans **Authentication > Users**
2. Cliquez **"Add User"** pour chaque utilisateur
3. Utilisez ces informations exactes :

#### Utilisateur 1 - Admin
- **Email**: `admin@univ-test.fr`
- **Password**: `Admin123!`
- **Email Confirm**: ✅ Coché
- **Raw User Meta Data** (JSON):
```json
{"first_name":"Marie","last_name":"Admin","role":"admin"}
```

#### Utilisateur 2 - Bibliothécaire
- **Email**: `bibliothecaire@univ-test.fr`
- **Password**: `Biblio123!`
- **Email Confirm**: ✅ Coché
- **Raw User Meta Data** (JSON):
```json
{"first_name":"Jean","last_name":"Bibliothécaire","role":"librarian"}
```

#### Utilisateur 3 - Étudiant
- **Email**: `etudiant@univ-test.fr`
- **Password**: `Student123!`
- **Email Confirm**: ✅ Coché
- **Raw User Meta Data** (JSON):
```json
{"first_name":"Pierre","last_name":"Étudiant","role":"user"}
```

#### Utilisateur 4 - Utilisateur
- **Email**: `utilisateur@univ-test.fr`
- **Password**: `User123!`
- **Email Confirm**: ✅ Coché
- **Raw User Meta Data** (JSON):
```json
{"first_name":"Sophie","last_name":"Utilisateur","role":"user"}
```

### Étape 4: Vérification
1. Exécutez à nouveau `diagnostic_auth.sql`
2. Vérifiez que :
   - Les utilisateurs existent dans `auth.users`
   - Les profils existent dans `public.profiles`
   - Les membres d'institution sont créés

### Étape 5: Test de Connexion
1. Lancez votre application
2. Testez la connexion avec : `admin@univ-test.fr` / `Admin123!`

## Points Importants

### Causes Possibles du Problème
1. **Utilisateurs inexistants** : Les utilisateurs n'ont pas été créés dans Supabase Auth
2. **Emails non confirmés** : Les emails doivent être confirmés pour la connexion
3. **Profils manquants** : Le trigger n'a pas créé les profils automatiquement
4. **Politiques RLS trop restrictives** : Les politiques empêchent l'accès aux données

### Métadonnées Importantes
- **Institution par défaut** : `11111111-1111-1111-1111-111111111111`
- **Code institution** : `UNIV001`
- Le **Raw User Meta Data** est crucial pour créer les profils avec les bonnes informations

### Debug Supplémentaire
Si les problèmes persistent :
1. Vérifiez les logs dans **Logs > Auth**
2. Vérifiez que votre clé API Supabase est correcte
3. Vérifiez que l'URL Supabase est correcte
4. Testez avec un nouvel utilisateur créé manuellement

## Scripts Disponibles
- `diagnostic_auth.sql` : Diagnostic complet
- `fix_auth_issues.sql` : Correction automatique
- `supabase_setup_final.sql` : Setup complet avec trigger automatique
- `create_test_users.sql` : Création manuelle des profils