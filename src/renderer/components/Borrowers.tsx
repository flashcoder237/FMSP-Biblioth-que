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

import { Borrower } from '../../types';

interface BorrowersProps {
  onClose: () => void;
  onRefreshData?: () => Promise<void>;
}

export default function Borrowers({ onClose, onRefreshData }: BorrowersProps) {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'student' | 'staff'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [appMode, setAppMode] = useState<'offline' | 'online'>('offline');

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
      const borrowersList = await window.electronAPI.getBorrowers();
      setBorrowers(borrowersList || []);
    } catch (error) {
      console.error('Erreur lors du chargement des emprunteurs:', error);
      setBorrowers([]);
    } finally {
      setDataLoading(false);
    }
  };

  const [borrower, setBorrower] = useState<Omit<Borrower, 'id'>>({
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

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!borrower.firstName.trim()) {
      errors.firstName = 'Le prénom est requis';
    }
    if (!borrower.lastName.trim()) {
      errors.lastName = 'Le nom est requis';
    }
    if (!borrower.matricule.trim()) {
      errors.matricule = 'Le matricule est requis';
    }
    if (borrower.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(borrower.email)) {
      errors.email = 'Format email invalide';
    }
    if (borrower.phone && !/^[\d\s\+\-\(\)]{6,}$/.test(borrower.phone)) {
      errors.phone = 'Format téléphone invalide';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Logique de recherche mockée
  };

  const resetForm = () => {
    setBorrower({
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
    setEditingBorrower(null);
  };

  const handleAddBorrower = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleEditBorrower = (editBorrower: Borrower) => {
    setBorrower({
      type: editBorrower.type,
      firstName: editBorrower.firstName,
      lastName: editBorrower.lastName,
      matricule: editBorrower.matricule,
      classe: editBorrower.classe || '',
      cniNumber: editBorrower.cniNumber || '',
      position: editBorrower.position || '',
      email: editBorrower.email || '',
      phone: editBorrower.phone || '',
      syncStatus: editBorrower.syncStatus,
      lastModified: new Date().toISOString(),
      version: (editBorrower.version || 1) + 1,
      createdAt: editBorrower.createdAt || new Date().toISOString()
    });
    setFormErrors({});
    setEditingBorrower(editBorrower);
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
        // Modification d'un emprunteur existant
        const updatedBorrower = {
          ...borrower,
          id: editingBorrower.id,
          lastModified: new Date().toISOString(),
          version: (editingBorrower.version || 1) + 1
        };
        
        if (appMode === 'offline') {
          await window.electronAPI.updateBorrower(updatedBorrower);
        }
        
        setBorrowers(prev => prev.map(b => 
          b.id === editingBorrower.id ? updatedBorrower : b
        ));
      } else {
        // Ajout d'un nouvel emprunteur
        const newBorrowerData = {
          ...borrower,
          syncStatus: 'pending' as const,
          lastModified: new Date().toISOString(),
          version: 1,
          createdAt: new Date().toISOString()
        };
        
        if (appMode === 'offline') {
          const savedBorrowerId = await window.electronAPI.addBorrower(newBorrowerData);
          const savedBorrower = { ...newBorrowerData, id: savedBorrowerId };
          setBorrowers(prev => [...prev, savedBorrower]);
        } else {
          const newBorrower = { ...newBorrowerData, id: Date.now() };
          setBorrowers(prev => [...prev, newBorrower]);
        }
      }
      
      setShowAddModal(false);
      resetForm();
      
      // Rafraîchir les données dans le composant parent si nécessaire
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(error.message || 'Erreur lors de l\'opération');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (borrowerToDelete: Borrower) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${borrowerToDelete.firstName} ${borrowerToDelete.lastName} ?`)) {
      try {
        if (appMode === 'offline' && borrowerToDelete.id) {
          await window.electronAPI.deleteBorrower(borrowerToDelete.id);
        }
        
        setBorrowers(prev => prev.filter(b => b.id !== borrowerToDelete.id));
        
        // Rafraîchir les données dans le composant parent si nécessaire
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
          <button 
            className="close-button" 
            onClick={onClose}
            type="button"
          >
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
                  type="button"
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
            
            <button className="btn-primary" onClick={handleAddBorrower} type="button">
              <Plus size={18} />
              Ajouter
            </button>
          </div>
        </div>

        {/* Borrowers List */}
        <div className="borrowers-content">
          {dataLoading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Chargement des emprunteurs...</p>
            </div>
          ) : filteredBorrowers.length > 0 ? (
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
                        type="button"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="action-btn edit"
                        onClick={() => handleEditBorrower(borrower)}
                        title="Modifier"
                        type="button"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="action-btn delete"
                        onClick={() => handleDelete(borrower)}
                        title="Supprimer"
                        type="button"
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
                  type="button"
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
                      className={`type-button ${borrower.type === 'student' ? 'active' : ''}`}
                      onClick={() => setBorrower(prev => ({ ...prev, type: 'student' }))}
                    >
                      <GraduationCap size={20} />
                      Étudiant
                    </button>
                    <button
                      type="button"
                      className={`type-button ${borrower.type === 'staff' ? 'active' : ''}`}
                      onClick={() => setBorrower(prev => ({ ...prev, type: 'staff' }))}
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
                      value={borrower.firstName}
                      onChange={(e) => {
                        setBorrower(prev => ({ ...prev, firstName: e.target.value }));
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
                      value={borrower.lastName}
                      onChange={(e) => {
                        setBorrower(prev => ({ ...prev, lastName: e.target.value }));
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
                      value={borrower.matricule}
                      onChange={(e) => {
                        setBorrower(prev => ({ ...prev, matricule: e.target.value }));
                        if (formErrors.matricule) {
                          setFormErrors(prev => ({ ...prev, matricule: '' }));
                        }
                      }}
                      className={`form-input ${formErrors.matricule ? 'error' : ''}`}
                      required
                    />
                    {formErrors.matricule && <span className="error-text">{formErrors.matricule}</span>}
                  </div>
                  
                  {borrower.type === 'student' ? (
                    <div className="form-group">
                      <label className="form-label">Classe</label>
                      <input
                        type="text"
                        value={borrower.classe}
                        onChange={(e) => setBorrower(prev => ({ ...prev, classe: e.target.value }))}
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
                          value={borrower.cniNumber}
                          onChange={(e) => setBorrower(prev => ({ ...prev, cniNumber: e.target.value }))}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group span-full">
                        <label className="form-label">Poste</label>
                        <input
                          type="text"
                          value={borrower.position}
                          onChange={(e) => setBorrower(prev => ({ ...prev, position: e.target.value }))}
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
                      value={borrower.email}
                      onChange={(e) => {
                        setBorrower(prev => ({ ...prev, email: e.target.value }));
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
                      value={borrower.phone}
                      onChange={(e) => {
                        setBorrower(prev => ({ ...prev, phone: e.target.value }));
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
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .borrowers-modal {
          background: #FFFFFF;
          border-radius: 20px;
          width: 100%;
          max-width: 1200px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(229, 220, 194, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 32px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #F3EED9;
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
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
          backdrop-filter: blur(10px);
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
          background: rgba(243, 238, 217, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-title {
          font-size: 28px;
          font-weight: 800;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .modal-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          font-weight: 500;
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
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
        }
        
        .stats-section {
          display: flex;
          gap: 24px;
          padding: 32px;
          background: rgba(248, 246, 240, 0.5);
          border-bottom: 1px solid rgba(229, 220, 194, 0.3);
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 16px;
          background: #FFFFFF;
          padding: 24px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(62, 92, 73, 0.1);
          border: 1px solid rgba(229, 220, 194, 0.3);
          flex: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(62, 92, 73, 0.15);
          border-color: rgba(62, 92, 73, 0.2);
        }
        
        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
        }
        
        .stat-icon.student {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
        }
        
        .stat-icon.staff {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
        }
        
        .stat-icon.total {
          background: linear-gradient(135deg, #6B7280 0%, #4B5563 100%);
        }
        
        .stat-content {
          display: flex;
          flex-direction: column;
        }
        
        .stat-value {
          font-size: 28px;
          font-weight: 800;
          color: #2E2E2E;
          display: block;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 14px;
          color: #6E6E6E;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-top: 4px;
        }
        
        .controls-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
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
          color: #7f8c8d;
          z-index: 2;
        }
        
        .search-input {
          width: 100%;
          height: 52px;
          padding: 0 48px 0 48px;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          font-size: 16px;
          background: #FFFFFF;
          color: #2c3e50;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .search-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }
        
        .clear-search {
          position: absolute;
          right: 16px;
          background: #f8f9fa;
          border: none;
          cursor: pointer;
          color: #7f8c8d;
          padding: 8px;
          border-radius: 8px;
          transition: all 0.2s ease;
        }
        
        .clear-search:hover {
          color: #2c3e50;
          background: #e9ecef;
          transform: scale(1.1);
        }
        
        .controls-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #7f8c8d;
          font-weight: 500;
        }
        
        .filter-select {
          border: 2px solid #e9ecef;
          border-radius: 12px;
          padding: 12px 16px;
          background: #FFFFFF;
          color: #2c3e50;
          font-size: 14px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.3s ease;
        }
        
        .filter-select:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        
        .btn-primary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 24px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #FFFFFF;
          border: none;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
          background: linear-gradient(135deg, #2E453A 0%, #3E5C49 100%);
        }
        
        .borrowers-content {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
          background: #f8f9fa;
        }
        
        .borrowers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        
        .borrower-card {
          background: #FFFFFF;
          border-radius: 20px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .borrower-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 5px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          transition: all 0.3s ease;
        }
        
        .borrower-card.staff::before {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .borrower-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.15),
            0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .borrower-card:hover::before {
          width: 8px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }
        
        .borrower-type {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 700;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .card-actions {
          display: flex;
          gap: 8px;
        }
        
        .action-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        
        .action-btn::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          transition: all 0.3s ease;
          transform: translate(-50%, -50%);
        }
        
        .action-btn:hover::before {
          width: 100%;
          height: 100%;
        }
        
        .action-btn.view {
          background: rgba(108, 117, 125, 0.1);
          color: #6c757d;
        }
        
        .action-btn.view:hover {
          color: #FFFFFF;
          transform: scale(1.1);
        }
        
        .action-btn.view:hover::before {
          background: #6c757d;
        }
        
        .action-btn.edit {
          background: rgba(102, 126, 234, 0.1);
          color: #3E5C49;
        }
        
        .action-btn.edit:hover {
          color: #FFFFFF;
          transform: scale(1.1);
        }
        
        .action-btn.edit:hover::before {
          background: #3E5C49;
        }
        
        .action-btn.delete {
          background: rgba(245, 87, 108, 0.1);
          color: #f5576c;
        }
        
        .action-btn.delete:hover {
          color: #FFFFFF;
          transform: scale(1.1);
        }
        
        .action-btn.delete:hover::before {
          background: #f5576c;
        }
        
        .card-content {
          padding: 24px;
        }
        
        .borrower-name {
          font-size: 20px;
          font-weight: 800;
          color: #2c3e50;
          margin: 0 0 20px 0;
          letter-spacing: -0.5px;
        }
        
        .borrower-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: #6c757d;
          font-weight: 500;
          padding: 8px 0;
        }
        
        .detail-item svg {
          color: #adb5bd;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 32px;
          text-align: center;
          color: #6c757d;
        }
        
        .empty-state svg {
          opacity: 0.3;
          margin-bottom: 24px;
        }
        
        .empty-state h3 {
          font-size: 24px;
          font-weight: 700;
          margin: 0 0 12px 0;
          color: #495057;
        }
        
        .empty-state p {
          margin: 0;
          font-size: 16px;
          max-width: 400px;
          line-height: 1.5;
        }
        
        /* Add Modal */
        .add-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1100;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }
        
        .add-modal {
          background: #FFFFFF;
          border-radius: 24px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.3),
            0 16px 32px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .add-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 28px 32px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .add-modal-header h3 {
          font-size: 24px;
          font-weight: 800;
          color: #2c3e50;
          margin: 0;
        }
        
        .modal-close {
          background: rgba(108, 117, 125, 0.1);
          border: none;
          cursor: pointer;
          padding: 12px;
          border-radius: 12px;
          color: #6c757d;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .modal-close:hover {
          background: rgba(108, 117, 125, 0.2);
          color: #495057;
          transform: scale(1.1);
        }
        
        .add-form {
          padding: 32px;
        }
        
        .form-section {
          margin-bottom: 32px;
        }
        
        .form-label {
          display: block;
          font-size: 15px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 12px;
          letter-spacing: 0.3px;
        }
        
        .type-selector {
          display: flex;
          gap: 16px;
        }
        
        .type-button {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          background: #FFFFFF;
          color: #6c757d;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 15px;
          font-weight: 600;
          flex: 1;
          justify-content: center;
        }
        
        .type-button:hover {
          border-color: #3E5C49;
          color: #3E5C49;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.15);
        }
        
        .type-button.active {
          border-color: #3E5C49;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          color: #FFFFFF;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
          margin-bottom: 32px;
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
          padding: 16px 20px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 15px;
          background: #FFFFFF;
          color: #2c3e50;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        
        .form-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }
        
        .form-input.error {
          border-color: #f5576c;
          background: rgba(245, 87, 108, 0.05);
        }
        
        .error-text {
          font-size: 13px;
          color: #f5576c;
          font-weight: 600;
          margin-top: 4px;
        }
        
        .form-actions {
          display: flex;
          gap: 16px;
          justify-content: flex-end;
          padding-top: 32px;
          border-top: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 28px;
          background: #f8f9fa;
          color: #6c757d;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .btn-secondary:hover:not(:disabled) {
          background: #e9ecef;
          color: #495057;
          transform: translateY(-1px);
        }
        
        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .borrowers-modal {
            margin: 12px;
            border-radius: 20px;
            max-height: 95vh;
          }
          
          .modal-header {
            padding: 24px 20px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          
          .modal-title {
            font-size: 24px;
          }
          
          .stats-section {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
          }
          
          .controls-section {
            padding: 20px;
            flex-direction: column;
            gap: 16px;
            align-items: stretch;
          }
          
          .controls-right {
            justify-content: space-between;
          }
          
          .borrowers-content {
            padding: 20px;
          }
          
          .borrowers-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 20px;
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
            margin: 12px;
            border-radius: 20px;
          }
          
          .add-modal-header,
          .add-form {
            padding: 24px 20px;
          }
          
          .borrower-card {
            border-radius: 16px;
          }
          
          .card-header,
          .card-content {
            padding: 20px;
          }
          
          .modal-header {
            padding: 20px;
          }
          
          .stats-section,
          .controls-section,
          .borrowers-content {
            padding: 16px;
          }
        }
        
        /* Scrollbar personnalisé */
        .borrowers-content::-webkit-scrollbar,
        .add-modal::-webkit-scrollbar {
          width: 8px;
        }
        
        .borrowers-content::-webkit-scrollbar-track,
        .add-modal::-webkit-scrollbar-track {
          background: #f1f3f4;
          border-radius: 4px;
        }
        
        .borrowers-content::-webkit-scrollbar-thumb,
        .add-modal::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 4px;
        }
        
        .borrowers-content::-webkit-scrollbar-thumb:hover,
        .add-modal::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #2E453A 0%, #3E5C49 100%);
        }
        
        /* États de synchronisation */
        .sync-status {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .sync-status.synced {
          background: rgba(40, 167, 69, 0.1);
          color: #28a745;
          border: 1px solid rgba(40, 167, 69, 0.2);
        }
        
        .sync-status.pending {
          background: rgba(255, 193, 7, 0.1);
          color: #ffc107;
          border: 1px solid rgba(255, 193, 7, 0.2);
        }
        
        .sync-status.error {
          background: rgba(220, 53, 69, 0.1);
          color: #dc3545;
          border: 1px solid rgba(220, 53, 69, 0.2);
        }
        
        /* Animation de chargement */
        .loading-spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #FFFFFF;
          animation: spin 1s ease-in-out infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        /* Effet de focus amélioré */
        .form-input:focus,
        .search-input:focus,
        .filter-select:focus {
          border-color: #3E5C49;
          box-shadow: 
            0 0 0 3px rgba(102, 126, 234, 0.1),
            0 4px 12px rgba(102, 126, 234, 0.15);
          transform: translateY(-1px);
        }
        
        /* Amélioration des tooltips */
        .action-btn[title]:hover::after {
          content: attr(title);
          position: absolute;
          bottom: -35px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          color: white;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 12px;
          white-space: nowrap;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        .action-btn[title]:hover::before {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-bottom: 5px solid rgba(0, 0, 0, 0.8);
          z-index: 1000;
        }
        
        /* Indicateur de validation */
        .form-input.valid {
          border-color: #28a745;
          background: rgba(40, 167, 69, 0.05);
        }
        
        .form-input.valid:focus {
          border-color: #28a745;
          box-shadow: 
            0 0 0 3px rgba(40, 167, 69, 0.1),
            0 4px 12px rgba(40, 167, 69, 0.15);
        }
        
        /* Messages de succès */
        .success-message {
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          padding: 12px 20px;
          border-radius: 12px;
          margin-bottom: 20px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 10px;
          animation: slideDown 0.3s ease;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Amélioration des états vides */
        .empty-state {
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          border-radius: 20px;
          margin: 20px;
          padding: 60px 40px;
          animation: fadeIn 0.5s ease;
        }
        
        /* Indicateurs de statut dans les cartes */
        .borrower-card {
          position: relative;
        }
        
        .borrower-card .sync-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .borrower-card .sync-indicator.synced {
          background: #28a745;
        }
        
        .borrower-card .sync-indicator.pending {
          background: #ffc107;
          animation: pulse 2s infinite;
        }
        
        .borrower-card .sync-indicator.error {
          background: #dc3545;
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        /* Effet de survol sur les cartes de statistiques */
        .stat-card:hover .stat-icon {
          transform: scale(1.1) rotate(5deg);
        }
        
        .stat-card:hover .stat-value {
          transform: scale(1.05);
        }
        
        /* Amélioration du modal overlay */
        .add-modal-overlay {
          animation: fadeInBackdrop 0.3s ease;
        }
        
        @keyframes fadeInBackdrop {
          from {
            opacity: 0;
            backdrop-filter: blur(0px);
          }
          to {
            opacity: 1;
            backdrop-filter: blur(8px);
          }
        }
        
        /* Effet de typing pour les placeholders */
        .search-input::placeholder,
        .form-input::placeholder {
          color: #adb5bd;
          font-style: italic;
          transition: all 0.3s ease;
        }
        
        .search-input:focus::placeholder,
        .form-input:focus::placeholder {
          opacity: 0.7;
          transform: translateX(10px);
        }
        
        /* Amélioration du focus trap */
        .borrowers-modal:focus-within {
          outline: none;
        }
        
        /* État de chargement pour les boutons */
        .btn-primary:disabled {
          background: linear-gradient(135deg, #adb5bd 0%, #6c757d 100%);
          cursor: not-allowed;
          transform: none;
        }
        
        .btn-primary:disabled .loading-spinner {
          margin-right: 8px;
        }
        
        /* Responsive amélioré pour très petits écrans */
        @media (max-width: 360px) {
          .borrowers-overlay {
            padding: 8px;
          }
          
          .borrowers-modal {
            border-radius: 16px;
          }
          
          .modal-header {
            padding: 16px;
          }
          
          .modal-title {
            font-size: 20px;
          }
          
          .header-icon {
            width: 48px;
            height: 48px;
          }
          
          .stat-card {
            padding: 16px;
            gap: 12px;
          }
          
          .stat-icon {
            width: 40px;
            height: 40px;
          }
          
          .stat-value {
            font-size: 24px;
          }
          
          .add-modal {
            border-radius: 16px;
          }
          
          .type-button {
            padding: 16px;
            font-size: 14px;
          }
        }
        
        /* Mode sombre (optionnel) */
        @media (prefers-color-scheme: dark) {
          .borrowers-modal {
            background: #1a1a1a;
            color: #ffffff;
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .modal-header {
            background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
          }
          
          .stats-section {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
          }
          
          .stat-card {
            background: #2d3748;
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .borrower-card {
            background: #2d3748;
            border-color: rgba(255, 255, 255, 0.1);
          }
          
          .form-input,
          .search-input,
          .filter-select {
            background: #2d3748;
            border-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
          }
          
          .add-modal {
            background: #1a1a1a;
          }
        }
      `}</style>
    </div>
  );
};