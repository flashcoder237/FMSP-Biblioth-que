import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users,
  Plus,
  X, 
  Save, 
  Edit3,
  Mail,
  Shield,
  Building,
  Eye,
  EyeOff,
  Lock,
  Check,
  AlertCircle,
  Trash2,
  UserCheck,
  UserX
} from 'lucide-react';
import { MicroButton, MicroCard } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';
import { LocalAuthService } from '../services/LocalAuthService';
import { UnifiedUser, UnifiedInstitution } from '../types/UnifiedTypes';

interface InstitutionUserManagementProps {
  currentUser: UnifiedUser | null;
  currentInstitution: UnifiedInstitution | null;
  appMode: 'offline' | 'online';
  onClose: () => void;
}

// Utilisons le type LocalUser existant mais avec des propriétés étendues pour l'affichage
interface DisplayUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'librarian' | 'user';
  institutionCode: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const InstitutionUserManagement: React.FC<InstitutionUserManagementProps> = ({ 
  currentUser,
  currentInstitution,
  appMode,
  onClose
}) => {
  const { success, error } = useQuickToast();
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingUser, setEditingUser] = useState<DisplayUser | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const [newUserForm, setNewUserForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user' as 'admin' | 'librarian' | 'user',
    password: '',
    confirmPassword: ''
  });

  // Charger les utilisateurs de l'institution
  useEffect(() => {
    loadInstitutionUsers();
  }, []);

  const loadInstitutionUsers = () => {
    if (appMode === 'offline' && currentInstitution?.code) {
      try {
        const allUsers = LocalAuthService.getUsers();
        const institutionUsers = allUsers
          .filter(user => user.institutionCode === currentInstitution.code)
          .map(user => ({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role as 'admin' | 'librarian' | 'user',
            institutionCode: user.institutionCode,
            isActive: true, // Par défaut, tous les utilisateurs sont actifs
            createdAt: new Date().toISOString(), // Valeur par défaut
            lastLogin: user.lastLogin
          }));
        setUsers(institutionUsers);
      } catch (err) {
        console.error('Erreur lors du chargement des utilisateurs:', err);
        error('Erreur de chargement', 'Erreur lors du chargement des utilisateurs');
      }
    }
  };

  const handleCreateUser = async () => {
    if (!currentInstitution?.code) {
      error('Erreur', 'Code d\'institution manquant');
      return;
    }

    // Validation
    if (!newUserForm.firstName.trim() || !newUserForm.lastName.trim() || !newUserForm.email.trim()) {
      error('Champs manquants', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (newUserForm.password.length < 4) {
      error('Mot de passe trop court', 'Le mot de passe doit contenir au moins 4 caractères');
      return;
    }

    if (newUserForm.password !== newUserForm.confirmPassword) {
      error('Mots de passe différents', 'Les mots de passe ne correspondent pas');
      return;
    }

    // Vérifier si l'email existe déjà
    const existingUsers = LocalAuthService.getUsers();
    if (existingUsers.some(user => user.email.toLowerCase() === newUserForm.email.toLowerCase())) {
      error('Email déjà utilisé', 'Un utilisateur avec cet email existe déjà');
      return;
    }

    setIsLoading(true);
    try {
      const newUser = LocalAuthService.addUser({
        email: newUserForm.email,
        password: newUserForm.password,
        firstName: newUserForm.firstName,
        lastName: newUserForm.lastName,
        role: newUserForm.role,
        institutionCode: currentInstitution.code,
        preferences: {
          rememberMe: false,
          autoLogin: false,
          theme: 'light'
        }
      });

      if (newUser) {
        success('Utilisateur créé', `Utilisateur ${newUserForm.firstName} ${newUserForm.lastName} créé avec succès`);
        setNewUserForm({
          firstName: '',
          lastName: '',
          email: '',
          role: 'user',
          password: '',
          confirmPassword: ''
        });
        setShowCreateForm(false);
        loadInstitutionUsers();
      }
    } catch (err) {
      console.error('Erreur lors de la création de l\'utilisateur:', err);
      error('Erreur de création', 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: DisplayUser) => {
    // Fonctionnalité simplifiée - pour l'instant, on ne peut que désactiver visuellement
    setIsLoading(true);
    try {
      // Mise à jour locale de l'état de l'utilisateur
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      );
      setUsers(updatedUsers);
      
      success('Statut modifié', `Utilisateur ${user.firstName} ${user.lastName} ${!user.isActive ? 'activé' : 'désactivé'}`);
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      error('Erreur de modification', 'Erreur lors de la modification du statut');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (user: DisplayUser) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${user.firstName} ${user.lastName} ?`)) {
      return;
    }

    if (user.id === currentUser?.id) {
      error('Action interdite', 'Vous ne pouvez pas supprimer votre propre compte');
      return;
    }

    setIsLoading(true);
    try {
      const allUsers = LocalAuthService.getUsers();
      const updatedUsers = allUsers.filter(u => u.id !== user.id);
      LocalAuthService.saveUsers(updatedUsers);
      
      success('Utilisateur supprimé', `Utilisateur ${user.firstName} ${user.lastName} supprimé`);
      loadInstitutionUsers();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      error('Erreur de suppression', 'Erreur lors de la suppression');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield size={16} className="text-red-500" />;
      case 'librarian': return <User size={16} className="text-blue-500" />;
      default: return <User size={16} className="text-gray-500" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'librarian': return 'Bibliothécaire';
      default: return 'Utilisateur';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <MicroCard className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Gestion des Utilisateurs
              </h2>
              <p className="text-sm text-gray-600">
                {currentInstitution?.name} • {users.length} utilisateur{users.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <MicroButton
            variant="secondary"
            size="small"
            onClick={onClose}
          >
            <X size={20} />
          </MicroButton>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* Bouton Créer un nouvel utilisateur */}
          <div className="mb-6">
            <MicroButton
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus size={16} />
              Créer un nouvel utilisateur
            </MicroButton>
          </div>

          {/* Formulaire de création */}
          {showCreateForm && (
            <MicroCard className="mb-6 p-4 bg-blue-50 border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Plus size={16} className="mr-2" />
                Créer un nouvel utilisateur
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    value={newUserForm.firstName}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Jean"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    value={newUserForm.lastName}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Dupont"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="jean.dupont@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rôle *
                  </label>
                  <select
                    value={newUserForm.role}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value as 'admin' | 'librarian' | 'user' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="user">Utilisateur</option>
                    <option value="librarian">Bibliothécaire</option>
                    <option value="admin">Administrateur</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newUserForm.password}
                      onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Minimum 4 caractères"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe *
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newUserForm.confirmPassword}
                    onChange={(e) => setNewUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirmer le mot de passe"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <MicroButton
                  variant="secondary"
                  onClick={() => setShowCreateForm(false)}
                >
                  Annuler
                </MicroButton>
                <MicroButton
                  onClick={handleCreateUser}
                  disabled={isLoading}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {isLoading ? 'Création...' : 'Créer l\'utilisateur'}
                </MicroButton>
              </div>
            </MicroCard>
          )}

          {/* Liste des utilisateurs */}
          <div className="space-y-4">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-4 text-gray-300" />
                <p>Aucun utilisateur dans cette institution</p>
                <p className="text-sm">Créez le premier utilisateur en cliquant sur le bouton ci-dessus</p>
              </div>
            ) : (
              users.map((user) => (
                <MicroCard key={user.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        user.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <User size={20} className={user.isActive ? 'text-green-600' : 'text-gray-400'} />
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.id === currentUser?.id && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              Vous
                            </span>
                          )}
                          {!user.isActive && (
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                              Désactivé
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center space-x-1">
                            <Mail size={14} />
                            <span>{user.email}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            {getRoleIcon(user.role)}
                            <span>{getRoleLabel(user.role)}</span>
                          </span>
                        </div>
                        {user.lastLogin && (
                          <p className="text-xs text-gray-500 mt-1">
                            Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <MicroButton
                        variant="secondary"
                        size="small"
                        onClick={() => handleToggleUserStatus(user)}
                        disabled={user.id === currentUser?.id}
                      >
                        {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                      </MicroButton>

                      {user.id !== currentUser?.id && (
                        <MicroButton
                          variant="danger"
                          size="small"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 size={16} />
                        </MicroButton>
                      )}
                    </div>
                  </div>
                </MicroCard>
              ))
            )}
          </div>
        </div>
      </MicroCard>
    </div>
  );
};