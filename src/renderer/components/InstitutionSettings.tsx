import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Image, 
  Palette, 
  User, 
  Calendar,
  Save,
  X,
  Upload,
  FileText,
  Settings
} from 'lucide-react';
import { InstitutionInfo } from '../../types';
import { MicroButton } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';

interface InstitutionSettingsProps {
  currentInstitution: any;
  onClose: () => void;
  onSave: (info: InstitutionInfo) => void;
}

export const InstitutionSettings: React.FC<InstitutionSettingsProps> = ({ 
  currentInstitution, 
  onClose, 
  onSave 
}) => {
  const { success, error } = useQuickToast();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'contact' | 'branding'>('basic');
  
  const [institutionInfo, setInstitutionInfo] = useState<InstitutionInfo>({
    name: currentInstitution?.name || 'Ma Bibliothèque',
    shortName: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Cameroun',
    phone: '',
    email: '',
    website: '',
    logo: '',
    description: '',
    type: 'library',
    director: '',
    librarian: '',
    establishedYear: new Date().getFullYear(),
    reportHeader: '',
    reportFooter: '',
    primaryColor: '#3E5C49',
    secondaryColor: '#C2571B',
    institutionCode: currentInstitution?.code || '',
    lastModified: new Date().toISOString(),
    version: 1
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!institutionInfo.name.trim()) {
      newErrors.name = 'Le nom de l\'institution est obligatoire';
    }
    
    if (!institutionInfo.address.trim()) {
      newErrors.address = 'L\'adresse est obligatoire';
    }
    
    if (!institutionInfo.city.trim()) {
      newErrors.city = 'La ville est obligatoire';
    }
    
    if (institutionInfo.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(institutionInfo.email)) {
      newErrors.email = 'Format email invalide';
    }
    
    if (institutionInfo.website && !institutionInfo.website.startsWith('http')) {
      newErrors.website = 'L\'URL doit commencer par http:// ou https://';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setIsSaving(true);
    try {
      await onSave({
        ...institutionInfo,
        lastModified: new Date().toISOString(),
        version: (institutionInfo.version || 0) + 1
      });
      success('Paramètres sauvegardés', 'Les informations de l\'institution ont été mises à jour');
      onClose();
    } catch (err) {
      error('Erreur de sauvegarde', 'Impossible de sauvegarder les paramètres');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogoUpload = async () => {
    try {
      const result = await window.electronAPI?.selectFile?.({
        filters: [
          { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'gif', 'svg'] }
        ]
      });
      
      if (result) {
        setInstitutionInfo(prev => ({ ...prev, logo: result }));
        success('Logo ajouté', 'Le logo a été sélectionné avec succès');
      }
    } catch (err) {
      error('Erreur', 'Impossible de charger le logo');
    }
  };

  const renderBasicInfo = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3><Building2 size={20} /> Informations générales</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Nom complet de l'institution *</label>
            <input
              type="text"
              value={institutionInfo.name}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, name: e.target.value }))}
              className={errors.name ? 'error' : ''}
              placeholder="Bibliothèque Centrale de l'Université"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          <div className="form-group">
            <label>Nom court</label>
            <input
              type="text"
              value={institutionInfo.shortName}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, shortName: e.target.value }))}
              placeholder="BCU"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Type d'institution</label>
          <select
            value={institutionInfo.type}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, type: e.target.value as any }))}
          >
            <option value="library">Bibliothèque</option>
            <option value="university">Université</option>
            <option value="school">École</option>
            <option value="research">Centre de recherche</option>
            <option value="other">Autre</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Description</label>
          <textarea
            value={institutionInfo.description}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Description de votre institution..."
            rows={3}
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Année de création</label>
            <input
              type="number"
              value={institutionInfo.establishedYear}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, establishedYear: parseInt(e.target.value) }))}
              min="1800"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div className="form-group">
            <label>Code institution</label>
            <input
              type="text"
              value={institutionInfo.institutionCode}
              disabled
              className="disabled"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3><MapPin size={20} /> Coordonnées</h3>
        
        <div className="form-group">
          <label>Adresse *</label>
          <input
            type="text"
            value={institutionInfo.address}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, address: e.target.value }))}
            className={errors.address ? 'error' : ''}
            placeholder="123 Rue de la Bibliothèque"
          />
          {errors.address && <span className="error-text">{errors.address}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Ville *</label>
            <input
              type="text"
              value={institutionInfo.city}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, city: e.target.value }))}
              className={errors.city ? 'error' : ''}
              placeholder="Douala"
            />
            {errors.city && <span className="error-text">{errors.city}</span>}
          </div>
          
          <div className="form-group">
            <label>Code postal</label>
            <input
              type="text"
              value={institutionInfo.postalCode}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, postalCode: e.target.value }))}
              placeholder="00000"
            />
          </div>
        </div>
        
        <div className="form-group">
          <label>Pays</label>
          <input
            type="text"
            value={institutionInfo.country}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, country: e.target.value }))}
            placeholder="Cameroun"
          />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label><Phone size={16} /> Téléphone</label>
            <input
              type="tel"
              value={institutionInfo.phone}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+237 6XX XX XX XX"
            />
          </div>
          
          <div className="form-group">
            <label><Mail size={16} /> Email</label>
            <input
              type="email"
              value={institutionInfo.email}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, email: e.target.value }))}
              className={errors.email ? 'error' : ''}
              placeholder="contact@institution.cm"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label><Globe size={16} /> Site web</label>
          <input
            type="url"
            value={institutionInfo.website}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, website: e.target.value }))}
            className={errors.website ? 'error' : ''}
            placeholder="https://www.institution.cm"
          />
          {errors.website && <span className="error-text">{errors.website}</span>}
        </div>
      </div>
      
      <div className="form-section">
        <h3><User size={20} /> Responsables</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label>Directeur/Directrice</label>
            <input
              type="text"
              value={institutionInfo.director}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, director: e.target.value }))}
              placeholder="Dr. Marie Dupont"
            />
          </div>
          
          <div className="form-group">
            <label>Bibliothécaire en chef</label>
            <input
              type="text"
              value={institutionInfo.librarian}
              onChange={(e) => setInstitutionInfo(prev => ({ ...prev, librarian: e.target.value }))}
              placeholder="Jean Martin"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBrandingInfo = () => (
    <div className="tab-content">
      <div className="form-section">
        <h3><Image size={20} /> Logo et branding</h3>
        
        <div className="logo-section">
          <label>Logo de l'institution</label>
          <div className="logo-upload">
            {institutionInfo.logo ? (
              <div className="logo-preview">
                <img src={institutionInfo.logo} alt="Logo" />
                <button 
                  type="button" 
                  className="remove-logo"
                  onClick={() => setInstitutionInfo(prev => ({ ...prev, logo: '' }))}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="logo-placeholder">
                <Image size={48} />
                <p>Aucun logo sélectionné</p>
              </div>
            )}
            
            <MicroButton
              variant="secondary"
              onClick={handleLogoUpload}
              icon={Upload}
            >
              Choisir un logo
            </MicroButton>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label><Palette size={16} /> Couleur principale</label>
            <div className="color-input">
              <input
                type="color"
                value={institutionInfo.primaryColor}
                onChange={(e) => setInstitutionInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
              />
              <input
                type="text"
                value={institutionInfo.primaryColor}
                onChange={(e) => setInstitutionInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                placeholder="#3E5C49"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label><Palette size={16} /> Couleur secondaire</label>
            <div className="color-input">
              <input
                type="color"
                value={institutionInfo.secondaryColor}
                onChange={(e) => setInstitutionInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
              />
              <input
                type="text"
                value={institutionInfo.secondaryColor}
                onChange={(e) => setInstitutionInfo(prev => ({ ...prev, secondaryColor: e.target.value }))}
                placeholder="#C2571B"
              />
            </div>
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3><FileText size={20} /> Paramètres des rapports</h3>
        
        <div className="form-group">
          <label>En-tête des rapports</label>
          <input
            type="text"
            value={institutionInfo.reportHeader}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, reportHeader: e.target.value }))}
            placeholder="Rapport généré par le système de gestion de bibliothèque"
          />
        </div>
        
        <div className="form-group">
          <label>Pied de page des rapports</label>
          <input
            type="text"
            value={institutionInfo.reportFooter}
            onChange={(e) => setInstitutionInfo(prev => ({ ...prev, reportFooter: e.target.value }))}
            placeholder="© 2024 - Tous droits réservés"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay">
      <div className="modal-container institution-settings-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Settings size={24} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Paramètres de l'institution</h2>
              <p className="modal-subtitle">
                Configurez les informations de votre institution
              </p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="modal-tabs">
          <button 
            className={`tab-button ${activeTab === 'basic' ? 'active' : ''}`}
            onClick={() => setActiveTab('basic')}
          >
            <Building2 size={18} />
            Informations générales
          </button>
          <button 
            className={`tab-button ${activeTab === 'contact' ? 'active' : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            <MapPin size={18} />
            Coordonnées
          </button>
          <button 
            className={`tab-button ${activeTab === 'branding' ? 'active' : ''}`}
            onClick={() => setActiveTab('branding')}
          >
            <Palette size={18} />
            Branding
          </button>
        </div>
        
        {/* Content */}
        <div className="modal-content">
          {activeTab === 'basic' && renderBasicInfo()}
          {activeTab === 'contact' && renderContactInfo()}
          {activeTab === 'branding' && renderBrandingInfo()}
        </div>
        
        {/* Actions */}
        <div className="modal-actions">
          <MicroButton
            variant="secondary"
            onClick={onClose}
            disabled={isSaving}
          >
            Annuler
          </MicroButton>
          <MicroButton
            variant="primary"
            onClick={handleSave}
            disabled={isSaving}
            icon={Save}
          >
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </MicroButton>
        </div>
      </div>
      
      <style>{`
        .institution-settings-modal {
          max-width: 800px;
          height: 85vh;
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
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: rgba(243, 238, 217, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 2px 0;
        }

        .modal-subtitle {
          font-size: 14px;
          margin: 0;
          opacity: 0.9;
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
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .modal-tabs {
          background: #FAF9F6;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
          padding: 0 32px;
          display: flex;
          gap: 2px;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          border: none;
          background: transparent;
          border-radius: 12px 12px 0 0;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #6E6E6E;
          position: relative;
          top: 1px;
        }

        .tab-button:hover {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .tab-button.active {
          background: white;
          color: #3E5C49;
          border: 1px solid rgba(229, 220, 194, 0.4);
          border-bottom: 1px solid white;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .tab-content {
          max-width: 600px;
          margin: 0 auto;
        }

        .form-section {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 2px solid rgba(229, 220, 194, 0.3);
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .form-section h3 {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 20px 0;
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
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(229, 220, 194, 0.6);
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .form-group input.error {
          border-color: #EF4444;
        }

        .form-group input.disabled {
          background: #F3F4F6;
          color: #6B7280;
          cursor: not-allowed;
        }

        .error-text {
          display: block;
          color: #EF4444;
          font-size: 12px;
          margin-top: 4px;
        }

        .color-input {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .color-input input[type="color"] {
          width: 50px;
          height: 42px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .color-input input[type="text"] {
          flex: 1;
        }

        .logo-section {
          margin-bottom: 24px;
        }

        .logo-upload {
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .logo-preview {
          position: relative;
          width: 120px;
          height: 120px;
          border: 2px dashed rgba(229, 220, 194, 0.6);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FAF9F6;
        }

        .logo-preview img {
          max-width: 100%;
          max-height: 100%;
          border-radius: 8px;
        }

        .remove-logo {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 24px;
          height: 24px;
          background: #EF4444;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .remove-logo:hover {
          background: #DC2626;
          transform: scale(1.1);
        }

        .logo-placeholder {
          width: 120px;
          height: 120px;
          border: 2px dashed rgba(229, 220, 194, 0.6);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #FAF9F6;
          color: #9CA3AF;
        }

        .logo-placeholder p {
          margin: 8px 0 0 0;
          font-size: 12px;
        }

        .modal-actions {
          padding: 24px 32px;
          border-top: 1px solid rgba(229, 220, 194, 0.4);
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          background: #FAF9F6;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .modal-overlay {
            padding: 16px;
          }

          .institution-settings-modal {
            height: 90vh;
          }

          .modal-header {
            padding: 20px 24px;
          }

          .modal-content {
            padding: 24px;
          }

          .modal-actions {
            padding: 20px 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal-tabs {
            padding: 0 24px;
            overflow-x: auto;
          }

          .tab-button {
            white-space: nowrap;
            min-width: fit-content;
          }
        }
      `}</style>
    </div>
  );
};