import React, { useState, useEffect } from 'react';
import { Save, X, Plus, BookOpen, User, Building, MapPin, Calendar, Tag, Hash, FileText, Image, Sparkles, ChevronRight } from 'lucide-react';
import { Document } from '../../types';

interface Author {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface AddDocumentProps {
  onAdd: (document: Omit<Document, 'id'>) => Promise<void>;
  onCancel: () => void;
  editingDocument?: Document;
}

export const AddDocument: React.FC<AddDocumentProps> = ({ onAdd, onCancel, editingDocument }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    auteur: '',
    titre: '',
    editeur: '',
    lieuEdition: '',
    annee: new Date().getFullYear().toString(),
    descripteurs: '',
    cote: '',
    isbn: '',
    description: '',
    couverture: '',
    estEmprunte: false,
    syncStatus: 'pending' as 'synced' | 'pending' | 'conflict' | 'error',
    lastModified: new Date().toISOString(),
    version: 1
  });

  const [authors, setAuthors] = useState<Author[]>([
    { id: '1', name: 'Victor Hugo' },
    { id: '2', name: 'Marcel Proust' },
    { id: '3', name: 'Simone de Beauvoir' }
  ]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingDocument) {
      setFormData({
        auteur: editingDocument.auteur,
        titre: editingDocument.titre,
        editeur: editingDocument.editeur,
        lieuEdition: editingDocument.lieuEdition,
        annee: editingDocument.annee,
        descripteurs: editingDocument.descripteurs,
        cote: editingDocument.cote,
        isbn: editingDocument.isbn || '',
        description: editingDocument.description || '',
        couverture: editingDocument.couverture || '',
        estEmprunte: editingDocument.estEmprunte,
        syncStatus: editingDocument.syncStatus,
        lastModified: editingDocument.lastModified,
        version: editingDocument.version
      });
    }
  }, [editingDocument]);

  const generateCote = () => {
    if (formData.descripteurs && formData.auteur && formData.annee) {
      const category = formData.descripteurs.split(',')[0].trim().toUpperCase();
      const authorCode = formData.auteur.split(' ').map(name => name.substring(0, 3).toUpperCase()).join('-');
      const yearCode = formData.annee.substring(2);
      const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
      
      const generatedCote = `${category.substring(0, 3)}-${authorCode}-${yearCode}${randomNum}`;
      setFormData(prev => ({ ...prev, cote: generatedCote }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.auteur.trim()) newErrors.auteur = 'L\'auteur est obligatoire';
      if (!formData.titre.trim()) newErrors.titre = 'Le titre est obligatoire';
      if (!formData.editeur.trim()) newErrors.editeur = 'L\'éditeur est obligatoire';
    }

    if (step === 2) {
      if (!formData.lieuEdition.trim()) newErrors.lieuEdition = 'Le lieu d\'édition est obligatoire';
      if (!formData.annee.trim()) newErrors.annee = 'L\'année est obligatoire';
      const year = parseInt(formData.annee);
      if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 10) {
        newErrors.annee = 'Année invalide';
      }
    }

    if (step === 3) {
      if (!formData.descripteurs.trim()) newErrors.descripteurs = 'Les descripteurs sont obligatoires';
      if (!formData.cote.trim()) newErrors.cote = 'La cote est obligatoire';
      if (formData.isbn && !/^(978|979)?[0-9]{9}[0-9X]$/.test(formData.isbn.replace(/-/g, ''))) {
        newErrors.isbn = 'Format ISBN invalide';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      return;
    }

    setIsLoading(true);
    
    try {
      const documentData: Omit<Document, 'id'> = {
        ...formData,
        estEmprunte: false,
        syncStatus: 'pending' as 'synced' | 'pending' | 'conflict' | 'error',
        lastModified: new Date().toISOString(),
        version: editingDocument ? editingDocument.version + 1 : 1
      };

      await onAdd(documentData);
      
      if (!editingDocument) {
        setFormData({
          auteur: '',
          titre: '',
          editeur: '',
          lieuEdition: '',
          annee: new Date().getFullYear().toString(),
          descripteurs: '',
          cote: '',
          isbn: '',
          description: '',
          couverture: '',
          estEmprunte: false,
          syncStatus: 'pending' as 'synced' | 'pending' | 'conflict' | 'error',
          lastModified: new Date().toISOString(),
          version: 1
        });
        setCurrentStep(1);
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du document:', error);
      setErrors({ submit: 'Erreur lors de l\'enregistrement du document' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const getStepTitle = (step: number) => {
    switch(step) {
      case 1: return 'Informations principales';
      case 2: return 'Publication';
      case 3: return 'Classification';
      default: return '';
    }
  };

  const getStepDescription = (step: number) => {
    switch(step) {
      case 1: return 'Identifiez l\'œuvre et son auteur';
      case 2: return 'Détails de publication';
      case 3: return 'Organisation et métadonnées';
      default: return '';
    }
  };

  const getStepIcon = (step: number) => {
    switch(step) {
      case 1: return BookOpen;
      case 2: return Calendar;
      case 3: return Tag;
      default: return BookOpen;
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
                Auteur *
              </label>
              <input
                type="text"
                value={formData.auteur}
                onChange={(e) => handleInputChange('auteur', e.target.value)}
                className={`form-input ${errors.auteur ? 'error' : ''}`}
                placeholder="Nom complet de l'auteur"
                list="authors-list"
                autoFocus
              />
              <datalist id="authors-list">
                {authors.map(author => (
                  <option key={author.id} value={author.name} />
                ))}
              </datalist>
              {errors.auteur && <p className="error-message">{errors.auteur}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <BookOpen size={18} />
                Titre du document *
              </label>
              <input
                type="text"
                value={formData.titre}
                onChange={(e) => handleInputChange('titre', e.target.value)}
                className={`form-input ${errors.titre ? 'error' : ''}`}
                placeholder="Titre complet de l'œuvre"
              />
              {errors.titre && <p className="error-message">{errors.titre}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Building size={18} />
                Éditeur *
              </label>
              <input
                type="text"
                value={formData.editeur}
                onChange={(e) => handleInputChange('editeur', e.target.value)}
                className={`form-input ${errors.editeur ? 'error' : ''}`}
                placeholder="Nom de la maison d'édition"
              />
              {errors.editeur && <p className="error-message">{errors.editeur}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <MapPin size={18} />
                  Lieu d'édition *
                </label>
                <input
                  type="text"
                  value={formData.lieuEdition}
                  onChange={(e) => handleInputChange('lieuEdition', e.target.value)}
                  className={`form-input ${errors.lieuEdition ? 'error' : ''}`}
                  placeholder="Ville de publication"
                />
                {errors.lieuEdition && <p className="error-message">{errors.lieuEdition}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Calendar size={18} />
                  Année de publication *
                </label>
                <input
                  type="number"
                  value={formData.annee}
                  onChange={(e) => handleInputChange('annee', e.target.value)}
                  className={`form-input ${errors.annee ? 'error' : ''}`}
                  placeholder="YYYY"
                  min="1000"
                  max={new Date().getFullYear() + 10}
                />
                {errors.annee && <p className="error-message">{errors.annee}</p>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                ISBN (optionnel)
              </label>
              <input
                type="text"
                value={formData.isbn}
                onChange={(e) => handleInputChange('isbn', e.target.value)}
                className={`form-input ${errors.isbn ? 'error' : ''}`}
                placeholder="978-2-123456-78-9"
              />
              {errors.isbn && <p className="error-message">{errors.isbn}</p>}
              <p className="form-help">Format standard ISBN-13 ou ISBN-10</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Image size={18} />
                Image de couverture (optionnel)
              </label>
              <div className="file-input-group">
                <input
                  type="text"
                  value={formData.couverture}
                  onChange={(e) => handleInputChange('couverture', e.target.value)}
                  className="form-input"
                  placeholder="Chemin vers l'image ou URL"
                  readOnly
                />
                <button
                  type="button"
                  className="file-browse-btn"
                  onClick={() => {
                    // Simulation de sélection de fichier
                    setFormData(prev => ({ ...prev, couverture: '/path/to/cover.jpg' }));
                  }}
                >
                  Parcourir
                </button>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="form-group">
              <label className="form-label">
                <Tag size={18} />
                Descripteurs / Mots-clés *
              </label>
              <input
                type="text"
                value={formData.descripteurs}
                onChange={(e) => handleInputChange('descripteurs', e.target.value)}
                className={`form-input ${errors.descripteurs ? 'error' : ''}`}
                placeholder="Fiction, Roman historique, XIXe siècle..."
              />
              {errors.descripteurs && <p className="error-message">{errors.descripteurs}</p>}
              <p className="form-help">Séparez les mots-clés par des virgules pour faciliter la recherche</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                <Hash size={18} />
                Cote de classification *
              </label>
              <div className="input-with-action">
                <input
                  type="text"
                  value={formData.cote}
                  onChange={(e) => handleInputChange('cote', e.target.value)}
                  className={`form-input ${errors.cote ? 'error' : ''}`}
                  placeholder="Code unique de classification"
                />
                <button
                  type="button"
                  onClick={generateCote}
                  className="action-btn generate-btn"
                  title="Générer automatiquement"
                  disabled={!formData.descripteurs || !formData.auteur || !formData.annee}
                >
                  <Sparkles size={16} />
                  Générer
                </button>
              </div>
              {errors.cote && <p className="error-message">{errors.cote}</p>}
              <p className="form-help">La cote est générée automatiquement basée sur les descripteurs, l'auteur et l'année</p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Description détaillée (optionnel)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="form-textarea"
                rows={4}
                placeholder="Résumé, notes personnelles, contexte historique..."
              />
              <p className="form-help">Ajoutez toute information utile pour identifier ou contextualiser ce document</p>
            </div>
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
              <Plus size={24} />
            </div>
            <div className="header-text">
              <h1 className="modal-title">
                {editingDocument ? 'Modifier le document' : 'Nouveau document'}
              </h1>
              <p className="modal-subtitle">
                Enrichissez votre bibliothèque
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="close-btn">
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
                    {editingDocument ? 'Modifier' : 'Ajouter'}
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
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
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

        .form-input,
        .form-textarea {
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

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }

        .form-input.error {
          border-color: #dc2626;
          background: #fef2f2;
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
          font-family: inherit;
        }

        .file-input-group,
        .input-with-action {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .file-input-group .form-input,
        .input-with-action .form-input {
          flex: 1;
        }

        .file-browse-btn,
        .action-btn {
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .file-browse-btn {
          background: #6E6E6E;
          color: #F3EED9;
        }

        .file-browse-btn:hover {
          background: #5A5A5A;
          transform: translateY(-1px);
        }

        .generate-btn {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
        }

        .generate-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(194, 87, 27, 0.3);
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
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

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
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

          .form-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .file-input-group,
          .input-with-action {
            flex-direction: column;
            gap: 8px;
          }

          .file-browse-btn,
          .action-btn {
            width: 100%;
            justify-content: center;
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
        }

        @media (max-width: 480px) {
          .modal-overlay {
            padding: 12px;
          }

          .modal-header {
            padding: 16px 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .modal-subtitle {
            font-size: 13px;
          }

          .progress-container {
            padding: 16px 20px 0;
          }

          .modal-content {
            padding: 20px;
          }

          .step-content {
            gap: 20px;
          }

          .modal-actions {
            padding: 16px 20px;
          }
        }

        /* États de focus améliorés pour l'accessibilité */
        .btn:focus-visible,
        .form-input:focus-visible,
        .form-textarea:focus-visible {
          outline: 2px solid #3bf69fff;
          outline-offset: 2px;
        }

        .close-btn:focus-visible {
          outline: 2px solid white;
          outline-offset: 2px;
        }

        /* Animation d'entrée du modal */
        .modal-container {
          animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        /* Amélioration des transitions entre les étapes */
        .step-container {
          position: relative;
          overflow: hidden;
        }

        .step-content {
          position: relative;
          z-index: 1;
        }

        /* Style pour les suggestions d'autocomplétion */
        .form-input[list]::-webkit-list-button {
          display: none;
        }

        /* Amélioration visuelle des états d'erreur */
        .form-input.error:focus {
          border-color: #dc2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }

        /* Style pour les placeholders */
        .form-input::placeholder,
        .form-textarea::placeholder {
          color: #9ca3af;
          opacity: 1;
        }

        /* Amélioration de la barre de progression */
        .progress-fill {
          background: linear-gradient(90deg, #3bf6c4ff 0%, #5cf6b3ff 50%, #10b981 100%);
          position: relative;
          overflow: hidden;
        }

        .progress-fill::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        /* Style pour les tooltips sur les boutons */
        .action-btn[title]:hover::after {
          content: attr(title);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #1f2937;
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 100;
          margin-bottom: 5px;
        }

        .action-btn {
          position: relative;
        }

        /* Amélioration des focus states pour la navigation au clavier */
        .progress-step:focus-within .step-indicator {
          box-shadow: 0 0 0 3px rgba(59, 246, 165, 0.2);
        }

        /* Style pour les listes déroulantes d'autocomplétion */
        datalist {
          display: none;
        }

        /* Amélioration de l'espacement vertical */
        .form-group + .form-group {
          margin-top: 0;
        }

        /* Style pour les liens dans les messages d'aide */
        .form-help a {
          color: #3bf6beff;
          text-decoration: none;
        }

        .form-help a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};