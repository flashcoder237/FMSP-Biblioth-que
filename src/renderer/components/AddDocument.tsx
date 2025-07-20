import React, { useState, useEffect } from 'react';
import { Document, Author, Category } from '../../preload';
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {editingDocument ? 'Modifier le document' : 'Ajouter un nouveau document'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {errors.submit}
            </div>
          )}

          {/* Section 1: Informations principales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Informations principales
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Auteur *
                </label>
                <input
                  type="text"
                  value={formData.auteur}
                  onChange={(e) => handleInputChange('auteur', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.auteur ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom de l'auteur"
                  list="authors-list"
                />
                <datalist id="authors-list">
                  {authors.map(author => (
                    <option key={author.id} value={author.name} />
                  ))}
                </datalist>
                {errors.auteur && <p className="text-red-500 text-sm mt-1">{errors.auteur}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Titre *
                </label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => handleInputChange('titre', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.titre ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Titre du document"
                />
                {errors.titre && <p className="text-red-500 text-sm mt-1">{errors.titre}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="w-4 h-4 inline mr-1" />
                  Éditeur *
                </label>
                <input
                  type="text"
                  value={formData.editeur}
                  onChange={(e) => handleInputChange('editeur', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.editeur ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Nom de l'éditeur"
                />
                {errors.editeur && <p className="text-red-500 text-sm mt-1">{errors.editeur}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Lieu d'édition *
                </label>
                <input
                  type="text"
                  value={formData.lieuEdition}
                  onChange={(e) => handleInputChange('lieuEdition', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lieuEdition ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Ville d'édition"
                />
                {errors.lieuEdition && <p className="text-red-500 text-sm mt-1">{errors.lieuEdition}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Année *
                </label>
                <input
                  type="number"
                  value={formData.annee}
                  onChange={(e) => handleInputChange('annee', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.annee ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Année de publication"
                  min="1000"
                  max={new Date().getFullYear() + 10}
                />
                {errors.annee && <p className="text-red-500 text-sm mt-1">{errors.annee}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Hash className="w-4 h-4 inline mr-1" />
                  Cote *
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.cote}
                    onChange={(e) => handleInputChange('cote', e.target.value)}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.cote ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Code de classification"
                  />
                  <button
                    type="button"
                    onClick={generateCote}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    title="Générer automatiquement"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {errors.cote && <p className="text-red-500 text-sm mt-1">{errors.cote}</p>}
              </div>
            </div>
          </div>

          {/* Section 2: Métadonnées */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Métadonnées et classification
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripteurs / Mots-clés *
                </label>
                <input
                  type="text"
                  value={formData.descripteurs}
                  onChange={(e) => handleInputChange('descripteurs', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.descripteurs ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ex: Fiction, Roman historique, XIXe siècle (séparés par des virgules)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Séparez les mots-clés par des virgules. Ces descripteurs aideront à la recherche et au classement.
                </p>
                {errors.descripteurs && <p className="text-red-500 text-sm mt-1">{errors.descripteurs}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISBN (optionnel)
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => handleInputChange('isbn', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.isbn ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="978-2-123456-78-9"
                  />
                  {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="w-4 h-4 inline mr-1" />
                    Couverture (optionnel)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.couverture}
                      onChange={(e) => handleInputChange('couverture', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Chemin vers l'image"
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={selectCoverImage}
                      className="px-3 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Parcourir
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optionnel)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Description détaillée du document..."
                />
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Enregistrement...' : (editingDocument ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};