import { Document, Borrower, BorrowHistory } from '../../types';

export interface ReportData {
  title: string;
  subtitle?: string;
  generatedAt: string;
  institutionName?: string;
  data: any[];
  summary?: ReportSummary;
}

export interface ReportSummary {
  totalItems: number;
  [key: string]: any;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'pdf';
  includeDetails: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}

export class ReportService {
  // Génération de rapport sur les documents
  static generateDocumentReport(documents: Document[], options?: ExportOptions): ReportData {
    const now = new Date();
    
    // Filtrage par date si spécifié
    let filteredDocuments = documents;
    if (options?.dateRange) {
      filteredDocuments = documents.filter(doc => {
        const createdAt = doc.createdAt || doc.lastModified;
        if (!createdAt) return true;
        const docDate = new Date(createdAt);
        return docDate >= new Date(options.dateRange!.start) && 
               docDate <= new Date(options.dateRange!.end);
      });
    }

    const reportData: ReportData = {
      title: 'Rapport des Documents',
      subtitle: `Bibliothèque - ${now.toLocaleDateString('fr-FR')}`,
      generatedAt: now.toISOString(),
      data: filteredDocuments.map(doc => ({
        id: doc.id,
        titre: doc.titre,
        auteur: doc.auteur,
        editeur: doc.editeur,
        annee: doc.annee,
        type: doc.type || 'Livre',
        cote: doc.cote,
        statut: doc.estEmprunte ? 'Emprunté' : 'Disponible',
        emprunteur: doc.nomEmprunteur || '',
        dateEmprunt: doc.dateEmprunt ? new Date(doc.dateEmprunt).toLocaleDateString('fr-FR') : '',
        dateRetourPrevu: doc.dateRetourPrevu ? new Date(doc.dateRetourPrevu).toLocaleDateString('fr-FR') : '',
        descripteurs: doc.descripteurs
      })),
      summary: {
        totalItems: filteredDocuments.length,
        totalDisponibles: filteredDocuments.filter(d => !d.estEmprunte).length,
        totalEmpruntes: filteredDocuments.filter(d => d.estEmprunte).length,
        parType: this.groupByType(filteredDocuments),
        parAnnee: this.groupByYear(filteredDocuments)
      }
    };

    return reportData;
  }

  // Génération de rapport sur les emprunteurs
  static generateBorrowerReport(borrowers: Borrower[], borrowHistory?: BorrowHistory[], options?: ExportOptions): ReportData {
    const now = new Date();
    
    // Filtrage par date si spécifié
    let filteredBorrowers = borrowers;
    if (options?.dateRange) {
      filteredBorrowers = borrowers.filter(borrower => {
        const createdAt = borrower.createdAt || borrower.lastModified;
        if (!createdAt) return true;
        const borrowerDate = new Date(createdAt);
        return borrowerDate >= new Date(options.dateRange!.start) && 
               borrowerDate <= new Date(options.dateRange!.end);
      });
    }

    // Calcul des statistiques d'emprunt par emprunteur
    const borrowStats = this.calculateBorrowerStats(filteredBorrowers, borrowHistory || []);

    const reportData: ReportData = {
      title: 'Rapport des Emprunteurs',
      subtitle: `Bibliothèque - ${now.toLocaleDateString('fr-FR')}`,
      generatedAt: now.toISOString(),
      data: filteredBorrowers.map(borrower => ({
        id: borrower.id,
        nom: `${borrower.firstName} ${borrower.lastName}`,
        matricule: borrower.matricule,
        type: borrower.type === 'student' ? 'Étudiant' : 'Personnel',
        classe: borrower.classe || '',
        cni: borrower.cniNumber || '',
        position: borrower.position || '',
        email: borrower.email || '',
        telephone: borrower.phone || '',
        totalEmprunts: borrowStats[borrower.id!]?.totalBorrows || 0,
        empruntsActifs: borrowStats[borrower.id!]?.activeBorrows || 0,
        empruntsEnRetard: borrowStats[borrower.id!]?.overdueBorrows || 0,
        derniereActivite: borrowStats[borrower.id!]?.lastActivity || ''
      })),
      summary: {
        totalItems: filteredBorrowers.length,
        totalEtudiants: filteredBorrowers.filter(b => b.type === 'student').length,
        totalPersonnel: filteredBorrowers.filter(b => b.type === 'staff').length,
        emprunteursActifs: Object.values(borrowStats).filter((stats: any) => stats.activeBorrows > 0).length,
        totalEmprunts: Object.values(borrowStats).reduce((sum: number, stats: any) => sum + stats.totalBorrows, 0)
      }
    };

    return reportData;
  }

