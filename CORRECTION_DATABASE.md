# Correction de l'Erreur SQLite: "no such column: bh.documentId"

## 🐛 Problème Détecté

**Erreur**: `SQLITE_ERROR: no such column: bh.documentId`

**Cause**: L'ancienne base de données SQLite a été créée avec un schéma incompatible ou corrompu. La table `borrow_history` n'a pas les bonnes colonnes.

## ✅ Solutions Mises en Place

### 1. **Migration Automatique**
Le système détecte maintenant automatiquement les problèmes de schéma et corrige la base de données au démarrage :

- ✅ Vérification de l'existence de la table `borrow_history`
- ✅ Validation des colonnes requises (`documentId`, `borrowerId`, etc.)
- ✅ Recréation automatique si le schéma est incorrect
- ✅ Messages de log pour le debugging

### 2. **Bouton de Réinitialisation** 
Un nouveau bouton a été ajouté dans les paramètres :

**Accès**: `Paramètres > Base de données > Réinitialiser DB`

- 🔧 Supprime toutes les données corrompues
- 🔧 Recrée les tables avec le bon schéma
- 🔧 Redémarre l'application automatiquement

### 3. **Amélioration de la Robustesse**
- Gestion d'erreur améliorée dans `getBorrowHistory()`
- Logs détaillés pour diagnostiquer les problèmes
- Transactions SQLite pour éviter la corruption
- Validation du schéma à chaque démarrage

## 🔧 Comment Résoudre l'Erreur

### Option 1: Réinitialisation Automatique (Recommandée)
1. Démarrer l'application
2. Les migrations automatiques corrigeront le problème
3. Consulter les logs de la console pour confirmation

### Option 2: Réinitialisation Manuelle
1. Démarrer l'application
2. Naviguer vers `Paramètres` (bouton dans le sidebar)
3. Aller dans l'onglet `Base de données`
4. Cliquer sur `Réinitialiser DB`
5. Confirmer l'action
6. L'application redémarre avec une base propre

### Option 3: Suppression Complète (Si problème persiste)
1. Aller dans `Paramètres > Base de données`
2. Cliquer sur `Supprimer tout`
3. Taper "CONFIRMER" pour confirmer
4. L'application redémarre avec une base vierge

## 📋 Schéma Correct de la Table borrow_history

```sql
CREATE TABLE borrow_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  documentId INTEGER NOT NULL,           -- ✅ Colonne corrigée
  borrowerId INTEGER NOT NULL,
  borrowDate DATETIME NOT NULL,
  expectedReturnDate DATETIME NOT NULL,
  actualReturnDate DATETIME,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  -- Métadonnées de synchronisation
  localId TEXT UNIQUE,
  remoteId TEXT,
  syncStatus TEXT DEFAULT 'pending',
  lastModified DATETIME DEFAULT CURRENT_TIMESTAMP,
  version INTEGER DEFAULT 1,
  deletedAt DATETIME,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- Clés étrangères
  FOREIGN KEY (documentId) REFERENCES documents(id),
  FOREIGN KEY (borrowerId) REFERENCES borrowers(id)
);
```

## 🧪 Validation de la Correction

Après correction, vous devriez pouvoir :

1. ✅ Accéder à l'historique des emprunts sans erreur
2. ✅ Emprunter des documents normalement
3. ✅ Retourner des documents
4. ✅ Voir les statistiques mises à jour
5. ✅ Naviguer dans tous les menus sans erreur SQLite

## 📝 Logs de Validation

Vérifiez ces messages dans la console pour confirmer la correction :

```
✅ Table borrow_history créée avec succès
✅ Table borrow_history recréée avec succès  
✅ Schéma de base de données validé
```

## 🚨 Prévention Future

Le système inclut maintenant :
- **Migrations automatiques** à chaque démarrage
- **Validation de schéma** robuste
- **Gestion d'erreur** améliorée
- **Boutons de réparation** dans l'interface

**Cette erreur ne devrait plus se reproduire !** 🎉

---

*Si le problème persiste après ces étapes, vérifiez les permissions de fichier sur la base de données SQLite ou contactez le support.*