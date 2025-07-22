import React, { useState, useEffect } from 'react';
import { Document, Author, Category } from '../../types';
import { Save, X, Plus, BookOpen, User, Building, MapPin, Calendar, Tag, Hash, FileText, Image } from 'lucide-react';

interface AddDocumentProps {
  onAdd: (document: Omit<Document, 'id'>) => Promise<void>;
  onCancel: () => void;
  editingDocument?: Document;
}

export const AddDocument: React.FC<AddDocumentProps> = ({ onAdd, onCancel, editingDocument }) => {
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
    couverture: ''
  });

  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadAuthors();
    loadCategories();
    
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
        couverture: editingDocument.couverture || ''
      });
    }
  }, [editingDocument]);

  const loadAuthors = async () => {
    try {
      const authorsList = await window.electronAPI.getAuthors();
      setAuthors(authorsList);
    } catch (error) {
      console.error('Erreur lors du chargement des auteurs:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesList = await window.electronAPI.getCategories();
      setCategories(categoriesList);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const generateCote = () => {
    if (formData.descripteurs && formData.auteur && formData.annee) {
      const category = formData.descripteurs.split(',')[0].trim().toUpperCase();
      const authorCode = formData.auteur.split(' ').map(name => name.substring(0, 3).toUpperCase()).join('-');
      const yearCode = formData.annee.substring(-2);
      const randomNum = Math.floor(Math.random() * 999).toString().padStart(3, '0');
      
      const generatedCote = `${category.substring(0, 3)}-${authorCode}-${yearCode}${randomNum}`;
      setFormData(prev => ({ ...prev, cote: generatedCote }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Champs obligatoires
    if (!formData.auteur.trim()) newErrors.auteur = 'L\'auteur est obligatoire';
    if (!formData.titre.trim()) newErrors.titre = 'Le titre est obligatoire';
    if (!formData.editeur.trim()) newErrors.editeur = 'L\'éditeur est obligatoire';
    if (!formData.lieuEdition.trim()) newErrors.lieuEdition = 'Le lieu d\'édition est obligatoire';
    if (!formData.annee.trim()) newErrors.annee = 'L\'année est obligatoire';
    if (!formData.descripteurs.trim()) newErrors.descripteurs = 'Les descripteurs sont obligatoires';
    if (!formData.cote.trim()) newErrors.cote = 'La cote est obligatoire';

    // Validation de l'année
    const year = parseInt(formData.annee);
    if (isNaN(year) || year < 1000 || year > new Date().getFullYear() + 10) {
      newErrors.annee = 'Année invalide';
    }

    // Validation ISBN (optionnel mais si fourni, doit être valide)
    if (formData.isbn && !/^(978|979)?[0-9]{9}[0-9X]$/.test(formData.isbn.replace(/-/g, ''))) {
      newErrors.isbn = 'Format ISBN invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const documentData: Omit<Document, 'id'> = {
        ...formData,
        estEmprunte: false,
        syncStatus: 'pending',
        lastModified: new Date().toISOString(),
        version: editingDocument ? editingDocument.version + 1 : 1
      };

      await onAdd(documentData);
      
      // Reset form si ce n'est pas une édition
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
          couverture: ''
        });
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
    
    // Effacer l'erreur pour ce champ
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const selectCoverImage = async () => {
    try {
      const filePath = await window.electronAPI.selectFile({
        filters: [
          { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'] }
        ]
      });
      
      if (filePath) {
        setFormData(prev => ({ ...prev, couverture: filePath }));
      }
    } catch (error) {
      console.error('Erreur lors de la sélection de l\'image:', error);
    }
  };

  return (
    <div className="add-document-overlay">
      <div className="add-document-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Plus size={24} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">
                {editingDocument ? 'Modifier le document' : 'Ajouter un nouveau document'}
              </h2>
              <p className="modal-subtitle">Enrichissez votre collection bibliothèque</p>
            </div>
          </div>
          <button onClick={onCancel} className="close-button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-content">
          {errors.submit && (
            <div className="error-alert">
              {errors.submit}
            </div>
          )}

          {/* Section 1: Informations principales */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <FileText size={20} />
              </div>
              <h3 className="section-title">Informations principales</h3>
            </div>
            
            <div className="form-grid">
              <div className="form-field">
                <label className="field-label">
                  <User size={16} />
                  Auteur *
                </label>
                <input
                  type="text"
                  value={formData.auteur}
                  onChange={(e) => handleInputChange('auteur', e.target.value)}
                  className={`form-input ${
                    errors.auteur ? 'error' : ''
                  }`}
                  placeholder="Nom de l'auteur"
                  list="authors-list"
                />
                <datalist id="authors-list">
                  {authors.map(author => (
                    <option key={author.id} value={author.name} />
                  ))}
                </datalist>
                {errors.auteur && <p className="field-error">{errors.auteur}</p>}
              </div>

              <div className="form-field">
                <label className="field-label">
                  <BookOpen size={16} />
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  className={`form-input ${
                    errors.titre ? 'error' : ''
                  }`}
                  placeholder="Titre du document"
                />
                {errors.titre && <p className="field-error">{errors.titre}</p>}
              </div>

              <div className="form-field">
                <label className="field-label">
                  <Building size={16} />
                  Éditeur *
                </label>
                <input
                  type="text"
                  value={formData.editeur}
                  onChange={(e) => handleInputChange('editeur', e.target.value)}
                  className={`form-input ${
                    errors.editeur ? 'error' : ''
                  }`}
                  placeholder="Nom de l'éditeur"
                />
                {errors.editeur && <p className="field-error">{errors.editeur}</p>}
              </div>

              <div className="form-field">
                <label className="field-label">
                  <MapPin size={16} />
                  Lieu d'édition *
                </label>
                <input
                  type="text"
                  value={formData.lieuEdition}
                  onChange={(e) => handleInputChange('lieuEdition', e.target.value)}
                  className={`form-input ${
                    errors.lieuEdition ? 'error' : ''
                  }`}
                  placeholder="Ville d'édition"
                />
                {errors.lieuEdition && <p className="field-error">{errors.lieuEdition}</p>}
              </div>

              <div className="form-field">
                <label className="field-label">
                  <Calendar size={16} />
                  Année *
                </label>
                <input
                  type="number"
                  value={formData.annee}
                  onChange={(e) => handleInputChange('annee', e.target.value)}
                  className={`form-input ${
                    errors.annee ? 'error' : ''
                  }`}
                  placeholder="Année de publication"
                  min="1000"
                  max={new Date().getFullYear() + 10}
                />
                {errors.annee && <p className="field-error">{errors.annee}</p>}
              </div>

              <div className="form-field">
                <label className="field-label">
                  <Hash size={16} />
                  Cote *
                </label>
                <div className="input-with-button">
                  <input
                    type="text"
                    value={formData.cote}
                    onChange={(e) => handleInputChange('cote', e.target.value)}
                    className={`form-input flex-1 ${
                      errors.cote ? 'error' : ''
                    }`}
                    placeholder="Code de classification"
                  />
                  <button
                    type="button"
                    onClick={generateCote}
                    className="generate-button"
                    title="Générer automatiquement"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                {errors.cote && <p className="field-error">{errors.cote}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Métadonnées */}
          <div className="form-section">
            <div className="section-header">
              <div className="section-icon">
                <Tag size={20} />
              </div>
              <h3 className="section-title">Métadonnées et classification</h3>
            </div>
            
            <div className="section-content">
              <div className="form-field full-width">
                <label className="field-label">
                  Descripteurs / Mots-clés *
                </label>
                <input
                  type="text"
                  value={formData.descripteurs}
                  onChange={(e) => handleInputChange('descripteurs', e.target.value)}
                  className={`form-input ${
                    errors.descripteurs ? 'error' : ''
                  }`}
                  placeholder="ex: Fiction, Roman historique, XIXe siècle (séparés par des virgules)"
                />
                <p className="field-help">
                  Séparez les mots-clés par des virgules. Ces descripteurs aideront à la recherche et au classement.
                </p>
                {errors.descripteurs && <p className="field-error">{errors.descripteurs}</p>}
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label className="field-label">
                    ISBN (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    className={`form-input ${
                      errors.isbn ? 'error' : ''
                    }`}
                    placeholder="978-2-123456-78-9"
                  />
                  {errors.isbn && <p className="field-error">{errors.isbn}</p>}
                </div>

                <div className="form-field">
                  <label className="field-label">
                    <Image size={16} />
                    Couverture (optionnel)
                  </label>
                  <div className="input-with-button">
                    <input
                      type="text"
                      value={formData.couverture}
                      onChange={(e) => handleInputChange('couverture', e.target.value)}
                      className="form-input flex-1"
                      placeholder="Chemin vers l'image"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={selectCoverImage}
                      className="browse-button"
                    >
                      Parcourir
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-field full-width">
                <label className="field-label">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="form-textarea"
                  rows={4}
                  placeholder="Description détaillée du document..."
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="modal-actions">
            <button
              type="button"
              onClick={onCancel}
              className="cancel-button"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="submit-button"
            >
              <Save size={16} />
              {isLoading ? 'Enregistrement...' : (editingDocument ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
      
      <style>{`
        .add-document-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
          backdrop-filter: blur(8px);
        }
        
        .add-document-modal {
          background: #FFFFFF;
          border-radius: 20px;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          width: 100%;
          max-width: 900px;
          max-height: 95vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
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
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 80%, rgba(243, 238, 217, 0.1) 0%, transparent 50%);
          pointer-events: none;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }
        
        .header-text {
          flex: 1;
        }
        
        .modal-title {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 4px 0;
          line-height: 1.2;
          letter-spacing: -0.3px;
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
          position: relative;
          z-index: 1;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.05);
        }
        
        .modal-content {
          padding: 32px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        
        .error-alert {
          background: linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%);
          border: 1px solid #FCA5A5;
          color: #DC2626;
          padding: 16px 20px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .form-section {
          background: rgba(243, 238, 217, 0.1);
          border-radius: 16px;
          padding: 24px;
          border: 1px solid rgba(243, 238, 217, 0.2);
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .section-icon {
          width: 40px;
          height: 40px;
          background: rgba(62, 92, 73, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3E5C49;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
          .form-grid .form-field {
          min-width: 0; /* Évite que les flex/grid items dépassent leur conteneur */
        }
        
        .section-content {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-field.full-width {
          grid-column: 1 / -1;
        }
        
        .field-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          font-weight: 600;
          color: #1A1A1A;
          margin: 0;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          box-sizing: border-box;
          min-width: 0;
          
          /* Amélioration du contraste pour accessibilité */
          border-color: #B8A678;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.25);
          background: #FEFEFE;
        }
        
        .form-input.error {
          border-color: #DC2626;
          background: #FEF2F2;
        }
        
        .form-input.error:focus {
          border-color: #DC2626;
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .input-with-button {
          display: flex;
          gap: 8px;
          width: 100%;
        }
        .input-with-button .form-input {
  flex: 1;
  min-width: 0; /* Permet à l'input de se rétrécir si nécessaire */
}
        .generate-button, .browse-button {
          padding: 12px 16px;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .generate-button {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
        }
        
        .generate-button:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.3);
        }
        
        .browse-button {
          background: linear-gradient(135deg, #6E6E6E 0%, #5A5A5A 100%);
          color: #F3EED9;
        }
        
        .browse-button:hover {
          background: linear-gradient(135deg, #5A5A5A 0%, #4A4A4A 100%);
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(110, 110, 110, 0.3);
        }
        
        .field-help {
          font-size: 12px;
          color: #4A4A4A;
          margin: 0;
          line-height: 1.4;
          background: #F8F6F0;
          padding: 6px 10px;
          border-radius: 4px;
          border-left: 3px solid #E5DCC2;
        }
        
        .field-error {
          color: #B91C1C;
          font-size: 12px;
          font-weight: 600;
          margin: 0;
          background: #FEF2F2;
          padding: 4px 8px;
          border-radius: 4px;
          border-left: 3px solid #DC2626;
        }
        
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 24px;
          border-top: 1px solid rgba(243, 238, 217, 0.3);
        }
        
        .cancel-button {
          padding: 12px 24px;
          background: rgba(110, 110, 110, 0.1);
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .cancel-button:hover {
          background: rgba(110, 110, 110, 0.2);
          border-color: #6E6E6E;
          transform: translateY(-1px);
        }
        
        .submit-button {
          padding: 12px 24px;
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .submit-button:hover {
          background: linear-gradient(135deg, #A8481A 0%, #8A3C18 100%);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(194, 87, 27, 0.3);
        }
        
        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        @media (max-width: 768px) {
          .add-document-overlay {
            padding: 8px;
          }
          
          .modal-header {
            padding: 20px;
          }
          
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 12px;
          }
          
          .modal-title {
            font-size: 20px;
          }
          
          .modal-content {
            padding: 20px;
            gap: 24px;
          }
          
          .form-section {
            padding: 16px;
          }
          
          .form-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            width: 100%; /* Assure que la grille prend toute la largeur disponible */
          }
          
          .modal-actions {
            flex-direction: column;
            gap: 12px;
          }
          
          .cancel-button,
          .submit-button {
            width: 100%;
            justify-content: center;
          }
        }
          @media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .input-with-button {
    flex-direction: column;
    gap: 8px;
  }
  
  .input-with-button .form-input {
    flex: none;
  }
}
      `}</style>
    </div>
  );
};