  // Génération de rapport d'historique des emprunts
  static generateBorrowHistoryReport(borrowHistory: BorrowHistory[], options?: ExportOptions): ReportData {
    const now = new Date();
    
    // Filtrage par date si spécifié
    let filteredHistory = borrowHistory;
    if (options?.dateRange) {
      filteredHistory = borrowHistory.filter(history => {
        const borrowDate = new Date(history.borrowDate);
        return borrowDate >= new Date(options.dateRange!.start) && 
               borrowDate <= new Date(options.dateRange!.end);
      });
    }

    const reportData: ReportData = {
      title: 'Rapport d\'Historique des Emprunts',
      subtitle: `Bibliothèque - ${now.toLocaleDateString('fr-FR')}`,
      generatedAt: now.toISOString(),
      data: filteredHistory.map(history => {
        const borrowDate = new Date(history.borrowDate);
        const expectedReturnDate = new Date(history.expectedReturnDate);
        const actualReturnDate = history.actualReturnDate ? new Date(history.actualReturnDate) : null;
        const currentDate = new Date();
        
        // Calculate loan duration
        const endDate = actualReturnDate || currentDate;
        const loanDuration = Math.ceil((endDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
        
        // Calculate overdue days
        let overdueDays = 0;
        if (history.status === 'overdue' || (history.status === 'active' && currentDate > expectedReturnDate)) {
          const checkDate = actualReturnDate || currentDate;
          overdueDays = Math.max(0, Math.ceil((checkDate.getTime() - expectedReturnDate.getTime()) / (1000 * 60 * 60 * 24)));
        }
        
        return {
          // Document Information
          documentTitre: history.document?.titre || `Document ID: ${history.documentId}`,
          documentAuteur: history.document?.auteur || '',
          documentEditeur: history.document?.editeur || '',
          documentAnnee: history.document?.annee || '',
          documentType: history.document?.type || 'Livre',
          documentCote: history.document?.cote || '',
          documentISBN: history.document?.isbn || '',
          
          // Borrower Information  
          emprunteurNom: history.borrower ? `${history.borrower.firstName} ${history.borrower.lastName}` : `Emprunteur ID: ${history.borrowerId}`,
          emprunteurPrenom: history.borrower?.firstName || '',
          emprunteurNomFamille: history.borrower?.lastName || '',
          emprunteurMatricule: history.borrower?.matricule || '',
          emprunteurType: history.borrower?.type === 'student' ? 'Étudiant' : history.borrower?.type === 'staff' ? 'Personnel' : '',
          emprunteurClasse: history.borrower?.classe || '',
          emprunteurPosition: history.borrower?.position || '',
          emprunteurEmail: history.borrower?.email || '',
          emprunteurTelephone: history.borrower?.phone || '',
          emprunteurCNI: history.borrower?.cniNumber || '',
          
          // Loan Details
          dateEmprunt: borrowDate.toLocaleDateString('fr-FR'),
          heureEmprunt: borrowDate.toLocaleTimeString('fr-FR'),
          dateRetourPrevu: expectedReturnDate.toLocaleDateString('fr-FR'),
          dateRetourEffective: actualReturnDate ? actualReturnDate.toLocaleDateString('fr-FR') : '',
          heureRetourEffective: actualReturnDate ? actualReturnDate.toLocaleTimeString('fr-FR') : '',
          
          // Status and Duration
          statut: history.status === 'active' ? 'En cours' : 
                  history.status === 'returned' ? 'Retourné' : 
                  history.status === 'overdue' ? 'En retard' : 'Inconnu',
          dureeEmprunt: `${loanDuration} jour${loanDuration > 1 ? 's' : ''}`,
          joursRetard: overdueDays > 0 ? `${overdueDays} jour${overdueDays > 1 ? 's' : ''}` : '',
          estEnRetard: overdueDays > 0 ? 'Oui' : 'Non',
          
          // Additional Information
          notes: history.notes || '',
          periodeEmprunt: this.calculateLoanPeriod(borrowDate, expectedReturnDate),
          saisonEmprunt: this.getSeason(borrowDate),
          anneeScolaire: this.getSchoolYear(borrowDate)
        };
      }),
      summary: {
        totalItems: filteredHistory.length,
        empruntsActifs: filteredHistory.filter(h => h.status === 'active').length,
        empruntsRetournes: filteredHistory.filter(h => h.status === 'returned').length,
        empruntsEnRetard: filteredHistory.filter(h => h.status === 'overdue').length,
        dureeMovenneEmprunt: this.calculateAverageBorrowDuration(filteredHistory)
      }
    };

    return reportData;
  }

  // Export en CSV
  static exportToCSV(reportData: ReportData): string {
    if (reportData.data.length === 0) return '';

    const headers = Object.keys(reportData.data[0]);
    const csvContent = [
      `"${reportData.title}"`,
      `"Généré le: ${new Date(reportData.generatedAt).toLocaleString('fr-FR')}"`,
      '',
      headers.map(h => `"${h}"`).join(','),
      ...reportData.data.map(row => 
        headers.map(header => `"${(row[header] || '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ].join('\n');

    // Add UTF-8 BOM for proper Excel encoding
    return '\ufeff' + csvContent;
  }

  // Export en PDF (génère le contenu HTML à convertir)
  static generatePDFContent(reportData: ReportData): string {
    const styles = `
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { color: #3E5C49; margin-bottom: 5px; }
        .header p { color: #666; margin: 0; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .summary h3 { margin-top: 0; color: #3E5C49; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; }
        .summary-item { background: white; padding: 10px; border-radius: 4px; }
        .summary-item strong { color: #C2571B; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #3E5C49; color: white; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
      </style>
    `;

    const summaryHtml = reportData.summary ? `
      <div class="summary">
        <h3>Résumé</h3>
        <div class="summary-grid">
          ${Object.entries(reportData.summary).map(([key, value]) => `
            <div class="summary-item">
              <strong>${this.formatSummaryKey(key)}:</strong> ${this.formatSummaryValue(value)}
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const tableHeaders = reportData.data.length > 0 ? Object.keys(reportData.data[0]) : [];
    const tableHtml = `
      <table>
        <thead>
          <tr>
            ${tableHeaders.map(header => `<th>${this.formatColumnHeader(header)}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${reportData.data.map(row => `
            <tr>
              ${tableHeaders.map(header => `<td>${row[header] || ''}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${reportData.title}</title>
          ${styles}
        </head>
        <body>
          <div class="header">
            <h1>${reportData.title}</h1>
            <p>${reportData.subtitle}</p>
            <p>Généré le ${new Date(reportData.generatedAt).toLocaleString('fr-FR')}</p>
          </div>
          
          ${summaryHtml}
          ${tableHtml}
          
          <div class="footer">
            <p>Ce rapport a été généré automatiquement par l'application Bibliothèque</p>
          </div>
        </body>
      </html>
    `;
  }

  // Téléchargement du fichier
  static downloadFile(content: string, filename: string, mimeType: string) {
    // Ensure proper UTF-8 encoding for CSV files
    const blob = new Blob([content], { 
      type: mimeType + ';charset=utf-8'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Méthodes utilitaires
  private static groupByType(documents: Document[]): Record<string, number> {
    return documents.reduce((acc, doc) => {
      const type = doc.type || 'Livre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static groupByYear(documents: Document[]): Record<string, number> {
    return documents.reduce((acc, doc) => {
      const year = doc.annee || 'Non spécifié';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }

  private static calculateBorrowerStats(borrowers: Borrower[], borrowHistory: BorrowHistory[]): Record<number, any> {
    const stats: Record<number, any> = {};
    
    borrowers.forEach(borrower => {
      if (!borrower.id) return;
      
      const borrowerHistory = borrowHistory.filter(h => h.borrowerId === borrower.id);
      const activeBorrows = borrowerHistory.filter(h => h.status === 'active').length;
      const overdueBorrows = borrowerHistory.filter(h => h.status === 'overdue').length;
      const lastActivity = borrowerHistory.length > 0 ? 
        Math.max(...borrowerHistory.map(h => new Date(h.borrowDate).getTime())) : null;
      
      stats[borrower.id] = {
        totalBorrows: borrowerHistory.length,
        activeBorrows,
        overdueBorrows,
        lastActivity: lastActivity ? new Date(lastActivity).toLocaleDateString('fr-FR') : ''
      };
    });
    
    return stats;
  }

  private static calculateAverageBorrowDuration(borrowHistory: BorrowHistory[]): string {
    const returnedBorrows = borrowHistory.filter(h => h.actualReturnDate);
    if (returnedBorrows.length === 0) return 'N/A';
    
    const totalDays = returnedBorrows.reduce((sum, history) => {
      const borrowDate = new Date(history.borrowDate);
      const returnDate = new Date(history.actualReturnDate!);
      const duration = Math.ceil((returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + duration;
    }, 0);
    
    const average = Math.round(totalDays / returnedBorrows.length);
    return `${average} jours`;
  }

  private static formatSummaryKey(key: string): string {
    const keyMap: Record<string, string> = {
      totalItems: 'Total d\'éléments',
      totalDisponibles: 'Documents disponibles',
      totalEmpruntes: 'Documents empruntés',
      totalEtudiants: 'Étudiants',
      totalPersonnel: 'Personnel',
      emprunteursActifs: 'Emprunteurs actifs',
      totalEmprunts: 'Total emprunts',
      empruntsActifs: 'Emprunts actifs',
      empruntsRetournes: 'Emprunts retournés',
      empruntsEnRetard: 'Emprunts en retard',
      dureeMovenneEmprunt: 'Durée moyenne'
    };
    return keyMap[key] || key;
  }

  private static formatSummaryValue(value: any): string {
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
    }
    return value.toString();
  }

  private static formatColumnHeader(header: string): string {
    const headerMap: Record<string, string> = {
      // Document fields
      id: 'ID',
      titre: 'Titre',
      auteur: 'Auteur',
      editeur: 'Éditeur',
      annee: 'Année',
      type: 'Type',
      cote: 'Cote',
      statut: 'Statut',
      descripteurs: 'Descripteurs',
      
      // Enhanced document fields for history report
      documentTitre: 'Titre du Document',
      documentAuteur: 'Auteur du Document',
      documentEditeur: 'Éditeur',
      documentAnnee: 'Année de Publication',
      documentType: 'Type de Document',
      documentCote: 'Cote',
      documentISBN: 'ISBN',
      
      // Borrower fields
      nom: 'Nom',
      matricule: 'Matricule',
      classe: 'Classe',
      cni: 'CNI',
      position: 'Position',
      email: 'Email',
      telephone: 'Téléphone',
      
      // Enhanced borrower fields for history report
      emprunteur: 'Emprunteur',
      emprunteurNom: 'Nom Complet',
      emprunteurPrenom: 'Prénom',
      emprunteurNomFamille: 'Nom de Famille',
      emprunteurMatricule: 'Matricule',
      emprunteurType: 'Type d\'Emprunteur',
      emprunteurClasse: 'Classe/Niveau',
      emprunteurPosition: 'Poste/Position',
      emprunteurEmail: 'Email',
      emprunteurTelephone: 'Téléphone',
      emprunteurCNI: 'CNI',
      
      // Loan fields
      dateEmprunt: 'Date d\'Emprunt',
      heureEmprunt: 'Heure d\'Emprunt',
      dateRetourPrevu: 'Date de Retour Prévue',
      dateRetourEffective: 'Date de Retour Effective',
      heureRetourEffective: 'Heure de Retour',
      dureeEmprunt: 'Durée d\'Emprunt',
      joursRetard: 'Jours de Retard',
      estEnRetard: 'En Retard',
      periodeEmprunt: 'Période d\'Emprunt',
      saisonEmprunt: 'Saison',
      anneeScolaire: 'Année Scolaire',
      
      // Statistics fields
      totalEmprunts: 'Total Emprunts',
      empruntsActifs: 'Emprunts Actifs',
      empruntsEnRetard: 'En Retard',
      derniereActivite: 'Dernière Activité',
      
      // General fields
      document: 'Document',
      notes: 'Notes et Observations'
    };
    return headerMap[header] || header;
  }

  // New utility methods for enhanced history report
  private static calculateLoanPeriod(borrowDate: Date, expectedReturnDate: Date): string {
    const diffTime = expectedReturnDate.getTime() - borrowDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) return 'Court terme (≤7 jours)';
    if (diffDays <= 14) return 'Moyen terme (8-14 jours)';
    if (diffDays <= 30) return 'Long terme (15-30 jours)';
    return 'Très long terme (>30 jours)';
  }

  private static getSeason(date: Date): string {
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    
    if (month >= 3 && month <= 5) return 'Printemps';
    if (month >= 6 && month <= 8) return 'Été';
    if (month >= 9 && month <= 11) return 'Automne';
    return 'Hiver';
  }

  private static getSchoolYear(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    
    // Academic year typically starts in September
    if (month >= 9) {
      return `${year}-${year + 1}`;
    } else {
      return `${year - 1}-${year}`;
    }
  }
}