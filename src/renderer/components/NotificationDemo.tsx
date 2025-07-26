import React from 'react';
import { useQuickToast } from './ToastSystem';
import { MicroButton, MicroCard } from './MicroInteractions';

export const NotificationDemo: React.FC = () => {
  const toast = useQuickToast();

  const testBasicNotifications = () => {
    setTimeout(() => toast.success('Opération réussie', 'Le document a été ajouté avec succès'), 100);
    setTimeout(() => toast.info('Information importante', 'Nouvelle fonctionnalité disponible'), 600);
    setTimeout(() => toast.warning('Attention requise', 'Vérifiez les données avant de continuer'), 1100);
    setTimeout(() => toast.error('Erreur détectée', 'Impossible de se connecter au serveur'), 1600);
  };

  const testLibraryNotifications = () => {
    setTimeout(() => toast.documentAdded('Les Misérables - Victor Hugo'), 100);
    setTimeout(() => toast.documentBorrowed('1984 - George Orwell', 'Marie Dupont'), 600);
    setTimeout(() => toast.documentReturned('Le Petit Prince - Saint-Exupéry'), 1100);
    setTimeout(() => toast.borrowerAdded('Jean Dupuis'), 1600);
  };

  const testSystemNotifications = () => {
    setTimeout(() => toast.exportCompleted('excel', 'rapport_documents_2024.xlsx'), 100);
    setTimeout(() => toast.backupCreated('backup_bibliotheque_20240126.zip'), 600);
    setTimeout(() => toast.reportGenerated('Historique des Emprunts', 127), 1100);
    setTimeout(() => toast.settingsUpdated(), 1600);
  };

  const testAlertNotifications = () => {
    setTimeout(() => toast.overdueAlert(3), 100);
    setTimeout(() => toast.securityAlert('Tentative de connexion suspecte détectée'), 600);
    setTimeout(() => toast.systemUpdate('2.1.3'), 1100);
    setTimeout(() => toast.maintenance('Maintenance prévue demain de 02h00 à 04h00'), 1600);
  };

  const testSpecialNotifications = () => {
    setTimeout(() => toast.welcome('Marie'), 100);
    
    // Test progress notification
    setTimeout(() => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 15;
        toast.syncProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 600);
    }, 1000);
  };

  return (
    <div style={{ 
      padding: '32px', 
      maxWidth: '800px', 
      margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '24px'
    }}>
      <MicroCard>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#3E5C49', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Notifications de base
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#5A6B5D', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Succès, erreur, avertissement et information
        </p>
        <MicroButton onClick={testBasicNotifications} variant="primary">
          Tester les notifications de base
        </MicroButton>
      </MicroCard>

      <MicroCard>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#3E5C49', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Notifications bibliothèque
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#5A6B5D', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Documents, emprunts et emprunteurs
        </p>
        <MicroButton onClick={testLibraryNotifications} variant="secondary">
          Tester les notifications métier
        </MicroButton>
      </MicroCard>

      <MicroCard>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#3E5C49', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Notifications système
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#5A6B5D', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Exports, sauvegardes et paramètres
        </p>
        <MicroButton onClick={testSystemNotifications} variant="success">
          Tester les notifications système
        </MicroButton>
      </MicroCard>

      <MicroCard>
        <h3 style={{ 
          margin: '0 0 16px 0', 
          color: '#3E5C49', 
          fontSize: '18px',
          fontWeight: '600'
        }}>
          Alertes importantes
        </h3>
        <p style={{ 
          margin: '0 0 20px 0', 
          color: '#5A6B5D', 
          fontSize: '14px',
          lineHeight: '1.5'
        }}>
          Retards, sécurité et maintenance
        </p>
        <MicroButton onClick={testAlertNotifications} variant="danger">
          Tester les alertes
        </MicroButton>
      </MicroCard>

      <div style={{ gridColumn: '1 / -1' }}>
        <MicroCard>
          <h3 style={{ 
            margin: '0 0 16px 0', 
            color: '#3E5C49', 
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Notifications spéciales
          </h3>
          <p style={{ 
            margin: '0 0 20px 0', 
            color: '#5A6B5D', 
            fontSize: '14px',
            lineHeight: '1.5'
          }}>
            Bienvenue et progression avec animations
          </p>
          <MicroButton onClick={testSpecialNotifications} variant="primary">
            Tester les notifications spéciales
          </MicroButton>
        </MicroCard>
      </div>
    </div>
  );
};