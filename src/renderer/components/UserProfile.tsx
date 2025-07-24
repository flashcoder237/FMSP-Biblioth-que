import React, { useState, useEffect } from 'react';
import { 
  User, 
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
  AlertCircle
} from 'lucide-react';
import { MicroButton, MicroCard } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';
import { LocalAuthService } from '../services/LocalAuthService';
import { UnifiedUser, UnifiedInstitution } from '../types/UnifiedTypes';

interface UserProfileProps {
  currentUser: UnifiedUser | null;
  currentInstitution: UnifiedInstitution | null;
  appMode: 'offline' | 'online';
  onClose: () => void;
  onUserUpdate: (user: UnifiedUser) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  currentUser, 
  currentInstitution, 
  appMode, 
  onClose, 
  onUserUpdate 
}) => {
  const { success, error } = useQuickToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    role: currentUser?.role || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [validation, setValidation] = useState({
    currentPasswordValid: false,
    newPasswordValid: false,
    passwordsMatch: false
  });

  useEffect(() => {
    if (currentUser) {
      setFormData({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
        role: currentUser.role || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [currentUser]);

  const validatePasswords = () => {
    const currentPasswordValid = formData.currentPassword.length >= 3;
    const newPasswordValid = formData.newPassword.length >= 4;
    const passwordsMatch = formData.newPassword === formData.confirmPassword;

    setValidation({
      currentPasswordValid,
      newPasswordValid,
      passwordsMatch
    });

    return currentPasswordValid && newPasswordValid && passwordsMatch;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field.includes('Password')) {
      setTimeout(validatePasswords, 100);
    }
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      if (appMode === 'offline') {
        // Mode offline - utiliser LocalAuthService
        const users = LocalAuthService.getUsers();
        const userIndex = users.findIndex(u => u.id === currentUser?.id);
        
        if (userIndex === -1) {
          error('Erreur', 'Utilisateur non trouvé');
          return;
        }

        const updatedUser = {
          ...users[userIndex],
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          lastModified: new Date().toISOString()
        };

        // Si changement de mot de passe demandé
        if (showPasswordSection && formData.newPassword) {
          if (!validatePasswords()) {
            error('Erreur de validation', 'Veuillez vérifier les mots de passe');
            return;
          }

          // Vérifier le mot de passe actuel
          if (users[userIndex].password !== formData.currentPassword) {
            error('Mot de passe incorrect', 'Le mot de passe actuel est incorrect');
            return;
          }

          updatedUser.password = formData.newPassword;
        }

        users[userIndex] = updatedUser;
        LocalAuthService.saveUsers(users);

        // Mettre à jour le currentUser dans localStorage aussi
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Notifier le parent avec l'utilisateur unifié
        const unifiedUser: UnifiedUser = {
          id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          role: updatedUser.role,
          institutionCode: updatedUser.institutionCode,
          lastLogin: updatedUser.lastLogin,
          preferences: updatedUser.preferences
        };
        onUserUpdate(unifiedUser);
      } else {
        // Mode online - utiliser Supabase (à implémenter si nécessaire)
        error('Mode non supporté', 'La modification du profil en mode online n\'est pas encore implémentée');
        return;
      }

      success('Profil mis à jour', 'Vos informations ont été sauvegardées avec succès');
      setIsEditing(false);
      setShowPasswordSection(false);
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (err) {
      error('Erreur de sauvegarde', 'Impossible de sauvegarder les modifications');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrateur',
      'librarian': 'Bibliothécaire',
      'user': 'Utilisateur',
      'Administrateur': 'Administrateur',
      'Bibliothécaire': 'Bibliothécaire',
      'Utilisateur': 'Utilisateur'
    };
    return roleMap[role] || role;
  };

  const getInitials = (user: UnifiedUser | null) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="user-profile-overlay">
      <div className="user-profile-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <User size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Profil utilisateur</h2>
              <p className="modal-subtitle">Gérez vos informations personnelles</p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* User Avatar Section */}
          <div className="user-avatar-section">
            <div className="large-avatar">
              <span className="large-avatar-text">{getInitials(currentUser)}</span>
            </div>
            <div className="user-basic-info">
              <h3 className="user-display-name">
                {currentUser?.firstName 
                  ? `${currentUser.firstName} ${currentUser.lastName || ''}`.trim()
                  : currentUser?.email || 'Utilisateur'
                }
              </h3>
              <div className="user-role-badge">
                <Shield size={14} />
                {getRoleLabel(currentUser?.role || 'user')}
              </div>
              {currentInstitution && (
                <div className="user-institution-badge">
                  <Building size={14} />
                  {currentInstitution.name}
                </div>
              )}
            </div>
          </div>

          {/* Profile Form */}
          <div className="profile-form-section">
            <div className="section-header">
              <h4 className="section-title">Informations personnelles</h4>
              {!isEditing && (
                <MicroButton
                  variant="secondary"
                  size="small"
                  icon={Edit3}
                  onClick={() => setIsEditing(true)}
                >
                  Modifier
                </MicroButton>
              )}
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Prénom</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Votre prénom"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  className="form-input"
                  placeholder="Votre nom"
                />
              </div>

              <div className="form-group full-width">
                <label className="form-label">Email</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="form-input with-icon"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label className="form-label">Rôle</label>
                <input
                  type="text"
                  value={getRoleLabel(formData.role)}
                  disabled
                  className="form-input disabled"
                />
                <p className="form-help">Le rôle ne peut être modifié que par un administrateur</p>
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="password-section">
                <div className="section-header">
                  <h4 className="section-title">Sécurité</h4>
                  <MicroButton
                    variant="secondary"
                    size="small"
                    icon={showPasswordSection ? EyeOff : Eye}
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                  >
                    {showPasswordSection ? 'Masquer' : 'Changer mot de passe'}
                  </MicroButton>
                </div>

                {showPasswordSection && (
                  <div className="password-form">
                    <div className="form-group">
                      <label className="form-label">Mot de passe actuel</label>
                      <div className="input-with-validation">
                        <input
                          type="password"
                          value={formData.currentPassword}
                          onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                          className={`form-input ${validation.currentPasswordValid ? 'valid' : formData.currentPassword ? 'invalid' : ''}`}
                          placeholder="Mot de passe actuel"
                        />
                        {formData.currentPassword && (
                          <div className="validation-icon">
                            {validation.currentPasswordValid ? 
                              <Check size={16} className="valid" /> : 
                              <AlertCircle size={16} className="invalid" />
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Nouveau mot de passe</label>
                      <div className="input-with-validation">
                        <input
                          type="password"
                          value={formData.newPassword}
                          onChange={(e) => handleInputChange('newPassword', e.target.value)}
                          className={`form-input ${validation.newPasswordValid ? 'valid' : formData.newPassword ? 'invalid' : ''}`}
                          placeholder="Nouveau mot de passe (min. 4 caractères)"
                        />
                        {formData.newPassword && (
                          <div className="validation-icon">
                            {validation.newPasswordValid ? 
                              <Check size={16} className="valid" /> : 
                              <AlertCircle size={16} className="invalid" />
                            }
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirmer le mot de passe</label>
                      <div className="input-with-validation">
                        <input
                          type="password"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          className={`form-input ${validation.passwordsMatch && formData.confirmPassword ? 'valid' : formData.confirmPassword ? 'invalid' : ''}`}
                          placeholder="Confirmer le nouveau mot de passe"
                        />
                        {formData.confirmPassword && (
                          <div className="validation-icon">
                            {validation.passwordsMatch ? 
                              <Check size={16} className="valid" /> : 
                              <AlertCircle size={16} className="invalid" />
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {isEditing && (
          <div className="modal-footer">
            <MicroButton
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                setShowPasswordSection(false);
                // Reset form
                setFormData({
                  firstName: currentUser?.firstName || '',
                  lastName: currentUser?.lastName || '',
                  email: currentUser?.email || '',
                  role: currentUser?.role || '',
                  currentPassword: '',
                  newPassword: '',
                  confirmPassword: ''
                });
              }}
            >
              Annuler
            </MicroButton>
            <MicroButton
              variant="success"
              onClick={handleSaveProfile}
              disabled={isLoading}
              icon={Save}
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </MicroButton>
          </div>
        )}
      </div>

      <style>{`
        .user-profile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          backdrop-filter: blur(8px);
        }

        .user-profile-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }

        .modal-header {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .header-icon {
          width: 56px;
          height: 56px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
        }

        .modal-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .close-button {
          width: 44px;
          height: 44px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .user-avatar-section {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 32px;
          padding: 24px;
          background: rgba(243, 238, 217, 0.1);
          border-radius: 16px;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }

        .large-avatar {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }

        .large-avatar-text {
          color: #F3EED9;
          font-weight: 800;
          font-size: 28px;
          text-transform: uppercase;
        }

        .user-display-name {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .user-role-badge,
        .user-institution-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          margin: 4px 8px 4px 0;
        }

        .user-role-badge {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .user-institution-badge {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }

        .profile-form-section {
          margin-bottom: 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
        }

        .form-group.full-width {
          grid-column: 1 / -1;
        }

        .form-label {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 8px;
        }

        .form-input {
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .form-input:disabled {
          background: #F5F5F5;
          color: #6E6E6E;
          cursor: not-allowed;
        }

        .form-input.disabled {
          background: #F8F8F8;
          border-color: #E0E0E0;
        }

        .form-input.with-icon {
          padding-left: 44px;
        }

        .form-input.valid {
          border-color: #10B981;
        }

        .form-input.invalid {
          border-color: #DC2626;
        }

        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #6E6E6E;
        }

        .input-with-validation {
          position: relative;
        }

        .validation-icon {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
        }

        .validation-icon .valid {
          color: #10B981;
        }

        .validation-icon .invalid {
          color: #DC2626;
        }

        .form-help {
          font-size: 12px;
          color: #6E6E6E;
          margin: 4px 0 0 0;
          font-style: italic;
        }

        .password-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(229, 220, 194, 0.3);
        }

        .password-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-top: 20px;
        }

        .modal-footer {
          padding: 24px 32px;
          border-top: 1px solid #E5DCC2;
          display: flex;
          justify-content: flex-end;
          gap: 16px;
        }

        @media (max-width: 768px) {
          .user-profile-modal {
            margin: 12px;
          }

          .user-avatar-section {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .modal-content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};