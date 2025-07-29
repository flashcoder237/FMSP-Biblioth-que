import React, { useState, useEffect } from 'react';
import { 
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
  UserX,
  Search,
  Filter,
  MoreVertical
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

interface NewUserForm {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  role: 'admin' | 'librarian' | 'user';
}

export const InstitutionUserManagement: React.FC<InstitutionUserManagementProps> = ({ 
  currentUser,
  currentInstitution,
  appMode,
  onClose
}) => {
  const { success, error, info } = useQuickToast();
  const [users, setUsers] = useState<DisplayUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedUser, setSelectedUser] = useState<DisplayUser | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'librarian' | 'user'>('all');
  
  const [newUserForm, setNewUserForm] = useState<NewUserForm>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      
      if (appMode === 'offline' && currentInstitution?.code) {
        const allUsers = LocalAuthService.getUsers();
        const localUsers = allUsers.filter(user => user.institutionCode === currentInstitution.code);
        const displayUsers: DisplayUser[] = localUsers.map((user: any) => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          role: user.role,
          institutionCode: user.institutionCode,
          isActive: user.isActive !== undefined ? user.isActive : true,
          createdAt: user.createdAt || new Date().toISOString(),
          lastLogin: user.lastLogin
        }));
        setUsers(displayUsers);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des utilisateurs:', err);
      error('Erreur', 'Impossible de charger les utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!newUserForm.email.trim()) {
      errors.email = 'Email obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newUserForm.email)) {
      errors.email = 'Format email invalide';
    }
    
    if (!newUserForm.firstName.trim()) {
      errors.firstName = 'Prénom obligatoire';
    }
    
    if (!newUserForm.lastName.trim()) {
      errors.lastName = 'Nom obligatoire';
    }
    
    if (!newUserForm.password) {
      errors.password = 'Mot de passe obligatoire';
    } else if (newUserForm.password.length < 6) {
      errors.password = 'Minimum 6 caractères';
    }
    
    if (newUserForm.password !== newUserForm.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateUser = async () => {
    if (!validateForm() || !currentInstitution?.code) return;
    
    try {
      setIsLoading(true);
      
      if (appMode === 'offline') {
        const newUser = LocalAuthService.addUser({
          email: newUserForm.email,
          password: newUserForm.password,
          firstName: newUserForm.firstName,
          lastName: newUserForm.lastName,
          role: newUserForm.role,
          institutionCode: currentInstitution.code
        });
        
        if (newUser) {
          success('Utilisateur créé', `${newUserForm.firstName} ${newUserForm.lastName} a été ajouté avec succès`);
          setNewUserForm({
            email: '',
            firstName: '',
            lastName: '',
            password: '',
            confirmPassword: '',
            role: 'user'
          });
          setCurrentView('list');
          await loadUsers();
        } else {
          error('Erreur', 'Impossible de créer l\'utilisateur');
        }
      }
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      error('Erreur', 'Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${userName} ?`)) return;
    
    try {
      if (appMode === 'offline') {
        // Simulation de suppression en filtrant l'utilisateur
        const users = LocalAuthService.getUsers();
        const filteredUsers = users.filter(u => u.id !== userId);
        LocalAuthService.saveUsers(filteredUsers);
        success('Utilisateur supprimé', `${userName} a été supprimé avec succès`);
        await loadUsers();
      }
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      error('Erreur', 'Erreur lors de la suppression');
    }
  };

  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      if (appMode === 'offline') {
        // Simulation de modification du statut
        const users = LocalAuthService.getUsers();
        const updatedUsers = users.map(u => 
          u.id === userId ? { ...u, isActive: !currentStatus } : u
        );
        LocalAuthService.saveUsers(updatedUsers as any);
        const action = !currentStatus ? 'activé' : 'désactivé';
        success('Statut modifié', `Utilisateur ${action} avec succès`);
        await loadUsers();
      }
    } catch (err) {
      console.error('Erreur lors de la modification du statut:', err);
      error('Erreur', 'Erreur lors de la modification du statut');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#C2571B';
      case 'librarian': return '#3E5C49';
      case 'user': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'librarian': return 'Bibliothécaire';
      case 'user': return 'Utilisateur';
      default: return role;
    }
  };

  const renderUserList = () => (
    <div className="users-section">
      {/* Barre de recherche et filtres */}
      <div className="search-filters">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Rechercher un utilisateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={18} />
          <select 
            value={roleFilter} 
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="role-filter"
          >
            <option value="all">Tous les rôles</option>
            <option value="admin">Administrateurs</option>
            <option value="librarian">Bibliothécaires</option>
            <option value="user">Utilisateurs</option>
          </select>
        </div>
      </div>

      {/* Stats rapides */}
      <div className="users-stats">
        <div className="stat-card">
          <Users size={20} />
          <div>
            <div className="stat-number">{users.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
        <div className="stat-card">
          <UserCheck size={20} />
          <div>
            <div className="stat-number">{users.filter(u => u.isActive).length}</div>
            <div className="stat-label">Actifs</div>
          </div>
        </div>
        <div className="stat-card">
          <Shield size={20} />
          <div>
            <div className="stat-number">{users.filter(u => u.role === 'admin').length}</div>
            <div className="stat-label">Admins</div>
          </div>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="users-list">
        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Users size={48} />
            <h3>Aucun utilisateur trouvé</h3>
            <p>
              {searchTerm || roleFilter !== 'all' 
                ? 'Aucun utilisateur ne correspond aux critères de recherche'
                : 'Commencez par ajouter votre premier utilisateur'
              }
            </p>
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id} className="user-card">
              <div className="user-info">
                <div className="user-avatar">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div className="user-details">
                  <div className="user-name">
                    {user.firstName} {user.lastName}
                    {!user.isActive && <span className="inactive-badge">Inactif</span>}
                  </div>
                  <div className="user-email">{user.email}</div>
                  <div className="user-meta">
                    <span className="role-badge" style={{ backgroundColor: getRoleColor(user.role) }}>
                      {getRoleLabel(user.role)}
                    </span>
                    <span className="join-date">
                      Créé le {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="user-actions">
                <MicroButton
                  variant="secondary"
                  size="small"
                  onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                  disabled={user.id === currentUser?.id}
                >
                  {user.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                </MicroButton>
                
                <MicroButton
                  variant="danger"
                  size="small"
                  onClick={() => handleDeleteUser(user.id, `${user.firstName} ${user.lastName}`)}
                  disabled={user.id === currentUser?.id}
                >
                  <Trash2 size={16} />
                </MicroButton>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAddUserForm = () => (
    <div className="add-user-form">
      <div className="form-section">
        <h3>Informations personnelles</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Prénom *</label>
            <input
              type="text"
              value={newUserForm.firstName}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, firstName: e.target.value }))}
              className={formErrors.firstName ? 'error' : ''}
              placeholder="Jean"
            />
            {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
          </div>
          
          <div className="form-group">
            <label>Nom *</label>
            <input
              type="text"
              value={newUserForm.lastName}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, lastName: e.target.value }))}
              className={formErrors.lastName ? 'error' : ''}
              placeholder="Dupont"
            />
            {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Email *</label>
          <div className="input-with-icon">
            <Mail size={18} />
            <input
              type="email"
              value={newUserForm.email}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, email: e.target.value }))}
              className={formErrors.email ? 'error' : ''}
              placeholder="jean.dupont@example.com"
            />
          </div>
          {formErrors.email && <span className="error-text">{formErrors.email}</span>}
        </div>
      </div>

      <div className="form-section">
        <h3>Sécurité et permissions</h3>
        
        <div className="form-group">
          <label>Rôle</label>
          <div className="input-with-icon">
            <Shield size={18} />
            <select
              value={newUserForm.role}
              onChange={(e) => setNewUserForm(prev => ({ ...prev, role: e.target.value as any }))}
            >
              <option value="user">Utilisateur</option>
              <option value="librarian">Bibliothécaire</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Mot de passe *</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newUserForm.password}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, password: e.target.value }))}
                className={formErrors.password ? 'error' : ''}
                placeholder="••••••••"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {formErrors.password && <span className="error-text">{formErrors.password}</span>}
          </div>
          
          <div className="form-group">
            <label>Confirmer le mot de passe *</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={newUserForm.confirmPassword}
                onChange={(e) => setNewUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={formErrors.confirmPassword ? 'error' : ''}
                placeholder="••••••••"
              />
            </div>
            {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container user-management-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Users size={24} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Gestion des utilisateurs</h2>
              <p className="modal-subtitle">
                {currentInstitution?.name || 'Institution'} • {users.length} utilisateur{users.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="modal-nav">
          <div className="nav-buttons">
            <button 
              className={`nav-button ${currentView === 'list' ? 'active' : ''}`}
              onClick={() => setCurrentView('list')}
            >
              <Users size={18} />
              Liste des utilisateurs
            </button>
            <button 
              className={`nav-button ${currentView === 'add' ? 'active' : ''}`}
              onClick={() => setCurrentView('add')}
            >
              <Plus size={18} />
              Nouvel utilisateur
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="modal-content">
          {isLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des utilisateurs...</p>
            </div>
          ) : currentView === 'list' ? (
            renderUserList()
          ) : (
            renderAddUserForm()
          )}
        </div>
        
        {/* Actions */}
        {currentView === 'add' && (
          <div className="modal-actions">
            <MicroButton
              variant="secondary"
              onClick={() => setCurrentView('list')}
              disabled={isLoading}
            >
              Annuler
            </MicroButton>
            <MicroButton
              variant="primary"
              onClick={handleCreateUser}
              disabled={isLoading}
            >
              <Save size={16} />
              Créer l'utilisateur
            </MicroButton>
          </div>
        )}
      </div>
      
      <style>{`
        .user-management-modal {
          max-width: 900px;
          height: 80vh;
          display: flex;
          flex-direction: column;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 20px;
        }

        .modal-container {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          width: 100%;
          max-height: 95vh;
          overflow: hidden;
          animation: modalSlideIn 0.3s ease-out;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .modal-header {
          background: linear-gradient(135deg, #3E5C49 0%, #C2571B 100%);
          color: #F3EED9;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }

        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.6;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
          position: relative;
          z-index: 1;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .header-text {
          flex: 1;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 2px 0;
          color: #F3EED9;
        }

        .modal-subtitle {
          font-size: 14px;
          margin: 0;
          opacity: 0.9;
          color: #F3EED9;
        }

        .close-btn {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
          z-index: 1;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .modal-nav {
          background: #FAF9F6;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
          padding: 16px 32px;
        }

        .nav-buttons {
          display: flex;
          gap: 8px;
        }

        .nav-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #6E6E6E;
        }

        .nav-button:hover {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .nav-button.active {
          background: #3E5C49;
          color: #F3EED9;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .modal-actions {
          padding: 24px 32px;
          border-top: 1px solid rgba(229, 220, 194, 0.4);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #FAF9F6;
        }

        /* Search and Filters */
        .search-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          align-items: center;
        }

        .search-box {
          position: relative;
          flex: 1;
        }

        .search-box svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
        }

        .search-box input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid rgba(229, 220, 194, 0.6);
          border-radius: 12px;
          background: white;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .search-box input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: white;
          border: 2px solid rgba(229, 220, 194, 0.6);
          border-radius: 12px;
        }

        .role-filter {
          border: none;
          background: transparent;
          font-size: 14px;
          cursor: pointer;
          outline: none;
        }

        /* User Stats */
        .users-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          background: white;
          padding: 20px;
          border-radius: 12px;
          border: 2px solid rgba(229, 220, 194, 0.3);
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          border-color: rgba(62, 92, 73, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .stat-card svg {
          color: #3E5C49;
        }

        .stat-number {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Users List */
        .users-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .user-card {
          background: white;
          border: 2px solid rgba(229, 220, 194, 0.3);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          transition: all 0.2s ease;
        }

        .user-card:hover {
          border-color: rgba(62, 92, 73, 0.3);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #3E5C49, #C2571B);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 16px;
        }

        .user-details {
          flex: 1;
        }

        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .inactive-badge {
          background: #EF4444;
          color: white;
          font-size: 11px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 500;
        }

        .user-email {
          font-size: 14px;
          color: #6E6E6E;
          margin-bottom: 8px;
        }

        .user-meta {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .role-badge {
          color: white;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .join-date {
          font-size: 12px;
          color: #9CA3AF;
        }

        .user-actions {
          display: flex;
          gap: 8px;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #6E6E6E;
        }

        .empty-state svg {
          color: #D1D5DB;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 8px 0;
          color: #4B5563;
        }

        .empty-state p {
          font-size: 14px;
          margin: 0;
          max-width: 300px;
          margin: 0 auto;
          line-height: 1.5;
        }

        /* Add User Form */
        .add-user-form {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-section {
          margin-bottom: 32px;
        }

        .form-section h3 {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 20px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid rgba(229, 220, 194, 0.4);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(229, 220, 194, 0.6);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .form-group input.error {
          border-color: #EF4444;
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon svg {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #9CA3AF;
          z-index: 1;
        }

        .input-with-icon input,
        .input-with-icon select {
          padding-left: 48px;
        }

        .password-toggle {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #9CA3AF;
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .password-toggle:hover {
          color: #6B7280;
        }

        .error-text {
          display: block;
          color: #EF4444;
          font-size: 12px;
          margin-top: 4px;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(62, 92, 73, 0.2);
          border-top: 3px solid #3E5C49;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 16px;
          }

          .user-management-modal {
            height: 90vh;
          }

          .modal-header {
            padding: 20px 24px;
          }

          .modal-title {
            font-size: 20px;
          }

          .modal-content {
            padding: 24px;
          }

          .modal-actions {
            padding: 20px 24px;
          }

          .search-filters {
            flex-direction: column;
            align-items: stretch;
          }

          .users-stats {
            grid-template-columns: 1fr;
          }

          .user-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }

          .user-info {
            width: 100%;
          }

          .user-actions {
            align-self: flex-end;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .add-user-form {
            max-width: none;
          }
        }
      `}</style>
    </div>
  );
};