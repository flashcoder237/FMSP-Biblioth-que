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
  Filter
} from 'lucide-react';
import { Borrower } from '../../preload';

import { SupabaseService } from '../../services/SupabaseService';

interface BorrowersProps {
  onClose: () => void;
  onRefreshData?: () => Promise<void>; // Callback pour rafraîchir les données
  supabaseService: SupabaseService;
}

export const Borrowers: React.FC<BorrowersProps> = ({ onClose, onRefreshData }) => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'staff'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Omit<Borrower, 'id'>>({
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

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadBorrowers();
  }, []);

  const loadBorrowers = async () => {
    try {
      const data = await window.electronAPI.getBorrowers();
      setBorrowers(data);
    } catch (error) {
      console.error('Erreur lors du chargement des emprunteurs:', error);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }
    if (!formData.matricule.trim()) {
      errors.matricule = 'Le matricule est requis';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format email invalide';
    }
    if (formData.phone && !/^[\d\s\+\-\(\)]{6,}$/.test(formData.phone)) {
      errors.phone = 'Format téléphone invalide';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        const results = await window.electronAPI.searchBorrowers(query);
        setBorrowers(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      }
    } else {
      loadBorrowers();
    }
  };

  const resetForm = () => {
    setFormData({
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
    setFormErrors({});
    setEditingBorrower(null);
  };

  const handleAddBorrower = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditBorrower = (borrower: Borrower) => {
    setFormData({
      type: borrower.type,
      firstName: borrower.firstName,
      lastName: borrower.lastName,
      matricule: borrower.matricule,
      classe: borrower.classe || '',
      cniNumber: borrower.cniNumber || '',
      position: borrower.position || '',
      email: borrower.email || '',
      phone: borrower.phone || ''
    });
    setFormErrors({});
    setEditingBorrower(borrower);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      if (editingBorrower) {
        await window.electronAPI.updateBorrower({ ...formData, id: editingBorrower.id });
      } else {
        await window.electronAPI.addBorrower(formData);
      }
      
      setShowAddModal(false);
      resetForm();
      await loadBorrowers();
      
      // Rafraîchir les données dans le parent si callback fourni
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      if (error.message && error.message.includes('matricule')) {
        setFormErrors({ matricule: 'Un emprunteur avec ce matricule existe déjà' });
      } else {
        alert(error.message || 'Erreur lors de l\'opération');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (borrower: Borrower) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${borrower.firstName} ${borrower.lastName} ?`)) {
      try {
        await window.electronAPI.deleteBorrower(borrower.id!);
        await loadBorrowers();
        
        // Rafraîchir les données dans le parent si callback fourni
        if (onRefreshData) {
          await onRefreshData();
        }
      } catch (error: any) {
        alert(error.message || 'Erreur lors de la suppression');
      }
    }
  };

  const filteredBorrowers = borrowers.filter(borrower => {
    if (filterType !== 'all' && borrower.type !== filterType) return false;
    return true;
  });

  const studentCount = borrowers.filter(b => b.type === 'student').length;
  const staffCount = borrowers.filter(b => b.type === 'staff').length;

  return (
    <div className="borrowers-overlay">
      <div className="borrowers-modal">
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Users size={28} />
            </div>
            <div className="header-text">
              <h2 className="modal-title">Gestion des Emprunteurs</h2>
              <p className="modal-subtitle">
                {borrowers.length} emprunteur(s) • {studentCount} étudiant(s) • {staffCount} personnel(s)
              </p>
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
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
          <div className="search-container">
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom, matricule..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="search-input"
              />
              {searchQuery && (
                <button 
                  className="clear-search"
                  onClick={() => handleSearch('')}
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
          
          <div className="controls-right">
            <div className="filter-group">
              <Filter size={16} />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as any)}
                className="filter-select"
              >
                <option value="all">Tous</option>
                <option value="student">Étudiants</option>
                <option value="staff">Personnel</option>
              </select>
            </div>
            
            <button className="btn-primary" onClick={handleAddBorrower}>
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Borrowers List */}
        <div className="borrowers-content">
          {filteredBorrowers.length > 0 ? (
            <div className="borrowers-grid">
              {filteredBorrowers.map((borrower) => (
                <div key={borrower.id} className={`borrower-card ${borrower.type}`}>
                  <div className="card-header">
                    <div className="borrower-type">
                      {borrower.type === 'student' ? (
                        <GraduationCap size={20} />
                      ) : (
                        <Briefcase size={20} />
                      )}
                      <span>{borrower.type === 'student' ? 'Étudiant' : 'Personnel'}</span>
                    </div>
                    
                    <div className="card-actions">
                      <button 
                        className="action-btn view"
                        onClick={() => {}}
                        title="Voir détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditBorrower(borrower)}
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(borrower)}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="card-content">
                    <h3 className="borrower-name">
                      {borrower.firstName} {borrower.lastName}
                    </h3>
                    
                    <div className="borrower-details">
                      <div className="detail-item">
                        <Hash size={14} />
                        <span>{borrower.matricule}</span>
                      </div>
                      
                      {borrower.type === 'student' && borrower.classe && (
                        <div className="detail-item">
                          <School size={14} />
                          <span>{borrower.classe}</span>
                        </div>
                      )}
                      
                      {borrower.type === 'staff' && borrower.position && (
                        <div className="detail-item">
                          <Building size={14} />
                          <span>{borrower.position}</span>
                        </div>
                      )}
                      
                      {borrower.email && (
                        <div className="detail-item">
                          <Mail size={14} />
                          <span>{borrower.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Users size={64} />
              <h3>Aucun emprunteur trouvé</h3>
              <p>
                {searchQuery || filterType !== 'all'
                  ? 'Aucun résultat pour les critères sélectionnés'
                  : 'Commencez par ajouter des emprunteurs'
                }
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="add-modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="add-modal" onClick={(e) => e.stopPropagation()}>
              <div className="add-modal-header">
                <h3>{editingBorrower ? 'Modifier' : 'Ajouter'} un emprunteur</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowAddModal(false)}
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="add-form">
                <div className="form-section">
                  <label className="form-label">Type d'emprunteur *</label>
                  <div className="type-selector">
                    <button
                      type="button"
                      className={`type-button ${formData.type === 'student' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'student' }))}
                    >
                      <GraduationCap size={20} />
                      Étudiant
                    </button>
                    <button
                      type="button"
                      className={`type-button ${formData.type === 'staff' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, type: 'staff' }))}
                    >
                      <Briefcase size={20} />
                      Personnel
                    </button>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Prénom *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, firstName: e.target.value }));
                        if (formErrors.firstName) {
                          setFormErrors(prev => ({ ...prev, firstName: '' }));
                        }
                      }}
                      className={`form-input ${formErrors.firstName ? 'error' : ''}`}
                      required
                    />
                    {formErrors.firstName && <span className="error-text">{formErrors.firstName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Nom *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, lastName: e.target.value }));
                        if (formErrors.lastName) {
                          setFormErrors(prev => ({ ...prev, lastName: '' }));
                        }
                      }}
                      className={`form-input ${formErrors.lastName ? 'error' : ''}`}
                      required
                    />
                    {formErrors.lastName && <span className="error-text">{formErrors.lastName}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Matricule *</label>
                    <input
                      type="text"
                      value={formData.matricule}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, matricule: e.target.value }));
                        if (formErrors.matricule) {
                          setFormErrors(prev => ({ ...prev, matricule: '' }));
                        }
                      }}
                      className={`form-input ${formErrors.matricule ? 'error' : ''}`}
                      required
                    />
                    {formErrors.matricule && <span className="error-text">{formErrors.matricule}</span>}
                  </div>
                  
                  {formData.type === 'student' ? (
                    <div className="form-group">
                      <label className="form-label">Classe</label>
                      <input
                        type="text"
                        value={formData.classe}
                        onChange={(e) => setFormData(prev => ({ ...prev, classe: e.target.value }))}
                        className="form-input"
                        placeholder="ex: Terminale C"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="form-group">
                        <label className="form-label">N° CNI</label>
                        <input
                          type="text"
                          value={formData.cniNumber}
                          onChange={(e) => setFormData(prev => ({ ...prev, cniNumber: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group span-full">
                        <label className="form-label">Poste</label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                          className="form-input"
                          placeholder="ex: Professeur de Mathématiques"
                        />
                      </div>
                    </>
                  )}
                  
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, email: e.target.value }));
                        if (formErrors.email) {
                          setFormErrors(prev => ({ ...prev, email: '' }));
                        }
                      }}
                      className={`form-input ${formErrors.email ? 'error' : ''}`}
                    />
                    {formErrors.email && <span className="error-text">{formErrors.email}</span>}
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Téléphone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, phone: e.target.value }));
                        if (formErrors.phone) {
                          setFormErrors(prev => ({ ...prev, phone: '' }));
                        }
                      }}
                      className={`form-input ${formErrors.phone ? 'error' : ''}`}
                    />
                    {formErrors.phone && <span className="error-text">{formErrors.phone}</span>}
                  </div>
                </div>
                
                <div className="form-actions">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowAddModal(false)}
                    disabled={isLoading}
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    <Save size={16} />
                    {isLoading ? 'Enregistrement...' : editingBorrower ? 'Modifier' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .borrowers-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .borrowers-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 
            0 24px 48px rgba(62, 92, 73, 0.2),
            0 8px 24px rgba(62, 92, 73, 0.12);
          border: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
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
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        
        .modal-subtitle {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
        }
        
        .close-button {
          background: rgba(243, 238, 217, 0.15);
          border: 1px solid rgba(243, 238, 217, 0.3);
          color: #F3EED9;
          padding: 12px;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.25);
        }
        
        .stats-section {
          display: flex;
          gap: 20px;
          padding: 24px 32px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          padding: 16px 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(62, 92, 73, 0.08);
          flex: 1;
        }
        
        .stat-icon {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #FFFFFF;
        }
        
        .stat-icon.student {
          background: #3E5C49;
        }
        
        .stat-icon.staff {
          background: #C2571B;
        }
        
        .stat-icon.total {
          background: #6E6E6E;
        }
        
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          display: block;
        }
        
        .stat-label {
          font-size: 12px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .controls-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          background: #FFFFFF;
        }
        
        .search-container {
          flex: 1;
          max-width: 400px;
        }
        
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          color: #6E6E6E;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          height: 48px;
          padding: 0 48px 0 48px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: none;
          border: none;
          cursor: pointer;
          color: #6E6E6E;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          color: #2E2E2E;
          background: #F3EED9;
        }
        
        .controls-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6E6E6E;
        }
        
        .filter-select {
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #2E2E2E;
          font-size: 14px;
          cursor: pointer;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #3E5C49;
        }
        
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
          border: none;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-primary:hover {
          background: linear-gradient(135deg, #2E453A 0%, #1E2F25 100%);
          transform: translateY(-1px);
        }
        
        .borrowers-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .borrowers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .borrower-card {
          background: #FFFFFF;
          border-radius: 16px;
          border: 1px solid #E5DCC2;
          overflow: hidden;
          transition: all 0.3s ease;
          position: relative;
        }
        
        .borrower-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: #3E5C49;
        }
        
        .borrower-card.staff::before {
          background: #C2571B;
        }
        
        .borrower-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(62, 92, 73, 0.15);
        }
        
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #F3EED9;
          border-bottom: 1px solid #E5DCC2;
        }
        
        .borrower-type {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          font-weight: 600;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .card-actions {
          display: flex;
          gap: 4px;
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
        
        .action-btn.view {
          background: #F3EED9;
          color: #6E6E6E;
        }
        
        .action-btn.view:hover {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .action-btn.edit {
          background: rgba(62, 92, 73, 0.1);
          color: #3E5C49;
        }
        
        .action-btn.edit:hover {
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .action-btn.delete {
          background: rgba(194, 87, 27, 0.1);
          color: #C2571B;
        }
        
        .action-btn.delete:hover {
          background: #C2571B;
          color: #F3EED9;
        }
        
        .card-content {
          padding: 20px;
        }
        
        .borrower-name {
          font-size: 18px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0 0 16px 0;
        }
        
        .borrower-details {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6E6E6E;
        }
        
        .empty-state h3 {
          font-size: 20px;
          font-weight: 700;
          margin: 16px 0 8px 0;
          color: #2E2E2E;
        }
        
        .empty-state p {
          margin: 0;
          font-size: 14px;
        }
        
        /* Add Modal */
        .add-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(46, 46, 46, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
        }
        
        .add-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 40px rgba(62, 92, 73, 0.2);
        }
        
        .add-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #E5DCC2;
          background: #F3EED9;
        }
        
        .add-modal-header h3 {
          font-size: 20px;
          font-weight: 700;
          color: #2E2E2E;
          margin: 0;
        }
        
        .modal-close {
          background: rgba(110, 110, 110, 0.1);
          border: none;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          color: #6E6E6E;
          transition: all 0.2s ease;
        }
        
        .modal-close:hover {
          background: rgba(110, 110, 110, 0.2);
          color: #2E2E2E;
        }
        
        .add-form {
          padding: 32px;
        }
        
        .form-section {
          margin-bottom: 24px;
        }
        
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #2E2E2E;
          margin-bottom: 8px;
        }
        
        .type-selector {
          display: flex;
          gap: 12px;
        }
        
        .type-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 16px 20px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          background: #FFFFFF;
          color: #6E6E6E;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          flex: 1;
          justify-content: center;
        }
        
        .type-button:hover {
          border-color: #3E5C49;
          color: #3E5C49;
        }
        
        .type-button.active {
          border-color: #3E5C49;
          background: #3E5C49;
          color: #F3EED9;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 24px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .form-group.span-full {
          grid-column: 1 / -1;
        }
        
        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          background: #FFFFFF;
          color: #2E2E2E;
          transition: all 0.2s ease;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.1);
        }
        
        .form-input.error {
          border-color: #C2571B;
          background: rgba(194, 87, 27, 0.05);
        }
        
        .error-text {
          font-size: 12px;
          color: #C2571B;
          font-weight: 500;
        }
        
        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          padding-top: 24px;
          border-top: 1px solid #E5DCC2;
        }
        
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          background: #F3EED9;
          color: #6E6E6E;
          border: 2px solid #E5DCC2;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #EAEADC;
          color: #2E2E2E;
        }
        
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .borrowers-modal {
            margin: 12px;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .stats-section {
            padding: 16px 20px;
            flex-direction: column;
            gap: 12px;
          }
          
          .controls-section {
            padding: 16px 20px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .controls-right {
            justify-content: space-between;
          }
          
          .borrowers-content {
            padding: 16px 20px;
          }
          
          .borrowers-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .type-selector {
            flex-direction: column;
          }
          
          .form-actions {
            flex-direction: column-reverse;
          }
          
          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }
        }
        
        @media (max-width: 480px) {
          .add-modal {
            margin: 8px;
            border-radius: 16px;
          }
          
          .add-modal-header,
          .add-form {
            padding: 20px 16px;
          }
          
          .borrower-card {
            border-radius: 12px;
          }
          
          .card-header,
          .card-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};