import React, { useState } from 'react';
import { 
  Plus, 
  Book, 
  User, 
  Calendar, 
  Tag, 
  FileText, 
  Link,
  ArrowLeft,
  Save,
  X
} from 'lucide-react';
import { Book as BookType, Author, Category } from '../../preload';

interface AddBookProps {
  authors: Author[];
  categories: Category[];
  onAddBook: (book: Omit<BookType, 'id'>) => void;
  onCancel: () => void;
}

export const AddBook: React.FC<AddBookProps> = ({ 
  authors, 
  categories, 
  onAddBook, 
  onCancel 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    publishedDate: '',
    description: '',
    coverUrl: ''
  });

  const [showNewAuthor, setShowNewAuthor] = useState(false);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newAuthor, setNewAuthor] = useState({
    name: '',
    biography: '',
    nationality: ''
  });
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    color: '#22c55e'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    if (!formData.author.trim()) {
      newErrors.author = 'L\'auteur est requis';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'La catégorie est requise';
    }
    if (formData.isbn && !isValidISBN(formData.isbn)) {
      newErrors.isbn = 'Format ISBN invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidISBN = (isbn: string) => {
    const cleanISBN = isbn.replace(/[-\s]/g, '');
    return /^(978|979)\d{10}$/.test(cleanISBN) || /^\d{10}$/.test(cleanISBN);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const bookData: Omit<BookType, 'id'> = {
        ...formData,
        isBorrowed: false,
        createdAt: new Date().toISOString()
      };
      
      onAddBook(bookData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const predefinedColors = [
    '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#f97316', '#84cc16'
  ];

  return (
    <div className="add-book">
      <div className="page-header">
        <div className="header-content">
          <button className="back-button" onClick={onCancel}>
            <ArrowLeft size={20} />
          </button>
          <div className="header-title-section">
            <Plus className="header-icon" size={28} />
            <div>
              <h1 className="page-title">Ajouter un livre</h1>
              <p className="page-subtitle">Enrichissez votre collection</p>
            </div>
          </div>
        </div>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="book-form">
          <div className="form-grid">
            {/* Informations principales */}
            <div className="form-section">
              <h3 className="section-title">Informations principales</h3>
              
              <div className="form-group">
                <label htmlFor="title" className="form-label">
                  <Book size={16} />
                  Titre du livre *
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`form-input ${errors.title ? 'error' : ''}`}
                  placeholder="Entrez le titre du livre"
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="author" className="form-label">
                  <User size={16} />
                  Auteur *
                </label>
                <div className="input-with-action">
                  <select
                    id="author"
                    value={formData.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    className={`form-input ${errors.author ? 'error' : ''}`}
                  >
                    <option value="">Sélectionner un auteur</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.name}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="action-link"
                    onClick={() => setShowNewAuthor(true)}
                  >
                    Nouvel auteur
                  </button>
                </div>
                {errors.author && <span className="error-message">{errors.author}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category" className="form-label">
                  <Tag size={16} />
                  Catégorie *
                </label>
                <div className="input-with-action">
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`form-input ${errors.category ? 'error' : ''}`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="action-link"
                    onClick={() => setShowNewCategory(true)}
                  >
                    Nouvelle catégorie
                  </button>
                </div>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>

            {/* Détails supplémentaires */}
            <div className="form-section">
              <h3 className="section-title">Détails supplémentaires</h3>

              <div className="form-group">
                <label htmlFor="isbn" className="form-label">
                  ISBN
                </label>
                <input
                  id="isbn"
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => handleInputChange('isbn', e.target.value)}
                  className={`form-input ${errors.isbn ? 'error' : ''}`}
                  placeholder="978-2-123456-78-9"
                />
                {errors.isbn && <span className="error-message">{errors.isbn}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="publishedDate" className="form-label">
                  <Calendar size={16} />
                  Date de publication
                </label>
                <input
                  id="publishedDate"
                  type="text"
                  value={formData.publishedDate}
                  onChange={(e) => handleInputChange('publishedDate', e.target.value)}
                  className="form-input"
                  placeholder="2023 ou 01/01/2023"
                />
              </div>

              <div className="form-group">
                <label htmlFor="coverUrl" className="form-label">
                  <Link size={16} />
                  URL de la couverture
                </label>
                <input
                  id="coverUrl"
                  type="url"
                  value={formData.coverUrl}
                  onChange={(e) => handleInputChange('coverUrl', e.target.value)}
                  className="form-input"
                  placeholder="https://exemple.com/couverture.jpg"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="form-section full-width">
            <label htmlFor="description" className="form-label">
              <FileText size={16} />
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="form-textarea"
              placeholder="Résumé ou description du livre..."
              rows={4}
            />
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel}>
              Annuler
            </button>
            <button type="submit" className="btn-primary">
              <Save size={16} />
              Ajouter le livre
            </button>
          </div>
        </form>
      </div>

      {/* Modal Nouvel Auteur */}
      {showNewAuthor && (
        <div className="modal-overlay" onClick={() => setShowNewAuthor(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter un nouvel auteur</h3>
              <button
                className="modal-close"
                onClick={() => setShowNewAuthor(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Nom de l'auteur *</label>
                <input
                  type="text"
                  value={newAuthor.name}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Nom complet de l'auteur"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Biographie</label>
                <textarea
                  value={newAuthor.biography}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, biography: e.target.value }))}
                  className="form-textarea"
                  placeholder="Courte biographie..."
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Nationalité</label>
                <input
                  type="text"
                  value={newAuthor.nationality}
                  onChange={(e) => setNewAuthor(prev => ({ ...prev, nationality: e.target.value }))}
                  className="form-input"
                  placeholder="Nationalité de l'auteur"
                />
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowNewAuthor(false)}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                onClick={async () => {
                  if (newAuthor.name.trim()) {
                    try {
                      await window.electronAPI.addAuthor(newAuthor);
                      setFormData(prev => ({ ...prev, author: newAuthor.name }));
                      setNewAuthor({ name: '', biography: '', nationality: '' });
                      setShowNewAuthor(false);
                    } catch (error) {
                      console.error('Erreur lors de l\'ajout de l\'auteur:', error);
                    }
                  }
                }}
                disabled={!newAuthor.name.trim()}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nouvelle Catégorie */}
      {showNewCategory && (
        <div className="modal-overlay" onClick={() => setShowNewCategory(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ajouter une nouvelle catégorie</h3>
              <button
                className="modal-close"
                onClick={() => setShowNewCategory(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-content">
              <div className="form-group">
                <label className="form-label">Nom de la catégorie *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
                  className="form-input"
                  placeholder="Nom de la catégorie"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory(prev => ({ ...prev, description: e.target.value }))}
                  className="form-textarea"
                  placeholder="Description de la catégorie..."
                  rows={2}
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Couleur</label>
                <div className="color-picker">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`color-option ${newCategory.color === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setNewCategory(prev => ({ ...prev, color }))}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowNewCategory(false)}
              >
                Annuler
              </button>
              <button
                className="btn-primary"
                onClick={async () => {
                  if (newCategory.name.trim()) {
                    try {
                      await window.electronAPI.addCategory(newCategory);
                      setFormData(prev => ({ ...prev, category: newCategory.name }));
                      setNewCategory({ name: '', description: '', color: '#22c55e' });
                      setShowNewCategory(false);
                    } catch (error) {
                      console.error('Erreur lors de l\'ajout de la catégorie:', error);
                    }
                  }
                }}
                disabled={!newCategory.name.trim()}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .add-book {
          height: 100%;
          overflow-y: auto;
          background: #f8fafc;
        }
        
        .page-header {
          background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
          color: white;
          padding: 40px 32px;
          position: relative;
          overflow: hidden;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          z-index: 2;
        }
        
        .back-button {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .back-button:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateX(-2px);
        }
        
        .header-title-section {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .header-icon {
          opacity: 0.9;
        }
        
        .page-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 4px 0;
          line-height: 1.2;
        }
        
        .page-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .form-container {
          padding: 32px;
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .book-form {
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 32px;
        }
        
        .form-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        .form-section.full-width {
          grid-column: 1 / -1;
          margin-top: 8px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0 0 8px 0;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
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
          font-weight: 500;
          color: #374151;
        }
        
        .form-input, .form-textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 16px;
          transition: all 0.2s ease;
          background: #fafbfc;
        }
        
        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #22c55e;
          background: white;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        
        .form-input.error {
          border-color: #ef4444;
          background: #fef2f2;
        }
        
        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .input-with-action {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .input-with-action .form-input {
          flex: 1;
        }
        
        .action-link {
          background: none;
          border: none;
          color: #22c55e;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          text-decoration: underline;
          white-space: nowrap;
          transition: color 0.2s ease;
        }
        
        .action-link:hover {
          color: #16a34a;
        }
        
        .error-message {
          font-size: 12px;
          color: #ef4444;
          margin-top: 4px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #e5e7eb;
        }
        
        .btn-secondary, .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }
        
        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }
        
        .btn-secondary:hover {
          background: #e5e7eb;
        }
        
        .btn-primary {
          background: #22c55e;
          color: white;
        }
        
        .btn-primary:hover {
          background: #16a34a;
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled {
          background: #d1d5db;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal {
          background: white;
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          margin: 16px;
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 24px 0;
        }
        
        .modal-header h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6b7280;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: #f3f4f6;
          color: #374151;
        }
        
        .modal-content {
          padding: 24px;
        }
        
        .modal-footer {
          display: flex;
          gap: 12px;
          padding: 0 24px 24px;
          justify-content: flex-end;
        }
        
        .color-picker {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        
        .color-option {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .color-option:hover {
          transform: scale(1.1);
        }
        
        .color-option.selected {
          border-color: #374151;
          transform: scale(1.1);
        }
        
        @media (max-width: 768px) {
          .form-container {
            padding: 16px;
          }
          
          .book-form {
            padding: 24px 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .page-header {
            padding: 24px 16px;
          }
          
          .header-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          
          .form-actions {
            flex-direction: column;
          }
          
          .input-with-action {
            flex-direction: column;
            align-items: stretch;
          }
          
          .modal {
            margin: 8px;
          }
        }
      `}</style>
    </div>
  );
};