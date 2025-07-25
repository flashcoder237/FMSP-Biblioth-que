import React, { useState, useEffect } from 'react';
import { Document, Borrower } from '../../types';
import { 
  Heart, 
  X, 
  User, 
  BookOpen, 
  Calendar, 
  Clock, 
  Search, 
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Users,
  Tag,
  Building,
  ChevronRight,
  Save,
  Plus,
  UserPlus,
  ArrowLeft
} from 'lucide-react';
import { useQuickToast } from './ToastSystem';

interface BorrowDocumentProps {
  document: Document;
  borrowers: Borrower[];
  onBorrow: (documentId: number, borrowerId: number, returnDate: string) => Promise<void>;
  onReturn: (documentId: number) => Promise<void>;
  onCancel: () => void;
  onAddBorrower?: (borrower: Omit<Borrower, 'id'>) => Promise<number>;
}

export const BorrowDocument: React.FC<BorrowDocumentProps> = ({
  document,
  borrowers,
  onBorrow,
  onReturn,
  onCancel,
  onAddBorrower
}) => {
  const { success, error, info } = useQuickToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(null);
  const [returnDate, setReturnDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredBorrowers, setFilteredBorrowers] = useState<Borrower[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // States for new borrower creation
  const [showCreateBorrower, setShowCreateBorrower] = useState(false);
  const [newBorrowerData, setNewBorrowerData] = useState({
    type: 'student' as 'student' | 'staff',
    firstName: '',
    lastName: '',
    matricule: '',
    classe: '',
    cniNumber: '',
    position: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    // Set default return date to 2 weeks from today
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 14);
    setReturnDate(defaultDate.toISOString().split('T')[0]);
  }, []);

  useEffect(() => {
    filterBorrowers();
  }, [borrowers, searchTerm]);

  const filterBorrowers = () => {
    if (!searchTerm) {
      setFilteredBorrowers(borrowers);
      return;
    }

    const filtered = borrowers.filter(borrower =>
      `${borrower.firstName} ${borrower.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      borrower.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (borrower.classe && borrower.classe.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (borrower.position && borrower.position.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredBorrowers(filtered);
  };

  const handleBorrow = async () => {
    if (!selectedBorrowerId || !returnDate) {
      error('Informations manquantes', 'Veuillez sélectionner un emprunteur et une date de retour');
      return;
    }

    if (!document.id) {
      error('Erreur document', 'ID du document manquant');
      return;
    }

    setIsLoading(true);
    try {
      await onBorrow(document.id, selectedBorrowerId, returnDate);
      const borrower = borrowers.find(b => b.id === selectedBorrowerId);
      success(
        'Emprunt enregistré', 
        `"${document.titre}" emprunté par ${borrower?.firstName} ${borrower?.lastName}`
      );
    } catch (err) {
      console.error('Erreur d\'emprunt:', err);
      error('Erreur d\'emprunt', `Impossible d'enregistrer l'emprunt: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReturn = async () => {
    setIsLoading(true);
    try {
      await onReturn(document.id!);
      success('Retour enregistré', `"${document.titre}" a été retourné avec succès`);
    } catch (err) {
      error('Erreur de retour', 'Impossible d\'enregistrer le retour');
    } finally {
      setIsLoading(false);
    }
  };

  const getBorrowerTypeIcon = (type: string) => {
    return type === 'student' ? <User size={16} /> : <Users size={16} />;
  };

  const getBorrowerTypeLabel = (type: string) => {
    return type === 'student' ? 'Étudiant' : 'Personnel';
  };

  // Step management functions
  const getStepTitle = (step: number) => {
    if (document.estEmprunte) {
      return 'Confirmer le retour';
    }
    switch(step) {
      case 1: return 'Document à emprunter';
      case 2: return 'Sélection emprunteur';
      case 3: return 'Date de retour';
      default: return 'Emprunt';
    }
  };

  const getStepDescription = (step: number) => {
    if (document.estEmprunte) {
      return 'Finaliser le retour';
    }
    switch(step) {
      case 1: return 'Vérifier les informations';
      case 2: return 'Choisir la personne';
      case 3: return 'Définir l\'échéance';
      default: return '';
    }
  };

  const getStepIcon = (step: number) => {
    if (document.estEmprunte) {
      return CheckCircle;
    }
    switch(step) {
      case 1: return BookOpen;
      case 2: return Users;
      case 3: return Calendar;
      default: return BookOpen;
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 2 && !selectedBorrowerId) {
      newErrors.borrower = 'Veuillez sélectionner un emprunteur';
    }
    if (step === 3 && !returnDate) {
      newErrors.returnDate = 'Veuillez définir une date de retour';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, document.estEmprunte ? 1 : 3));
    }
  };

  const handlePrev = () => {
    if (showCreateBorrower) {
      setShowCreateBorrower(false);
      setErrors({});
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  };

  // New borrower creation functions
  const handleNewBorrowerChange = (field: string, value: string) => {
    setNewBorrowerData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateNewBorrower = () => {
    const newErrors: Record<string, string> = {};

    if (!newBorrowerData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est obligatoire';
    }
    if (!newBorrowerData.lastName.trim()) {
      newErrors.lastName = 'Le nom est obligatoire';
    }
    if (!newBorrowerData.matricule.trim()) {
      newErrors.matricule = 'Le matricule est obligatoire';
    }
    if (newBorrowerData.type === 'student' && !newBorrowerData.classe.trim()) {
      newErrors.classe = 'La classe est obligatoire pour les étudiants';
    }
    if (newBorrowerData.type === 'staff' && !newBorrowerData.position.trim()) {
      newErrors.position = 'Le poste est obligatoire pour le personnel';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateBorrower = async () => {
    if (!validateNewBorrower() || !onAddBorrower) return;

    setIsLoading(true);
    try {
      const borrowerToCreate: Omit<Borrower, 'id'> = {
        ...newBorrowerData,
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        version: 1,
        createdAt: new Date().toISOString()
      };

      const newBorrowerId = await onAddBorrower(borrowerToCreate);
      
      // Reset form and select the new borrower
      setNewBorrowerData({
        type: 'student',
        firstName: '',
        lastName: '',
        matricule: '',
        classe: '',
        cniNumber: '',
        position: '',
        email: '',
        phone: ''
      });
      
      setSelectedBorrowerId(newBorrowerId);
      setShowCreateBorrower(false);
      
      success(
        'Emprunteur créé',
        `${borrowerToCreate.firstName} ${borrowerToCreate.lastName} a été ajouté avec succès`
      );
      
    } catch (err) {
      console.error('Erreur création emprunteur:', err);
      error('Erreur de création', 'Impossible de créer l\'emprunteur');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to render step content
  const renderStepContent = () => {
    if (document.estEmprunte) {
      return (
        <div className="step-content">
          <div className="return-info">
            <p className="return-message">
              Ce document sera marqué comme disponible et pourra être emprunté à nouveau.
            </p>
            <div className="return-date-info">
              <Clock size={16} />
              <span>Retour effectué le {new Date().toLocaleDateString('fr-FR')}</span>
            </div>
          </div>
        </div>
      );
    }

    switch(currentStep) {
      case 1:
        return (
          <div className="step-content">
            <div className="document-preview">
              <div className="document-icon">
                <BookOpen size={24} />
              </div>
              <div className="document-details">
                <h3 className="document-title">{document.titre}</h3>
                <p className="document-author">
                  <User size={14} />
                  {document.auteur}
                </p>
                <div className="document-meta">
                  <span className="meta-item">
                    <Building size={12} />
                    {document.editeur}
                  </span>
                  <span className="meta-item">
                    <Calendar size={12} />
                    {document.annee}
                  </span>
                  <span className="meta-item">
                    <Tag size={12} />
                    {document.cote}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        if (showCreateBorrower) {
          return (
            <div className="step-content">
              <div className="create-borrower-header">
                <div className="form-group">
                  <label className="form-label">
                    <User size={18} />
                    Type d'emprunteur *
                  </label>
                  <div className="borrower-type-selector">
                    <button
                      type="button"
                      className={`type-btn ${newBorrowerData.type === 'student' ? 'active' : ''}`}
                      onClick={() => handleNewBorrowerChange('type', 'student')}
                    >
                      <User size={16} />
                      Étudiant
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${newBorrowerData.type === 'staff' ? 'active' : ''}`}
                      onClick={() => handleNewBorrowerChange('type', 'staff')}
                    >
                      <Users size={16} />
                      Personnel
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input
                    type="text"
                    value={newBorrowerData.firstName}
                    onChange={(e) => handleNewBorrowerChange('firstName', e.target.value)}
                    className={`form-input ${errors.firstName ? 'error' : ''}`}
                    placeholder="Prénom"
                    autoFocus
                  />
                  {errors.firstName && <p className="error-message">{errors.firstName}</p>}
                </div>

                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    value={newBorrowerData.lastName}
                    onChange={(e) => handleNewBorrowerChange('lastName', e.target.value)}
                    className={`form-input ${errors.lastName ? 'error' : ''}`}
                    placeholder="Nom de famille"
                  />
                  {errors.lastName && <p className="error-message">{errors.lastName}</p>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Matricule *</label>
                <input
                  type="text"
                  value={newBorrowerData.matricule}
                  onChange={(e) => handleNewBorrowerChange('matricule', e.target.value)}
                  className={`form-input ${errors.matricule ? 'error' : ''}`}
                  placeholder="Numéro de matricule"
                />
                {errors.matricule && <p className="error-message">{errors.matricule}</p>}
              </div>

              {newBorrowerData.type === 'student' ? (
                <div className="form-group">
                  <label className="form-label">Classe *</label>
                  <input
                    type="text"
                    value={newBorrowerData.classe}
                    onChange={(e) => handleNewBorrowerChange('classe', e.target.value)}
                    className={`form-input ${errors.classe ? 'error' : ''}`}
                    placeholder="ex: L3 Informatique, Master 2..."
                  />
                  {errors.classe && <p className="error-message">{errors.classe}</p>}
                </div>
              ) : (
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Poste *</label>
                    <input
                      type="text"
                      value={newBorrowerData.position}
                      onChange={(e) => handleNewBorrowerChange('position', e.target.value)}
                      className={`form-input ${errors.position ? 'error' : ''}`}
                      placeholder="Fonction ou poste"
                    />
                    {errors.position && <p className="error-message">{errors.position}</p>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">N° CNI (optionnel)</label>
                    <input
                      type="text"
                      value={newBorrowerData.cniNumber}
                      onChange={(e) => handleNewBorrowerChange('cniNumber', e.target.value)}
                      className="form-input"
                      placeholder="Numéro de carte d'identité"
                    />
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email (optionnel)</label>
                  <input
                    type="email"
                    value={newBorrowerData.email}
                    onChange={(e) => handleNewBorrowerChange('email', e.target.value)}
                    className="form-input"
                    placeholder="adresse@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone (optionnel)</label>
                  <input
                    type="tel"
                    value={newBorrowerData.phone}
                    onChange={(e) => handleNewBorrowerChange('phone', e.target.value)}
                    className="form-input"
                    placeholder="+237 6XX XXX XXX"
                  />
                </div>
              </div>
            </div>
          );
        }

        return (
          <div className="step-content">
            <div className="borrower-selection-header">
              <div className="form-group">
                <label className="form-label">
                  <Search size={18} />
                  Rechercher un emprunteur
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input"
                  placeholder="Rechercher par nom, matricule, email..."
                  autoFocus
                />
              </div>

              {onAddBorrower && (
                <div className="create-borrower-action">
                  <button
                    type="button"
                    className="create-borrower-btn"
                    onClick={() => setShowCreateBorrower(true)}
                  >
                    <UserPlus size={16} />
                    Créer un nouvel emprunteur
                  </button>
                </div>
              )}
            </div>

            <div className="borrowers-list">
              {filteredBorrowers.slice(0, 6).map((borrower) => (
                <div
                  key={borrower.id}
                  className={`borrower-item ${selectedBorrowerId === borrower.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBorrowerId(borrower.id!)}
                >
                  <div className="borrower-avatar">
                    {getBorrowerTypeIcon(borrower.type)}
                  </div>
                  <div className="borrower-info">
                    <div className="borrower-name">
                      {borrower.firstName} {borrower.lastName}
                    </div>
                    <div className="borrower-details">
                      <span className="borrower-type">
                        {getBorrowerTypeLabel(borrower.type)}
                      </span>
                      <span className="borrower-matricule">
                        {borrower.matricule}
                      </span>
                      {(borrower.classe || borrower.position) && (
                        <span className="borrower-class">
                          {borrower.classe || borrower.position}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="selection-indicator">
                    {selectedBorrowerId === borrower.id && (
                      <CheckCircle size={20} />
                    )}
                  </div>
                </div>
              ))}
              
              {filteredBorrowers.length === 0 && searchTerm && (
                <div className="no-borrowers">
                  <Users size={32} />
                  <p>Aucun emprunteur trouvé</p>
                  {onAddBorrower && (
                    <button
                      type="button"
                      className="create-from-search-btn"
                      onClick={() => {
                        setShowCreateBorrower(true);
                        // Pre-fill with search term if it looks like a name
                        const names = searchTerm.split(' ');
                        if (names.length >= 2) {
                          setNewBorrowerData(prev => ({
                            ...prev,
                            firstName: names[0],
                            lastName: names.slice(1).join(' ')
                          }));
                        }
                      }}
                    >
                      <UserPlus size={16} />
                      Créer "{searchTerm}"
                    </button>
                  )}
                </div>
              )}

              {filteredBorrowers.length === 0 && !searchTerm && (
                <div className="no-borrowers">
                  <Users size={32} />
                  <p>Aucun emprunteur enregistré</p>
                  {onAddBorrower && (
                    <button
                      type="button"
                      className="create-from-search-btn"
                      onClick={() => setShowCreateBorrower(true)}
                    >
                      <UserPlus size={16} />
                      Créer le premier emprunteur
                    </button>
                  )}
                </div>
              )}
            </div>
            {errors.borrower && <p className="error-message">{errors.borrower}</p>}
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <Calendar size={18} />
                Date de retour prévue *
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className={`form-input ${errors.returnDate ? 'error' : ''}`}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.returnDate && <p className="error-message">{errors.returnDate}</p>}
              <p className="form-help">
                <Clock size={14} />
                Durée d'emprunt recommandée: 14 jours
              </p>
            </div>

            {selectedBorrowerId && (
              <div className="selected-borrower-preview">
                {(() => {
                  const borrower = borrowers.find(b => b.id === selectedBorrowerId);
                  return borrower ? (
                    <div className="borrower-preview-card">
                      <div className="borrower-avatar">
                        {getBorrowerTypeIcon(borrower.type)}
                      </div>
                      <div className="borrower-info">
                        <div className="borrower-name">
                          {borrower.firstName} {borrower.lastName}
                        </div>
                        <div className="borrower-details">
                          <span className="borrower-type">
                            {getBorrowerTypeLabel(borrower.type)}
                          </span>
                          <span className="borrower-matricule">
                            {borrower.matricule}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Heart size={24} />
            </div>
            <div className="header-text">
              <h1 className="modal-title">
                {document.estEmprunte ? 'Retourner le document' : 'Nouvel emprunt'}
              </h1>
              <p className="modal-subtitle">
                {document.estEmprunte 
                  ? 'Finalisez le retour de ce document' 
                  : 'Prêtez ce document à un membre de votre institution'
                }
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="close-btn">
            <X size={20} />
          </button>
        </div>

        {/* Progress Steps */}
        {!document.estEmprunte && (
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
        )}

        {/* Content */}
        <div className="modal-content">
          {errors.submit && (
            <div className="alert alert-error">
              {errors.submit}
            </div>
          )}

          <div className="step-container">
            {renderStepContent()}
          </div>
        </div>

        {/* Actions */}
        <div className="modal-actions">
          <div className="actions-left">
            {(currentStep > 1 || showCreateBorrower) && !document.estEmprunte && (
              <button onClick={handlePrev} className="btn btn-secondary">
                {showCreateBorrower ? (
                  <>
                    <ArrowLeft size={16} />
                    Retour à la liste
                  </>
                ) : (
                  'Précédent'
                )}
              </button>
            )}
          </div>
          
          <div className="actions-right">
            {document.estEmprunte ? (
              <button 
                onClick={handleReturn} 
                disabled={isLoading}
                className="btn btn-success"
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirmer le retour
                  </>
                )}
              </button>
            ) : showCreateBorrower ? (
              <button 
                onClick={handleCreateBorrower} 
                disabled={isLoading}
                className="btn btn-success"
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    Création...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Créer et sélectionner
                  </>
                )}
              </button>
            ) : currentStep < 3 ? (
              <button onClick={handleNext} className="btn btn-primary">
                Suivant
                <ChevronRight size={16} />
              </button>
            ) : (
              <button 
                onClick={handleBorrow} 
                disabled={isLoading || !selectedBorrowerId || !returnDate}
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
                    Confirmer l'emprunt
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
      
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
          max-width: 700px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
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
          background: rgba(243, 238, 217, 0.1);
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
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          z-index: 10;
        }

        .close-btn:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
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

        .modal-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
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

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
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

        .form-help {
          font-size: 12px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.4;
          display: flex;
          align-items: center;
          gap: 6px;
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

        .document-preview {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px;
          background: rgba(194, 87, 27, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(194, 87, 27, 0.1);
        }

        .document-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          box-shadow: 0 8px 32px rgba(194, 87, 27, 0.3);
        }

        .document-details {
          flex: 1;
        }

        .document-title {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .document-author {
          font-size: 16px;
          color: #4A4A4A;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .document-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: #4A4A4A;
          background: rgba(62, 92, 73, 0.1);
          padding: 4px 10px;
          border-radius: 16px;
        }

        .borrowers-list {
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-top: 16px;
        }

        .borrower-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 20px;
          background: #FFFFFF;
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .borrower-item:hover {
          border-color: rgba(62, 92, 73, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .borrower-item.selected {
          border-color: #3E5C49;
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.05) 0%, rgba(62, 92, 73, 0.1) 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(62, 92, 73, 0.2);
        }

        .borrower-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #E5DCC2 0%, #F3EED9 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #4A4A4A;
          flex-shrink: 0;
        }

        .borrower-item.selected .borrower-avatar {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }

        .borrower-info {
          flex: 1;
          min-width: 0;
        }

        .borrower-name {
          font-size: 16px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 4px;
        }

        .borrower-details {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 12px;
        }

        .borrower-type,
        .borrower-matricule,
        .borrower-class {
          color: #4A4A4A;
          background: rgba(110, 110, 110, 0.1);
          padding: 2px 8px;
          border-radius: 6px;
          font-size: 12px;
        }

        .selection-indicator {
          color: #3E5C49;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .borrower-item.selected .selection-indicator {
          opacity: 1;
        }

        .no-borrowers {
          text-align: center;
          padding: 40px 20px;
          color: #4A4A4A;
        }

        .no-borrowers svg {
          margin: 0 auto 16px;
          opacity: 0.5;
        }

        .selected-borrower-preview {
          margin-top: 16px;
        }

        .borrower-preview-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(62, 92, 73, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(62, 92, 73, 0.1);
        }

        .return-info {
          background: rgba(62, 92, 73, 0.05);
          border-radius: 12px;
          padding: 20px;
        }

        .return-message {
          font-size: 16px;
          color: #2E2E2E;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .return-date-info {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #3E5C49;
          font-weight: 600;
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
          border: 2px solid rgba(243, 238, 217, 0.3);
          border-top: 2px solid #F3EED9;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        /* Scrollbar personnalisé */
        .borrowers-list::-webkit-scrollbar {
          width: 8px;
        }

        .borrowers-list::-webkit-scrollbar-track {
          background: rgba(229, 220, 194, 0.2);
          border-radius: 4px;
        }

        .borrowers-list::-webkit-scrollbar-thumb {
          background: rgba(62, 92, 73, 0.3);
          border-radius: 4px;
        }

        .borrowers-list::-webkit-scrollbar-thumb:hover {
          background: rgba(62, 92, 73, 0.5);
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

          .header-content {
            gap: 12px;
          }

          .header-icon {
            width: 40px;
            height: 40px;
          }

          .modal-title {
            font-size: 20px;
          }

          .progress-container {
            padding: 20px 24px 0;
          }

          .progress-steps {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
          }

          .progress-step {
            flex-direction: row;
            gap: 12px;
          }

          .step-info {
            flex: 1;
          }

          .modal-content {
            padding: 24px;
          }

          .document-preview {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }

          .document-meta {
            justify-content: center;
          }

          .modal-actions {
            flex-direction: column;
            gap: 12px;
          }

          .borrowers-list {
            max-height: 200px;
          }

          .borrower-item {
            padding: 12px 16px;
          }

          .borrower-details {
            flex-direction: column;
            gap: 4px;
          }
        }

        /* New Borrower Creation Styles */
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .borrower-type-selector {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .type-btn {
          flex: 1;
          padding: 12px 16px;
          border: 2px solid rgba(229, 220, 194, 0.4);
          border-radius: 10px;
          background: white;
          color: #2E2E2E;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .type-btn:hover {
          border-color: #3E5C49;
          background: rgba(62, 92, 73, 0.05);
        }

        .type-btn.active {
          border-color: #3E5C49;
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.1) 0%, rgba(62, 92, 73, 0.05) 100%);
          color: #3E5C49;
          font-weight: 600;
        }

        .borrower-selection-header {
          margin-bottom: 20px;
        }

        .create-borrower-action {
          margin-top: 16px;
        }

        .create-borrower-btn {
          width: 100%;
          padding: 12px 16px;
          border: 2px dashed rgba(194, 87, 27, 0.3);
          border-radius: 10px;
          background: rgba(194, 87, 27, 0.05);
          color: #C2571B;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .create-borrower-btn:hover {
          border-color: #C2571B;
          background: rgba(194, 87, 27, 0.1);
          transform: translateY(-1px);
        }

        .create-from-search-btn {
          margin-top: 16px;
          padding: 10px 16px;
          border: 2px solid #3E5C49;
          border-radius: 8px;
          background: #3E5C49;
          color: #F3EED9;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .create-from-search-btn:hover {
          background: #2E453A;
          transform: translateY(-1px);
        }

        .create-borrower-header {
          margin-bottom: 24px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(229, 220, 194, 0.3);
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .borrower-type-selector {
            flex-direction: column;
            gap: 8px;
          }
        }
      `}</style>
    </div>
  );
};