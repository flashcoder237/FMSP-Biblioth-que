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
  // Génération de rapport sur les documents avec informations d'institution
  static generateDocumentReport(documents: Document[], options?: ExportOptions, institutionInfo?: any): ReportData {
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
      subtitle: `Bibliosilio - ${now.toLocaleDateString('fr-FR')}`,
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

    // Ajouter les informations d'institution si disponibles
    if (institutionInfo) {
      reportData.institutionName = institutionInfo.name;
      reportData.subtitle = `${institutionInfo.name} - ${now.toLocaleDateString('fr-FR')}`;
    }

    return reportData;
  }

  // Génération de rapport sur les emprunteurs
  static generateBorrowerReport(borrowers: Borrower[], borrowHistory?: BorrowHistory[], options?: ExportOptions, institutionInfo?: any): ReportData {
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
      subtitle: `Bibliosilio - ${now.toLocaleDateString('fr-FR')}`,
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

    // Ajouter les informations d'institution si disponibles
    if (institutionInfo) {
      reportData.institutionName = institutionInfo.name;
      reportData.subtitle = `${institutionInfo.name} - ${now.toLocaleDateString('fr-FR')}`;
    }

    return reportData;
  }

  // Génération de rapport d'historique des emprunts
  static generateBorrowHistoryReport(borrowHistory: BorrowHistory[], options?: ExportOptions, institutionInfo?: any): ReportData {
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
      subtitle: `Bibliosilio - ${now.toLocaleDateString('fr-FR')}`,
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

    // Ajouter les informations d'institution si disponibles
    if (institutionInfo) {
      reportData.institutionName = institutionInfo.name;
      reportData.subtitle = `${institutionInfo.name} - ${now.toLocaleDateString('fr-FR')}`;
    }

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

  // Génération de contenu PDF avec design amélioré
  static generatePDFContent(reportData: ReportData, institutionInfo?: any): string {
    const primaryColor = institutionInfo?.primaryColor || '#3E5C49';
    const secondaryColor = institutionInfo?.secondaryColor || '#C2571B';
    const logoSection = institutionInfo?.logo ? 
      `<img src="${institutionInfo.logo}" alt="Logo" style="height: 60px; margin-right: 20px;">` : '';

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${reportData.title}</title>
    <style>
        @page {
            margin: 2cm;
            size: A4;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
        }
        
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 0;
            border-bottom: 3px solid ${primaryColor};
            margin-bottom: 30px;
        }
        
        .header-left {
            display: flex;
            align-items: center;
        }
        
        .header-info h1 {
            color: ${primaryColor};
            font-size: 28px;
            margin: 0;
            font-weight: 700;
        }
        
        .header-info h2 {
            color: ${secondaryColor};
            font-size: 18px;
            margin: 5px 0 0 0;
            font-weight: 400;
        }
        
        .header-right {
            text-align: right;
            color: #666;
        }
        
        .institution-info {
            background: linear-gradient(135deg, ${primaryColor}15, ${secondaryColor}10);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 4px solid ${primaryColor};
        }
        
        .institution-info h3 {
            color: ${primaryColor};
            margin: 0 0 10px 0;
            font-size: 20px;
        }
        
        .institution-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            font-size: 14px;
        }
        
        .institution-details div {
            display: flex;
            align-items: center;
        }
        
        .institution-details strong {
            color: ${primaryColor};
            margin-right: 8px;
        }
        
        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .summary-card {
            background: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-top: 4px solid ${primaryColor};
        }
        
        .summary-card h3 {
            color: ${primaryColor};
            font-size: 32px;
            margin: 0;
            font-weight: 700;
        }
        
        .summary-card p {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .data-table thead {
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            color: white;
        }
        
        .data-table th,
        .data-table td {
            padding: 12px 15px;
            text-align: left;
            border-bottom: 1px solid #eee;
        }
        
        .data-table th {
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-size: 12px;
        }
        
        .data-table tbody tr:hover {
            background-color: #f8f9fa;
        }
        
        .data-table tbody tr:nth-child(even) {
            background-color: #fafafa;
        }
        
        .status-badge {
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-disponible {
            background: #e8f5e8;
            color: #2d5a2d;
        }
        
        .status-emprunte {
            background: #fff3e0;
            color: #cc5500;
        }
        
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #eee;
            text-align: center;
            color: #666;
            font-size: 12px;
        }
        
        .footer p {
            margin: 5px 0;
        }
        
        .generated-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            font-size: 12px;
            color: #666;
        }

        .bibliosilio-branding {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 20px;
            padding: 10px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 8px;
            border: 1px solid #dee2e6;
            font-size: 11px;
            color: #495057;
        }

        .bibliosilio-branding strong {
            color: #3E5C49;
            font-weight: 600;
        }
        
        .chart-placeholder {
            height: 200px;
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #666;
            margin: 20px 0;
        }
        
        @media print {
            .header-right {
                font-size: 12px;
            }
            .summary-cards {
                grid-template-columns: repeat(4, 1fr);
            }
            .data-table {
                font-size: 11px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="header-left">
            ${logoSection}
            <div class="header-info">
                <h1>${reportData.title}</h1>
                <h2>${reportData.subtitle || ''}</h2>
            </div>
        </div>
        <div class="header-right">
            <div><strong>Généré le :</strong> ${new Date(reportData.generatedAt).toLocaleDateString('fr-FR')}</div>
            <div><strong>Heure :</strong> ${new Date(reportData.generatedAt).toLocaleTimeString('fr-FR')}</div>
        </div>
    </div>

    ${institutionInfo ? `
    <div class="institution-info">
        <h3>${institutionInfo.name}</h3>
        <div class="institution-details">
            ${institutionInfo.address ? `<div><strong>📍</strong> ${institutionInfo.address}, ${institutionInfo.city}</div>` : ''}
            ${institutionInfo.phone ? `<div><strong>📞</strong> ${institutionInfo.phone}</div>` : ''}
            ${institutionInfo.email ? `<div><strong>📧</strong> ${institutionInfo.email}</div>` : ''}
            ${institutionInfo.website ? `<div><strong>🌐</strong> ${institutionInfo.website}</div>` : ''}
            ${institutionInfo.director ? `<div><strong>👤</strong> Directeur: ${institutionInfo.director}</div>` : ''}
            ${institutionInfo.librarian ? `<div><strong>📚</strong> Bibliothécaire: ${institutionInfo.librarian}</div>` : ''}
        </div>
    </div>
    ` : ''}

    ${reportData.summary ? `
    <div class="summary-cards">
        <div class="summary-card">
            <h3>${reportData.summary.totalItems || 0}</h3>
            <p>Total éléments</p>
        </div>
        ${reportData.summary.totalDisponibles !== undefined ? `
        <div class="summary-card">
            <h3>${reportData.summary.totalDisponibles}</h3>
            <p>Disponibles</p>
        </div>
        ` : ''}
        ${reportData.summary.totalEmpruntes !== undefined ? `
        <div class="summary-card">
            <h3>${reportData.summary.totalEmpruntes}</h3>
            <p>Empruntés</p>
        </div>
        ` : ''}
        ${reportData.summary.totalActifs !== undefined ? `
        <div class="summary-card">
            <h3>${reportData.summary.totalActifs}</h3>
            <p>Actifs</p>
        </div>
        ` : ''}
    </div>
    ` : ''}

    <table class="data-table">
        <thead>
            <tr>
                ${this.generateTableHeaders(reportData.data[0] || {})}
            </tr>
        </thead>
        <tbody>
            ${reportData.data.map(item => `
                <tr>
                    ${this.generateTableRow(item)}
                </tr>
            `).join('')}
        </tbody>
    </table>

    <div class="footer">
        <p>${institutionInfo?.reportFooter || `© ${new Date().getFullYear()} - Rapport généré par Bibliosilio`}</p>
        <div class="generated-info">
            <p><strong>Informations de génération :</strong></p>
            <p>Rapport généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
            <p>Nombre total d'enregistrements : ${reportData.data.length}</p>
        </div>
        <div class="bibliosilio-branding">
            <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="11" fill="#3E5C49" opacity="0.1"/>
                <rect x="6" y="14" width="10" height="6" rx="1" fill="#3E5C49" opacity="0.3"/>
                <rect x="7" y="12" width="8" height="5" rx="1" fill="#C2571B" opacity="0.5"/>
                <rect x="8" y="10" width="6" height="4" rx="1" fill="#3E5C49"/>
                <path d="M10 6 Q10 5, 11 5 L13 5 Q14 5, 14 6 L14 9 L10 9 Z" fill="#F3EED9" opacity="0.8"/>
                <line x1="12" y1="5" x2="12" y2="9" stroke="#3E5C49" stroke-width="0.5"/>
            </svg>
            <span>Généré via <strong>Bibliosilio</strong></span>
        </div>
    </div>
</body>
</html>`;
  }

  private static generateTableHeaders(sampleItem: any): string {
    if (!sampleItem) return '';
    
    return Object.keys(sampleItem)
      .filter(key => !['id'].includes(key))
      .map(key => `<th>${this.formatHeaderName(key)}</th>`)
      .join('');
  }

  private static generateTableRow(item: any): string {
    return Object.keys(item)
      .filter(key => !['id'].includes(key))
      .map(key => {
        let value = item[key];
        
        // Format special values
        if (key === 'statut') {
          const statusClass = value === 'Disponible' ? 'status-disponible' : 'status-emprunte';
          return `<td><span class="status-badge ${statusClass}">${value}</span></td>`;
        }
        
        return `<td>${value || '-'}</td>`;
      })
      .join('');
  }

  private static formatHeaderName(key: string): string {
    const headers: Record<string, string> = {
      titre: 'Titre',
      auteur: 'Auteur',
      editeur: 'Éditeur',
      annee: 'Année',
      type: 'Type',
      cote: 'Cote',
      statut: 'Statut',  
      emprunteur: 'Emprunteur',
      dateEmprunt: 'Date d\'emprunt',
      dateRetourPrevu: 'Retour prévu',
      descripteurs: 'Mots-clés',
      nom: 'Nom',
      matricule: 'Matricule',
      classe: 'Classe',
      email: 'Email',
      phone: 'Téléphone'
    };
    
    return headers[key] || key.charAt(0).toUpperCase() + key.slice(1);
  }
}