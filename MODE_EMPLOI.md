# 📚 APPLICATION BIBLIOTHÈQUE - MODE D'EMPLOI

## 🎯 FONCTIONNALITÉS PRINCIPALES

### ✅ **Gestion complète des documents** avec tous les champs requis :
- **AUTEUR** (obligatoire) - avec autocomplétion
- **TITRE** (obligatoire)
- **EDITEUR** (obligatoire) 
- **LIEU D'ÉDITION** (obligatoire)
- **ANNÉE** (obligatoire) - avec validation
- **DESCRIPTEURS** (obligatoire) - mots-clés pour classification
- **COTE** (obligatoire) - code unique avec génération automatique
- **ISBN** (optionnel)
- **Description** (optionnel)
- **Couverture** (optionnel)

### 🔄 **Fonctionnement hors ligne/en ligne**
- **Mode hors ligne** : Toutes les données sont sauvegardées localement dans SQLite
- **Mode en ligne** : Synchronisation automatique avec le cloud
- **Synchronisation intelligente** : Les modifications sont automatiquement synchronisées à la reconnexion

## 🚀 **DÉMARRAGE RAPIDE**

### Lancer l'application :
```bash
npm run dev    # Mode développement
# ou
npm start      # Mode production (après npm run build)
```

### Première utilisation :
1. L'application se lance avec l'écran d'authentification
2. **MODE DÉVELOPPEMENT** : Cliquez sur "Connexion rapide (Dev)" pour accès immédiat
3. **MODE PRODUCTION** : Configurez votre institution ou connectez-vous
4. Commencez à ajouter vos documents !

### 🚀 **CONNEXION DÉVELOPPEMENT** (Mode dev uniquement) :
Un bouton **"Connexion rapide (Dev)"** orange apparaît sous le formulaire de connexion :
- **Email** : `admin@bibliotheque-dev.local`  
- **Mot de passe** : `dev123456`
- **Code établissement** : `DEV-BIBLIO`
- **Clic unique** pour accès immédiat sans saisie !

## 🎨 **INTERFACE UTILISATEUR**

### **Barre de titre** (en haut) :
- **Logo et titre** de l'application
- **Boutons de contrôle** : minimiser, maximiser, fermer (coin droit)

### **Barre latérale** (gauche) :
- **Tableau de bord** - vue d'ensemble
- **Ma Collection** - parcourir tous les documents
- **Nouveau Document** - formulaire d'ajout
- **Emprunts Actifs** - documents empruntés
- **Emprunteurs** - gestion des utilisateurs  
- **Historique** - historique complet
- **Paramètres** - configuration

### 🎯 **Terminologie mise à jour** :
- ✅ **"Documents"** au lieu de "Livres"
- ✅ **"Collection de documents"** 
- ✅ **"Documents empruntés"**
- ✅ **"Documents disponibles"**
- ✅ Interface cohérente dans toute l'application

### **Zone principale** (centre) :
- Contenu selon la section sélectionnée
- Formulaires de saisie intuitifs
- Listes et tableaux avec recherche

### **Barre de synchronisation** (bas) :
- **Statut en temps réel** : en ligne/hors ligne
- **Dernière synchronisation**
- **Opérations en attente**
- **Bouton de synchronisation manuelle**
- **Détails des erreurs** (si nécessaire)

## 📝 **AJOUTER UN DOCUMENT**

1. Cliquez sur **"Ajouter un document"** dans la barre latérale
2. Remplissez les **champs obligatoires** :
   - Auteur, Titre, Éditeur, Lieu d'édition, Année, Descripteurs
3. Générez automatiquement la **COTE** ou saisissez-la manuellement
4. Ajoutez les **informations optionnelles** si nécessaire
5. Cliquez **"Ajouter"**

### **Génération automatique de la COTE** :
- Cliquez sur le bouton **"+"** à côté du champ COTE
- Le système génère automatiquement un code basé sur :
  - Catégorie (premiers mots des descripteurs)
  - Auteur (premières lettres)
  - Année
  - Numéro unique

## 🔄 **SYNCHRONISATION**

### **Fonctionnement automatique** :
- Vérification réseau toutes les 30 secondes
- Synchronisation automatique toutes les 5 minutes
- Synchronisation immédiate à la reconnexion

### **Indicateurs visuels** :
- 🟢 **Vert** : Synchronisé et en ligne
- 🟠 **Orange** : Opérations en attente
- 🔴 **Rouge** : Erreurs de synchronisation  
- 🔴 **Gris** : Mode hors ligne

### **Actions manuelles** :
- Cliquez sur le **bouton de synchronisation** pour forcer une sync
- Consultez les **détails** en cliquant sur la barre de statut
- **Réessayez** les opérations échouées individuellement

## 🔧 **RÉSOLUTION DES PROBLÈMES**

### **Boutons de fermeture invisibles** :
- Vérifiez que la barre de titre est affichée en haut
- Les boutons se trouvent dans le coin supérieur droit
- Survolez la zone pour voir les boutons apparaître

### **Problèmes de synchronisation** :
- Vérifiez votre connexion Internet
- Consultez la barre de statut pour plus de détails
- Utilisez le bouton "Réessayer" si nécessaire

### **Données non sauvegardées** :
- Pas de panique ! Tout est sauvegardé localement
- Les données seront synchronisées à la prochaine connexion
- Vérifiez la barre de statut pour le nombre d'opérations en attente

## 📱 **CONSEILS D'UTILISATION**

### **Bonnes pratiques** :
- Remplissez toujours les champs obligatoires
- Utilisez des descripteurs cohérents pour faciliter la recherche
- Vérifiez régulièrement la synchronisation
- Sauvegardez périodiquement vos données

### **Recherche efficace** :
- Utilisez les descripteurs comme mots-clés
- La recherche fonctionne sur tous les champs
- Filtrez par auteur, année, ou catégorie

### **Gestion hors ligne** :
- L'application fonctionne parfaitement sans Internet
- Toutes les modifications sont conservées
- Synchronisation automatique dès la reconnexion

## 📞 **SUPPORT**

Si vous rencontrez des problèmes :
1. Vérifiez ce guide en premier
2. Consultez les messages dans la console (F12)
3. Redémarrez l'application si nécessaire
4. Contactez le support technique

---

## 🎉 **FÉLICITATIONS !**

Votre application de bibliothèque est maintenant **complètement opérationnelle** avec :
- ✅ Fonctionnement hors ligne/en ligne
- ✅ Tous les champs requis (AUTEUR, TITRE, EDITEUR, LIEU D'EDITION, ANNEE, DESCRIPTEURS, COTE)
- ✅ Synchronisation automatique
- ✅ Interface moderne et intuitive
- ✅ Contrôles de fenêtre fonctionnels

**L'application est AU TOP comme demandé !** 🚀