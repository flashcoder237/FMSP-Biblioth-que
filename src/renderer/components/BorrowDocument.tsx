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
  Building
} from 'lucide-react';
import { MicroButton, MicroCard, MicroLoader } from './MicroInteractions';
import { useQuickToast } from './ToastSystem';

interface BorrowDocumentProps {
  document: Document;
  borrowers: Borrower[];
  onBorrow: (documentId: number, borrowerId: number, returnDate: string) => Promise<void>;
  onReturn: (documentId: number) => Promise<void>;
  onCancel: () => void;
}

export const BorrowDocument: React.FC<BorrowDocumentProps> = ({
  document,
  borrowers,
  onBorrow,
  onReturn,
  onCancel
}) => {
  const { success, error, info } = useQuickToast();
  const [selectedBorrowerId, setSelectedBorrowerId] = useState<number | null>(null);
  const [returnDate, setReturnDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [filteredBorrowers, setFilteredBorrowers] = useState<Borrower[]>([]);

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

  return (
    <div className="borrow-document-overlay">
      <div className="borrow-document-modal">
        <div className="modal-header">
          <div className="header-content">
            <div className="header-icon">
              <Heart size={28} />
              <div className="icon-sparkle">
                <Sparkles size={14} />
              </div>
            </div>
            <div className="header-text">
              <h2 className="modal-title">
                {document.estEmprunte ? 'Retourner le document' : 'Nouvel emprunt'}
              </h2>
              <p className="modal-subtitle">
                {document.estEmprunte 
                  ? 'Finalisez le retour de ce document' 
                  : 'Prêtez ce document à un membre de votre institution'
                }
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="close-button">
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          {/* Document information card */}
          <MicroCard className="document-info-card">
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
                {document.estEmprunte && (
                  <div className="borrowed-status">
                    <AlertTriangle size={14} />
                    Actuellement emprunté
                  </div>
                )}
              </div>
            </div>
          </MicroCard>

          {document.estEmprunte ? (
            // Return form
            <MicroCard className="return-form-card">
              <div className="form-section">
                <div className="section-header">
                  <div className="section-icon return-icon">
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="section-title">Confirmer le retour</h3>
                </div>
                
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
            </MicroCard>
          ) : (
            // Borrow form
            <>
              {/* Borrower selection */}
              <MicroCard className="borrower-selection-card">
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <Users size={20} />
                    </div>
                    <h3 className="section-title">Sélectionner l'emprunteur</h3>
                  </div>
                  
                  <div className="search-field">
                    <div className="search-input-container">
                      <Search size={16} />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                        placeholder="Rechercher par nom, matricule, email..."
                      />
                    </div>
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
                    
                    {filteredBorrowers.length === 0 && (
                      <div className="no-borrowers">
                        <Users size={32} />
                        <p>Aucun emprunteur trouvé</p>
                      </div>
                    )}
                  </div>
                </div>
              </MicroCard>

              {/* Return date selection */}
              <MicroCard className="date-selection-card">
                <div className="form-section">
                  <div className="section-header">
                    <div className="section-icon">
                      <Calendar size={20} />
                    </div>
                    <h3 className="section-title">Date de retour prévue</h3>
                  </div>
                  
                  <div className="date-field">
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="date-input"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <div className="date-help">
                      <Clock size={14} />
                      <span>Durée d'emprunt recommandée: 14 jours</span>
                    </div>
                  </div>
                </div>
              </MicroCard>
            </>
          )}

          {/* Action buttons */}
          <div className="modal-actions">
            <MicroButton
              variant="secondary"
              onClick={onCancel}
              icon={X}
            >
              Annuler
            </MicroButton>
            
            {document.estEmprunte ? (
              <MicroButton
                variant="success"
                onClick={handleReturn}
                disabled={isLoading}
                icon={CheckCircle}
              >
                {isLoading ? (
                  <>
                    <MicroLoader size={16} color="white" />
                    Traitement...
                  </>
                ) : (
                  'Confirmer le retour'
                )}
              </MicroButton>
            ) : (
              <MicroButton
                variant="primary"
                onClick={handleBorrow}
                disabled={isLoading || !selectedBorrowerId || !returnDate}
                icon={Heart}
              >
                {isLoading ? (
                  <>
                    <MicroLoader size={16} color="white" />
                    Enregistrement...
                  </>
                ) : (
                  'Confirmer l\'emprunt'
                )}
              </MicroButton>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .borrow-document-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 60;
          padding: 16px;
          backdrop-filter: blur(12px);
        }
        
        .borrow-document-modal {
          background: #FFFFFF;
          border-radius: 24px;
          box-shadow: 
            0 32px 64px rgba(0, 0, 0, 0.2),
            0 0 0 1px rgba(229, 220, 194, 0.3);
          width: 100%;
          max-width: 800px;
          max-height: 95vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          position: relative;
          animation: modalSlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        .modal-header {
          background: linear-gradient(135deg, #C2571B 0%, #A8481A 100%);
          color: #F3EED9;
          padding: 40px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          overflow: hidden;
        }
        
        .modal-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(243, 238, 217, 0.15) 0%, transparent 70%);
          animation: headerGlow 8s ease-in-out infinite;
        }
        
        @keyframes headerGlow {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 24px;
          position: relative;
          z-index: 1;
        }
        
        .header-icon {
          width: 72px;
          height: 72px;
          background: linear-gradient(135deg, rgba(243, 238, 217, 0.2) 0%, rgba(243, 238, 217, 0.1) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          position: relative;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        }
        
        .icon-sparkle {
          position: absolute;
          top: -4px;
          right: -4px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          animation: sparkle 2s ease-in-out infinite;
        }
        
        @keyframes sparkle {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(1.2) rotate(180deg); opacity: 0.8; }
        }
        
        .header-text {
          flex: 1;
        }
        
        .modal-title {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 8px 0;
          line-height: 1.2;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .modal-subtitle {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
          line-height: 1.4;
        }
        
        .close-button {
          width: 48px;
          height: 48px;
          border: none;
          background: rgba(243, 238, 217, 0.1);
          color: #F3EED9;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          z-index: 1;
        }
        
        .close-button:hover {
          background: rgba(243, 238, 217, 0.2);
          transform: scale(1.1);
        }
        
        .modal-content {
          padding: 32px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
          flex: 1;
        }
        
        .document-info-card {
          border: 2px solid rgba(194, 87, 27, 0.1);
          background: linear-gradient(135deg, rgba(194, 87, 27, 0.05) 0%, rgba(243, 238, 217, 0.1) 100%);
        }
        
        .document-preview {
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 20px;
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
          color: #6E6E6E;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .document-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: #6E6E6E;
          background: rgba(62, 92, 73, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
        }
        
        .borrowed-status {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #C2571B;
          background: rgba(194, 87, 27, 0.1);
          padding: 8px 16px;
          border-radius: 12px;
          font-weight: 600;
          margin-top: 12px;
          width: fit-content;
        }
        
        .form-section {
          padding: 24px;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .section-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #F3EED9;
          box-shadow: 0 6px 20px rgba(62, 92, 73, 0.3);
        }
        
        .section-icon.return-icon {
          background: linear-gradient(135deg, #3E5C49 0%, #2E453A 100%);
          box-shadow: 0 6px 20px rgba(62, 92, 73, 0.3);
        }
        
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #2E2E2E;
          margin: 0;
        }
        
        .search-input-container {
          position: relative;
          display: flex;
          align-items: center;
          gap: 12px;
          background: #FFFFFF;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.3s ease;
        }
        
        .search-input-container:focus-within {
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.15);
        }
        
        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #2E2E2E;
          background: transparent;
        }
        
        .search-input::placeholder {
          color: #6E6E6E;
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
          transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
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
          color: #6E6E6E;
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
          gap: 12px;
          font-size: 14px;
        }
        
        .borrower-type,
        .borrower-matricule,
        .borrower-class {
          color: #6E6E6E;
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
          color: #6E6E6E;
        }
        
        .no-borrowers svg {
          margin: 0 auto 16px;
          opacity: 0.5;
        }
        
        .date-field {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .date-input {
          padding: 16px 20px;
          border: 2px solid #E5DCC2;
          border-radius: 12px;
          font-size: 16px;
          color: #2E2E2E;
          background: #FFFFFF;
          transition: all 0.3s ease;
        }
        
        .date-input:focus {
          outline: none;
          border-color: #3E5C49;
          box-shadow: 0 0 0 3px rgba(62, 92, 73, 0.15);
        }
        
        .date-help {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6E6E6E;
          background: rgba(62, 92, 73, 0.05);
          padding: 8px 16px;
          border-radius: 8px;
        }
        
        .return-form-card {
          border: 2px solid rgba(62, 92, 73, 0.2);
          background: linear-gradient(135deg, rgba(62, 92, 73, 0.05) 0%, #FFFFFF 100%);
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
          display: flex;
          justify-content: flex-end;
          gap: 16px;
          padding-top: 24px;
          border-top: 2px solid rgba(229, 220, 194, 0.3);
          margin-top: auto;
        }
        
        @media (max-width: 768px) {
          .borrow-document-modal {
            max-width: 100%;
            margin: 8px;
            border-radius: 20px;
          }
          
          .modal-header {
            padding: 24px;
          }
          
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 16px;
          }
          
          .modal-title {
            font-size: 24px;
          }
          
          .modal-content {
            padding: 20px;
            gap: 20px;
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
        
        /* Amélioration de l'accessibilité */
        .borrower-item:focus-visible {
          outline: 2px solid #3E5C49;
          outline-offset: 2px;
        }
        
        .close-button:focus-visible {
          outline: 2px solid #F3EED9;
          outline-offset: 2px;
        }
        
        /* Scrollbar personnalisé */
        .borrowers-list::-webkit-scrollbar {
          width: 6px;
        }
        
        .borrowers-list::-webkit-scrollbar-track {
          background: #F3EED9;
          border-radius: 3px;
        }
        
        .borrowers-list::-webkit-scrollbar-thumb {
          background: #3E5C49;
          border-radius: 3px;
        }
        
        .borrowers-list::-webkit-scrollbar-thumb:hover {
          background: #2E453A;
        }
        
        /* Préférences de mouvement réduit */
        @media (prefers-reduced-motion: reduce) {
          .borrow-document-modal,
          .borrower-item,
          .close-button,
          .icon-sparkle,
          .modal-header::before {
            animation: none;
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};