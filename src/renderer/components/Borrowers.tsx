import React, { useState, useEffect } from 'react';
import { 
  Users, 
  GraduationCap, 
  Briefcase,
  Search, 
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  User,
  Hash,
  School,
  Building,
  Mail,
  Phone,
  Eye,
  Filter,
  ChevronRight
} from 'lucide-react';

import { Borrower } from '../../types';
import { SupabaseRendererService } from '../services/SupabaseClient';

interface BorrowersProps {
  onClose: () => void;
  onRefreshData?: () => Promise<void>;
  supabaseService: SupabaseRendererService;
}

export default function Borrowers({ onClose, onRefreshData, supabaseService }: BorrowersProps) {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'staff'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [appMode, setAppMode] = useState<'offline' | 'online'>('offline');
  const [currentStep, setCurrentStep] = useState(1);

  // Charger les emprunteurs au montage du composant
  useEffect(() => {
    loadBorrowers();
    // Détecter le mode de l'application
    const mode = localStorage.getItem('appMode') || 'offline';
    setAppMode(mode as 'offline' | 'online');
  }, []);

  const loadBorrowers = async () => {
    setDataLoading(true);
    try {
      // Obtenir le code d'institution courant pour l'isolation
      const institutionCode = supabaseService.getCurrentInstitution()?.code;
      console.log('🔍 DEBUG Borrowers - Loading with institutionCode:', institutionCode);
      
      const borrowersList = await window.electronAPI.getBorrowers(institutionCode);
      console.log('🔍 DEBUG Borrowers - Loaded', borrowersList?.length || 0, 'borrowers');
      setBorrowers(borrowersList || []);
    } catch (error) {
      console.error('Erreur lors du chargement des emprunteurs:', error);
      setBorrowers([]);
    } finally {
      setDataLoading(false);
    }
  };

  const [borrowerData, setBorrowerData] = useState<Omit<Borrower, 'id'>>({
    type: 'student',
    firstName: '',
    lastName: '',
    matricule: '',
    classe: '',
    cniNumber: '',
    position: '',
    email: '',
    phone: '',
    syncStatus: 'pending',
    lastModified: new Date().toISOString(),
    version: 1,
    createdAt: new Date().toISOString()
  });

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const validateStep = (step: number) => {
    const errors: { [key: string]: string } = {};

    if (step === 1) {
      if (!borrowerData.firstName.trim()) errors.firstName = 'Le prénom est requis';
      if (!borrowerData.lastName.trim()) errors.lastName = 'Le nom est requis';
      if (!borrowerData.matricule.trim()) errors.matricule = 'Le matricule est requis';
    }

    if (step === 2) {
      if (borrowerData.type === 'student' && !borrowerData.classe?.trim()) {
        errors.classe = 'La classe est requise pour les étudiants';
      }
      if (borrowerData.type === 'staff' && !borrowerData.position?.trim()) {
        errors.position = 'Le poste est requis pour le personnel';
      }
    }

    if (step === 3) {
      if (borrowerData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(borrowerData.email)) {
        errors.email = 'Format email invalide';
      }
      if (borrowerData.phone && !/^[\d\s\+\-\(\)]{6,}$/.test(borrowerData.phone)) {
        errors.phone = 'Format téléphone invalide';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleInputChange = (field: string, value: string) => {
    setBorrowerData(prev => ({ ...prev, [field]: value }));
    
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;
    
    setIsLoading(true);
    try {
      const borrowerToSave = {
        ...borrowerData,
        syncStatus: 'pending' as const,
        lastModified: new Date().toISOString(),
        version: editingBorrower ? editingBorrower.version + 1 : 1
      };

      if (editingBorrower && editingBorrower.id) {
        await window.electronAPI.updateBorrower({ ...borrowerToSave, id: editingBorrower.id });
        setBorrowers(prev => prev.map(b => 
          b.id === editingBorrower.id ? { ...borrowerToSave, id: editingBorrower.id } : b
        ));
      } else {
        const newId = await window.electronAPI.addBorrower(borrowerToSave);
        setBorrowers(prev => [...prev, { ...borrowerToSave, id: newId }]);
      }

      setShowAddModal(false);
      setEditingBorrower(null);
      resetForm();
      
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      setFormErrors({ submit: error.message || 'Erreur lors de l\'opération' });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setBorrowerData({
      type: 'student',
      firstName: '',
      lastName: '',
      matricule: '',
      classe: '',
      cniNumber: '',
      position: '',
      email: '',
      phone: '',
      syncStatus: 'pending',
      lastModified: new Date().toISOString(),
      version: 1,
      createdAt: new Date().toISOString()
    });
    setFormErrors({});
    setCurrentStep(1);
  };

  const handleEdit = (borrower: Borrower) => {
    setBorrowerData({
      type: borrower.type,
      firstName: borrower.firstName,
      lastName: borrower.lastName,
      matricule: borrower.matricule,
      classe: borrower.classe || '',
      cniNumber: borrower.cniNumber || '',
      position: borrower.position || '',
      email: borrower.email || '',
      phone: borrower.phone || '',
      syncStatus: borrower.syncStatus,
      lastModified: borrower.lastModified,
      version: borrower.version,
      createdAt: borrower.createdAt || new Date().toISOString()
    });
    setEditingBorrower(borrower);
    setShowAddModal(true);
  };

  const handleDelete = async (borrowerToDelete: Borrower) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${borrowerToDelete.firstName} ${borrowerToDelete.lastName} ?`)) {
      try {
        if (appMode === 'offline' && borrowerToDelete.id) {
          await window.electronAPI.deleteBorrower(borrowerToDelete.id);
        }
        
        setBorrowers(prev => prev.filter(b => b.id !== borrowerToDelete.id));
        
        if (onRefreshData) {
          await onRefreshData();
        }
      } catch (error: any) {
        console.error('Erreur lors de la suppression:', error);
        alert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    if (filterType !== 'all' && borrower.type !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        borrower.firstName.toLowerCase().includes(query) ||
        borrower.lastName.toLowerCase().includes(query) ||
        borrower.matricule.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const studentCount = borrowers.filter(b => b.type === 'student').length;
  const staffCount = borrowers.filter(b => b.type === 'staff').length;

  const getStepTitle = (step: number) => {
    switch(step) {
      case 1: return 'Informations personnelles';
      case 2: return 'Informations académiques/professionnelles';
      case 3: return 'Contact';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch(step) {
      case 1: return 'Identité de l\'emprunteur';
      case 2: return 'Classe, poste ou informations spécifiques';
      case 3: return 'Coordonnées de contact';
      default: return '';
    }
  };

  const getStepIcon = (step: number) => {
    switch(step) {
      case 1: return User;
      case 2: return borrowerData.type === 'student' ? GraduationCap : Briefcase;
      case 3: return Mail;
      default: return User;
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <User size={18} />
                Type d'emprunteur *
              </label>
              <div className="radio-group">
                <label className={`radio-option ${borrowerData.type === 'student' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="student"
                    checked={borrowerData.type === 'student'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  />
                  <GraduationCap size={20} />
                  <span>Étudiant</span>
                </label>
                <label className={`radio-option ${borrowerData.type === 'staff' ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="type"
                    value="staff"
                    checked={borrowerData.type === 'staff'}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                  />
                  <Briefcase size={20} />
                  <span>Personnel</span>
                </label>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <User size={18} />
                  Prénom *
                </label>
                <input
                  type="text"
                  value={borrowerData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                  placeholder="Prénom de l'emprunteur"
                  autoFocus
                />
                {formErrors.firstName && <p className="error-message">{formErrors.firstName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <User size={18} />
                  Nom *
                </label>
                <input
                  type="text"
                  value={borrowerData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                  placeholder="Nom de famille"
                />
                {formErrors.lastName && <p className="error-message">{formErrors.lastName}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={18} />
                Matricule *
              </label>
              <input
                type="text"
                value={borrowerData.matricule}
                onChange={(e) => handleInputChange('matricule', e.target.value)}
                className={`form-input ${formErrors.matricule ? 'error' : ''}`}
                placeholder="Numéro d'identification unique"
              />
              {formErrors.matricule && <p className="error-message">{formErrors.matricule}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            {borrowerData.type === 'student' ? (
              <div className="form-group">
                <label className="form-label">
                  <School size={18} />
                  Classe *
                </label>
                <input
                  type="text"
                  value={borrowerData.classe || ''}
                  onChange={(e) => handleInputChange('classe', e.target.value)}
                  className={`form-input ${formErrors.classe ? 'error' : ''}`}
                  placeholder="Niveau ou classe de l'étudiant"
                />
                {formErrors.classe && <p className="error-message">{formErrors.classe}</p>}
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">
                  <Building size={18} />
                  Poste/Fonction *
                </label>
                <input
                  type="text"
                  value={borrowerData.position || ''}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`form-input ${formErrors.position ? 'error' : ''}`}
                  placeholder="Poste ou fonction occupée"
                />
                {formErrors.position && <p className="error-message">{formErrors.position}</p>}
              </div>
            )}

            <div className="form-group">
              <label className="form-label">
                <Hash size={18} />
                Numéro CNI (optionnel)
              </label>
              <input
                type="text"
                value={borrowerData.cniNumber || ''}
                onChange={(e) => handleInputChange('cniNumber', e.target.value)}
                className="form-input"
                placeholder="Numéro de carte d'identité"
              />
              <p className="form-help">Numéro de carte d'identité nationale pour identification officielle</p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <Mail size={18} />
                Email (optionnel)
              </label>
              <input
                type="email"
                value={borrowerData.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`form-input ${formErrors.email ? 'error' : ''}`}
                placeholder="adresse@email.com"
              />
              {formErrors.email && <p className="error-message">{formErrors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Phone size={18} />
                Téléphone (optionnel)
              </label>
              <input
                type="tel"
                value={borrowerData.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`form-input ${formErrors.phone ? 'error' : ''}`}
                placeholder="+237 6XX XXX XXX"
              />
              {formErrors.phone && <p className="error-message">{formErrors.phone}</p>}
              <p className="form-help">Numéro de téléphone pour le contact en cas de retard</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container borrowers-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Users size={24} />
            </div>
            <div className="header-text">
              <h1 className="modal-title">Gestion des Emprunteurs</h1>
              <p className="modal-subtitle">
                {borrowers.length} emprunteur(s) • {studentCount} étudiant(s) • {staffCount} personnel(s)
              </p>
            </div>
          </div>
          <button onClick={onClose} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-icon student">
              <GraduationCap size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{studentCount}</span>
              <span className="stat-label">Étudiants</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon staff">
              <Briefcase size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{staffCount}</span>
              <span className="stat-label">Personnel</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon total">
              <Users size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-value">{borrowers.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Rechercher un emprunteur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-controls">
            <div className="filter-group">
              <Filter size={18} />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as 'all' | 'student' | 'staff')}
                className="filter-select"
              >
                <option value="all">Tous</option>
                <option value="student">Étudiants</option>
                <option value="staff">Personnel</option>
              </select>
            </div>
            
            <button 
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="btn btn-primary"
            >
              <Plus size={16} />
              Nouvel emprunteur
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="modal-content">
          {dataLoading ? (
            <div className="loading-state">
              <div className="spinner" />
              <p>Chargement des emprunteurs...</p>
            </div>
          ) : filteredBorrowers.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <h3>Aucun emprunteur trouvé</h3>
              <p>
                {searchQuery || filterType !== 'all' 
                  ? 'Aucun emprunteur ne correspond à vos critères de recherche.'
                  : 'Commencez par ajouter votre premier emprunteur.'
                }
              </p>
              {!searchQuery && filterType === 'all' && (
                <button 
                  onClick={() => {
                    resetForm();
                    setShowAddModal(true);
                  }}
                  className="btn btn-primary"
                >
                  <Plus size={16} />
                  Ajouter le premier emprunteur
                </button>
              )}
            </div>
          ) : (
            <div className="borrowers-grid">
              {filteredBorrowers.map((borrower) => (
                <div key={borrower.id} className="borrower-card">
                  <div className="borrower-header">
                    <div className={`borrower-type ${borrower.type}`}>
                      {borrower.type === 'student' ? <GraduationCap size={16} /> : <Briefcase size={16} />}
                      <span>{borrower.type === 'student' ? 'Étudiant' : 'Personnel'}</span>
                    </div>
                    <div className="borrower-actions">
                      <button
                        onClick={() => handleEdit(borrower)}
                        className="action-btn edit"
                        title="Modifier"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(borrower)}
                        className="action-btn delete"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="borrower-info">
                    <h4 className="borrower-name">
                      {borrower.firstName} {borrower.lastName}
                    </h4>
                    <p className="borrower-matricule">
                      <Hash size={14} />
                      {borrower.matricule}
                    </p>
                    
                    {borrower.type === 'student' && borrower.classe && (
                      <p className="borrower-detail">
                        <School size={14} />
                        {borrower.classe}
                      </p>
                    )}
                    
                    {borrower.type === 'staff' && borrower.position && (
                      <p className="borrower-detail">
                        <Building size={14} />
                        {borrower.position}
                      </p>
                    )}
                    
                    {borrower.email && (
                      <p className="borrower-contact">
                        <Mail size={14} />
                        {borrower.email}
                      </p>
                    )}
                    
                    {borrower.phone && (
                      <p className="borrower-contact">
                        <Phone size={14} />
                        {borrower.phone}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            {/* Header */}
            <div className="modal-header">
              <div className="header-content">
                <div className="header-icon">
                  <Plus size={24} />
                </div>
                <div className="header-text">
                  <h1 className="modal-title">
                    {editingBorrower ? 'Modifier l\'emprunteur' : 'Nouvel emprunteur'}
                  </h1>
                  <p className="modal-subtitle">
                    Ajouter un nouvel utilisateur à votre bibliothèque
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingBorrower(null);
                  resetForm();
                }} 
                className="close-btn"
              >
                <X size={20} />
              </button>
            </div>

            {/* Progress Steps */}
            <div className="progress-container">
              <div className="progress-steps">
                {[1, 2, 3].map((step) => {
                  const StepIcon = getStepIcon(step);
                  const isActive = step === currentStep;
                  const isCompleted = step < currentStep;
                  
                  return (
                    <div
                      key={step}
                      className={`progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    >
                      <div className="step-indicator">
                        <StepIcon size={16} />
                      </div>
                      <div className="step-info">
                        <span className="step-title">{getStepTitle(step)}</span>
                        <span className="step-description">{getStepDescription(step)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="modal-content">
              {formErrors.submit && (
                <div className="alert alert-error">
                  {formErrors.submit}
                </div>
              )}

              <div className="step-container">
                {renderStepContent()}
              </div>
            </div>

            {/* Actions */}
            <div className="modal-actions">
              <div className="actions-left">
                {currentStep > 1 && (
                  <button onClick={handlePrev} className="btn btn-secondary">
                    Précédent
                  </button>
                )}
              </div>
              
              <div className="actions-right">
                {currentStep < 3 ? (
                  <button onClick={handleNext} className="btn btn-primary">
                    Suivant
                    <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmit} 
                    disabled={isLoading}
                    className="btn btn-success"
                  >
                    {isLoading ? (
                      <>
                        <div className="spinner" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        {editingBorrower ? 'Modifier' : 'Ajouter'}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
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
          max-width: 1000px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .borrowers-modal {
          max-width: 1200px;
        }

        .modal-header {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          padding: 24px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .header-content {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .header-text {
          flex: 1;
        }

        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }

        .modal-subtitle {
          font-size: 14px;
          opacity: 0.8;
          margin: 0;
        }

        .close-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }

        .stats-section {
          background: #FAF9F6;
          padding: 20px 32px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.student {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }

        .stat-icon.staff {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
        }

        .stat-icon.total {
          background: linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%);
          color: #F3EED9;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #2E2E2E !important;
          line-height: 1;
        }

        .stat-label {
          font-size: 12px;
          color: #6E6E6E !important;
          font-weight: 500;
        }

        .controls-section {
          background: #FAF9F6;
          padding: 0 32px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .search-bar {
          position: relative;
          flex: 1;
          min-width: 300px;
        }

        .search-bar svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #6E6E6E;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          border: 2px solid rgba(229, 220, 194, 0.4);
          border-radius: 10px;
          font-size: 14px;
          background: white;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .filter-controls {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          background: white;
          padding: 8px 12px;
          border-radius: 10px;
          border: 2px solid rgba(229, 220, 194, 0.4);
        }

        .filter-select {
          border: none;
          background: none;
          font-size: 14px;
          color: #2E2E2E;
          cursor: pointer;
          min-width: 100px;
        }

        .filter-select:focus {
          outline: none;
        }

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          text-align: center;
        }

        .loading-state .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(62, 92, 73, 0.2);
          border-top: 3px solid #3E5C49;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .empty-state svg {
          color: #6E6E6E;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 20px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0 0 8px 0;
        }

        .empty-state p {
          font-size: 14px;
          color: #6E6E6E;
          margin: 0 0 24px 0;
          max-width: 400px;
          line-height: 1.5;
        }

        .borrowers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .borrower-card {
          background: white;
          border-radius: 16px;
          border: 2px solid rgba(229, 220, 194, 0.3);
          padding: 20px;
          transition: all 0.2s ease;
        }

        .borrower-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          border-color: rgba(62, 92, 73, 0.2);
        }

        .borrower-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .borrower-type {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .borrower-type.student {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .borrower-type.staff {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }

        .borrower-actions {
          display: flex;
          gap: 6px;
        }

        .action-btn {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .action-btn.edit {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }

        .action-btn.edit:hover {
          background: rgba(62, 92, 73, 0.2);
          transform: scale(1.05);
        }

        .action-btn.delete {
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
        }

        .action-btn.delete:hover {
          background: rgba(220, 38, 38, 0.2);
          transform: scale(1.05);
        }

        .borrower-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .borrower-name {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }

        .borrower-matricule {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6E6E6E;
          font-weight: 500;
          margin: 0;
        }

        .borrower-detail,
        .borrower-contact {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          color: #6E6E6E;
          margin: 0;
        }

        .borrower-contact {
          color: #4A4A4A;
        }

        .progress-container {
          padding: 24px 32px 0;
          background: #FAF9F6;
          border-bottom: 1px solid rgba(229, 220, 194, 0.4);
        }

        .progress-steps {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .progress-step {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          opacity: 0.5;
          transition: all 0.3s ease;
        }

        .progress-step.active,
        .progress-step.completed {
          opacity: 1;
        }

        .step-indicator {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(229, 220, 194, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6E6E6E;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .progress-step.active .step-indicator {
          background: #3E5C49;
          color: #F3EED9;
        }

        .progress-step.completed .step-indicator {
          background: #C2571B;
          color: #F3EED9;
        }

        .step-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .step-title {
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          line-height: 1.2;
        }

        .step-description {
          font-size: 12px;
          color: #4A4A4A;
          line-height: 1.2;
        }

        .progress-bar {
          height: 4px;
          background: rgba(229, 220, 194, 0.3);
          border-radius: 2px;
          overflow: hidden;
          margin-bottom: 24px;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #3E5C49 0%, #C2571B 100%);
          transition: width 0.3s ease;
          border-radius: 2px;
        }

        .step-container {
          min-height: 300px;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid rgba(229, 220, 194, 0.4);
          border-radius: 10px;
          font-size: 14px;
          background: white;
          color: #2E2E2E;
          transition: all 0.2s ease;
          box-sizing: border-box;
        }

        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .form-input.error {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .radio-group {
          display: flex;
          gap: 16px;
        }

        .radio-option {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 2px solid rgba(229, 220, 194, 0.4);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
        }

        .radio-option:hover {
          border-color: #3E5C49;
        }

        .radio-option.selected {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .radio-option input[type="radio"] {
          display: none;
        }

        .form-help {
          font-size: 12px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.4;
        }

        .error-message {
          color: #dc2626;
          font-size: 12px;
          font-weight: 500;
          margin: 0;
          padding: 4px 8px;
          background: #fef2f2;
          border-radius: 6px;
          border-left: 3px solid #dc2626;
        }

        .alert {
          padding: 16px;
          border-radius: 12px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 500;
        }

        .alert-error {
          background: #fef2f2;
          color: #dc2626;
          border: 1px solid #fecaca;
        }

        .modal-actions {
          padding: 24px 32px;
          background: #FAF9F6;
          border-top: 1px solid rgba(229, 220, 194, 0.4);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .actions-left,
        .actions-right {
          display: flex;
          gap: 12px;
        }

        .btn {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 120px;
          justify-content: center;
        }

        .btn-secondary {
          background: #F3EED9;
          color: #2E2E2E;
          border: 1px solid rgba(229, 220, 194, 0.4);
        }

        .btn-secondary:hover {
          background: #E5DCC2;
          transform: translateY(-1px);
        }

        .btn-primary {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1F2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }

        .btn-success {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
        }

        .btn-success:hover:not(:disabled) {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(194, 87, 27, 0.3);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .modal-overlay {
            padding: 16px;
          }

          .modal-container {
            max-height: 95vh;
          }

          .modal-header {
            padding: 20px 24px;
          }

          .stats-section {
            padding: 16px 24px;
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .controls-section {
            padding: 0 24px 16px;
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .search-bar {
            min-width: auto;
          }

          .filter-controls {
            justify-content: space-between;
          }

          .modal-content {
            padding: 24px;
          }

          .borrowers-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .radio-group {
            flex-direction: column;
          }

          .modal-actions {
            padding: 20px 24px;
            flex-direction: column;
            gap: 12px;
          }

          .actions-left,
          .actions-right {
            width: 100%;
          }

          .btn {
            width: 100%;
            min-width: auto;
          }

          .progress-steps {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
          }
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 12px;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-title {
            font-size: 20px;
          }

          .modal-subtitle {
            font-size: 13px;
          }

          .stats-section {
            padding: 12px 20px;
          }

          .controls-section {
            padding: 0 20px 12px;
          }

          .modal-content {
            padding: 20px;
          }

          .borrower-card {
            padding: 16px;
          }

          .modal-actions {
            padding: 16px 20px;
          }
        }
      `}</style>
    </div>
  );
}