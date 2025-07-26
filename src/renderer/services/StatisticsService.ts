import { Document, Borrower, BorrowHistory } from '../../types';

export interface DetailedStatistics {
  overview: OverviewStats;
  documents: DocumentStats;
  borrowers: BorrowerStats;
  borrowHistory: BorrowHistoryStats;
  trends: TrendStats;
  insights: InsightStats;
}

export interface OverviewStats {
  totalDocuments: number;
  totalBorrowers: number;
  totalBorrows: number;
  activeLoans: number;
  overdueLoans: number;
  availableDocuments: number;
  utilizationRate: number; // Pourcentage d'utilisation de la collection
  averageLoanDuration: number; // Durée moyenne d'emprunt en jours
}

export interface DocumentStats {
  totalByType: Record<string, number>;
  totalByYear: Record<string, number>;
  totalByAuthor: Record<string, number>;
  mostBorrowedDocuments: Array<{
    document: Document;
    borrowCount: number;
    lastBorrowed?: string;
  }>;
  leastBorrowedDocuments: Array<{
    document: Document;
    borrowCount: number;
    lastBorrowed?: string;
  }>;
  neverBorrowedDocuments: Document[];
  documentsByPopularity: Array<{
    document: Document;
    borrowCount: number;
    rating: 'high' | 'medium' | 'low' | 'none';
  }>;
  averageDocumentAge: number;
  documentsByStatus: {
    available: number;
    borrowed: number;
    overdue: number;
  };
}

export interface BorrowerStats {
  totalByType: {
    students: number;
    staff: number;
  };
  topBorrowers: Array<{
    borrower: Borrower;
    borrowCount: number;
    activeLoans: number;
    overdueLoans: number;
    averageLoanDuration: number;
    lastActivity?: string;
  }>;
  inactiveBorrowers: Array<{
    borrower: Borrower;
    daysSinceLastActivity: number;
    totalBorrows: number;
  }>;
  borrowerActivity: {
    veryActive: number; // > 10 emprunts
    active: number; // 5-10 emprunts
    moderate: number; // 2-4 emprunts
    low: number; // 1 emprunt
    inactive: number; // 0 emprunt
  };
  averageBorrowsPerBorrower: number;
}

export interface BorrowHistoryStats {
  totalBorrows: number;
  totalReturns: number;
  activeLoans: number;
  overdueLoans: number;
  returnRate: number; // Pourcentage de retours à temps
  borrowsByMonth: Record<string, number>;
  returnsByMonth: Record<string, number>;
  peakBorrowingPeriods: Array<{
    period: string;
    count: number;
    type: 'day' | 'month' | 'season';
  }>;
  averageLoanDuration: number;
  longestLoans: Array<{
    borrowHistory: BorrowHistory;
    duration: number;
    status: string;
  }>;
  mostFrequentBorrowers: Array<{
    borrower: Borrower;
    borrowCount: number;
  }>;
}

export interface TrendStats {
  borrowingTrends: {
    thisMonth: number;
    lastMonth: number;
    growth: number;
    trend: 'up' | 'down' | 'stable';
  };
  popularCategories: Array<{
    category: string;
    borrowCount: number;
    growthRate: number;
  }>;
  seasonalTrends: Record<string, {
    spring: number;
    summer: number;
    fall: number;
    winter: number;
  }>;
  dailyPatterns: Record<string, number>; // Jour de la semaine
}

export interface InsightStats {
  recommendations: Array<{
    type: 'acquisition' | 'marketing' | 'policy' | 'maintenance';
    title: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    impact: string;
  }>;
  alerts: Array<{
    type: 'overdue' | 'popular' | 'unused' | 'maintenance';
    title: string;
    description: string;
    count: number;
    severity: 'critical' | 'warning' | 'info';
  }>;
  performance: {
    collectionUtilization: number;
    borrowerEngagement: number;
    returnCompliance: number;
    overallHealth: number;
  };
}

export class StatisticsService {
  static generateDetailedStatistics(
    documents: Document[],
    borrowers: Borrower[],
    borrowHistory: BorrowHistory[]
  ): DetailedStatistics {
    return {
      overview: this.generateOverviewStats(documents, borrowers, borrowHistory),
      documents: this.generateDocumentStats(documents, borrowHistory),
      borrowers: this.generateBorrowerStats(borrowers, borrowHistory),
      borrowHistory: this.generateBorrowHistoryStats(borrowHistory),
      trends: this.generateTrendStats(borrowHistory),
      insights: this.generateInsightStats(documents, borrowers, borrowHistory)
    };
  }

  private static generateOverviewStats(
    documents: Document[],
    borrowers: Borrower[],
    borrowHistory: BorrowHistory[]
  ): OverviewStats {
    const activeLoans = borrowHistory.filter(bh => bh.status === 'active').length;
    const overdueLoans = borrowHistory.filter(bh => bh.status === 'overdue').length;
    const availableDocuments = documents.length - activeLoans;
    
    const returnedLoans = borrowHistory.filter(bh => bh.actualReturnDate);
    const totalLoanDays = returnedLoans.reduce((sum, bh) => {
      const borrowDate = new Date(bh.borrowDate);
      const returnDate = new Date(bh.actualReturnDate!);
      const days = Math.ceil((returnDate.getTime() - borrowDate.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    
    return {
      totalDocuments: documents.length,
      totalBorrowers: borrowers.length,
      totalBorrows: borrowHistory.length,
      activeLoans,
      overdueLoans,
      availableDocuments,
      utilizationRate: documents.length > 0 ? (activeLoans / documents.length) * 100 : 0,
      averageLoanDuration: returnedLoans.length > 0 ? Math.round(totalLoanDays / returnedLoans.length) : 0
    };
  }

  private static generateDocumentStats(
    documents: Document[],
    borrowHistory: BorrowHistory[]
  ): DocumentStats {
    // Compter les emprunts par document
    const borrowCounts = new Map<number, number>();
    const lastBorrowed = new Map<number, string>();
    
    borrowHistory.forEach(bh => {
      borrowCounts.set(bh.documentId, (borrowCounts.get(bh.documentId) || 0) + 1);
      const currentDate = lastBorrowed.get(bh.documentId);
      if (!currentDate || new Date(bh.borrowDate) > new Date(currentDate)) {
        lastBorrowed.set(bh.documentId, bh.borrowDate);
      }
    });

    // Documents par type
    const totalByType = documents.reduce((acc, doc) => {
      const type = doc.type || 'Livre';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Documents par année
    const totalByYear = documents.reduce((acc, doc) => {
      const year = doc.annee || 'Non spécifié';
      acc[year] = (acc[year] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Documents par auteur
    const totalByAuthor = documents.reduce((acc, doc) => {
      acc[doc.auteur] = (acc[doc.auteur] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Documents avec leur popularité
    const documentsWithBorrowCount = documents.map(doc => ({
      document: doc,
      borrowCount: borrowCounts.get(doc.id!) || 0,
      lastBorrowed: lastBorrowed.get(doc.id!)
    }));

    // Trier par popularité
    const sortedByPopularity = [...documentsWithBorrowCount].sort((a, b) => b.borrowCount - a.borrowCount);
    
    // Documents les plus/moins empruntés
    const mostBorrowedDocuments = sortedByPopularity.slice(0, 10);
    const leastBorrowedDocuments = sortedByPopularity.slice(-10).reverse();
    const neverBorrowedDocuments = documents.filter(doc => (borrowCounts.get(doc.id!) || 0) === 0);

    // Catégoriser par popularité
    const maxBorrows = Math.max(...documentsWithBorrowCount.map(d => d.borrowCount));
    const documentsByPopularity = documentsWithBorrowCount.map(item => ({
      ...item,
      rating: this.getRatingFromBorrowCount(item.borrowCount, maxBorrows)
    }));

    // Âge moyen des documents
    const currentYear = new Date().getFullYear();
    const averageDocumentAge = documents.reduce((sum, doc) => {
      const year = parseInt(doc.annee) || currentYear;
      return sum + (currentYear - year);
    }, 0) / documents.length;

    return {
      totalByType,
      totalByYear,
      totalByAuthor,
      mostBorrowedDocuments,
      leastBorrowedDocuments,
      neverBorrowedDocuments,
      documentsByPopularity,
      averageDocumentAge: Math.round(averageDocumentAge),
      documentsByStatus: {
        available: documents.filter(d => !d.estEmprunte).length,
        borrowed: documents.filter(d => d.estEmprunte && !this.isOverdue(d)).length,
        overdue: documents.filter(d => d.estEmprunte && this.isOverdue(d)).length
      }
    };
  }

  private static generateBorrowerStats(
    borrowers: Borrower[],
    borrowHistory: BorrowHistory[]
  ): BorrowerStats {
    // Statistiques par emprunteur
    const borrowerStats = new Map<number, {
      borrowCount: number;
      activeLoans: number;
      overdueLoans: number;
      lastActivity?: string;
      totalDuration: number;
      returnedLoans: number;
    }>();

    borrowHistory.forEach(bh => {
      const stats = borrowerStats.get(bh.borrowerId) || {
        borrowCount: 0,
        activeLoans: 0,
        overdueLoans: 0,
        totalDuration: 0,
        returnedLoans: 0
      };

      stats.borrowCount++;
      
      if (bh.status === 'active') stats.activeLoans++;
      if (bh.status === 'overdue') stats.overdueLoans++;
      
      if (bh.actualReturnDate) {
        const duration = Math.ceil((new Date(bh.actualReturnDate).getTime() - new Date(bh.borrowDate).getTime()) / (1000 * 60 * 60 * 24));
        stats.totalDuration += duration;
        stats.returnedLoans++;
      }

      if (!stats.lastActivity || new Date(bh.borrowDate) > new Date(stats.lastActivity)) {
        stats.lastActivity = bh.borrowDate;
      }

      borrowerStats.set(bh.borrowerId, stats);
    });

    // Top emprunteurs
    const topBorrowers = borrowers
      .map(borrower => {
        const stats = borrowerStats.get(borrower.id!) || {
          borrowCount: 0, activeLoans: 0, overdueLoans: 0, totalDuration: 0, returnedLoans: 0
        };
        return {
          borrower,
          borrowCount: stats.borrowCount,
          activeLoans: stats.activeLoans,
          overdueLoans: stats.overdueLoans,
          averageLoanDuration: stats.returnedLoans > 0 ? Math.round(stats.totalDuration / stats.returnedLoans) : 0,
          lastActivity: stats.lastActivity
        };
      })
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 20);

    // Emprunteurs inactifs
    const now = new Date();
    const inactiveBorrowers = borrowers
      .filter(borrower => {
        const stats = borrowerStats.get(borrower.id!);
        return !stats || !stats.lastActivity || 
               (now.getTime() - new Date(stats.lastActivity).getTime()) > (90 * 24 * 60 * 60 * 1000); // 90 jours
      })
      .map(borrower => {
        const stats = borrowerStats.get(borrower.id!);
        const lastActivity = stats?.lastActivity ? new Date(stats.lastActivity) : null;
        const daysSinceLastActivity = lastActivity ? 
          Math.ceil((now.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24)) : 
          Infinity;
        
        return {
          borrower,
          daysSinceLastActivity,
          totalBorrows: stats?.borrowCount || 0
        };
      })
      .sort((a, b) => b.daysSinceLastActivity - a.daysSinceLastActivity);

    // Activité des emprunteurs
    const borrowerActivity = {
      veryActive: 0,
      active: 0,
      moderate: 0,
      low: 0,
      inactive: 0
    };

    borrowers.forEach(borrower => {
      const stats = borrowerStats.get(borrower.id!);
      const borrowCount = stats?.borrowCount || 0;
      
      if (borrowCount === 0) borrowerActivity.inactive++;
      else if (borrowCount === 1) borrowerActivity.low++;
      else if (borrowCount <= 4) borrowerActivity.moderate++;
      else if (borrowCount <= 10) borrowerActivity.active++;
      else borrowerActivity.veryActive++;
    });

    return {
      totalByType: {
        students: borrowers.filter(b => b.type === 'student').length,
        staff: borrowers.filter(b => b.type === 'staff').length
      },
      topBorrowers,
      inactiveBorrowers,
      borrowerActivity,
      averageBorrowsPerBorrower: borrowHistory.length / Math.max(borrowers.length, 1)
    };
  }

  private static generateBorrowHistoryStats(borrowHistory: BorrowHistory[]): BorrowHistoryStats {
    const totalBorrows = borrowHistory.length;
    const totalReturns = borrowHistory.filter(bh => bh.actualReturnDate).length;
    const activeLoans = borrowHistory.filter(bh => bh.status === 'active').length;
    const overdueLoans = borrowHistory.filter(bh => bh.status === 'overdue').length;
    
    // Taux de retour à temps
    const onTimeReturns = borrowHistory.filter(bh => {
      if (!bh.actualReturnDate) return false;
      return new Date(bh.actualReturnDate) <= new Date(bh.expectedReturnDate);
    }).length;
    const returnRate = totalReturns > 0 ? (onTimeReturns / totalReturns) * 100 : 0;

    // Emprunts par mois
    const borrowsByMonth = borrowHistory.reduce((acc, bh) => {
      const month = new Date(bh.borrowDate).toLocaleString('fr-FR', { year: 'numeric', month: 'long' });
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Retours par mois
    const returnsByMonth = borrowHistory
      .filter(bh => bh.actualReturnDate)
      .reduce((acc, bh) => {
        const month = new Date(bh.actualReturnDate!).toLocaleString('fr-FR', { year: 'numeric', month: 'long' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    // Périodes de pointe
    const peakBorrowingPeriods = Object.entries(borrowsByMonth)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([period, count]) => ({
        period,
        count,
        type: 'month' as const
      }));

    // Durée moyenne d'emprunt
    const returnedLoans = borrowHistory.filter(bh => bh.actualReturnDate);
    const totalDuration = returnedLoans.reduce((sum, bh) => {
      const duration = Math.ceil((new Date(bh.actualReturnDate!).getTime() - new Date(bh.borrowDate).getTime()) / (1000 * 60 * 60 * 24));
      return sum + duration;
    }, 0);
    const averageLoanDuration = returnedLoans.length > 0 ? Math.round(totalDuration / returnedLoans.length) : 0;

    // Emprunts les plus longs
    const longestLoans = borrowHistory
      .map(bh => {
        const endDate = bh.actualReturnDate ? new Date(bh.actualReturnDate) : new Date();
        const duration = Math.ceil((endDate.getTime() - new Date(bh.borrowDate).getTime()) / (1000 * 60 * 60 * 24));
        return {
          borrowHistory: bh,
          duration,
          status: bh.status
        };
      })
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 10);

    // Emprunteurs les plus fréquents
    const borrowerCounts = borrowHistory.reduce((acc, bh) => {
      if (bh.borrower) {
        const existing = acc.find(item => item.borrower.id === bh.borrower!.id);
        if (existing) {
          existing.borrowCount++;
        } else {
          acc.push({
            borrower: bh.borrower,
            borrowCount: 1
          });
        }
      }
      return acc;
    }, [] as Array<{ borrower: Borrower; borrowCount: number; }>);

    const mostFrequentBorrowers = borrowerCounts
      .sort((a, b) => b.borrowCount - a.borrowCount)
      .slice(0, 10);

    return {
      totalBorrows,
      totalReturns,
      activeLoans,
      overdueLoans,
      returnRate,
      borrowsByMonth,
      returnsByMonth,
      peakBorrowingPeriods,
      averageLoanDuration,
      longestLoans,
      mostFrequentBorrowers
    };
  }

  private static generateTrendStats(borrowHistory: BorrowHistory[]): TrendStats {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthBorrows = borrowHistory.filter(bh => new Date(bh.borrowDate) >= thisMonth).length;
    const lastMonthBorrows = borrowHistory.filter(bh => {
      const borrowDate = new Date(bh.borrowDate);
      return borrowDate >= lastMonth && borrowDate < thisMonth;
    }).length;

    const growth = lastMonthBorrows > 0 ? ((thisMonthBorrows - lastMonthBorrows) / lastMonthBorrows) * 100 : 0;
    
    let trend: 'up' | 'down' | 'stable' = 'stable';
    if (Math.abs(growth) > 5) {
      trend = growth > 0 ? 'up' : 'down';
    }

    // Catégories populaires (basé sur les descripteurs)
    const categoryBorrows = borrowHistory.reduce((acc, bh) => {
      if (bh.document?.descripteurs) {
        const categories = bh.document.descripteurs.split(',').map(c => c.trim());
        categories.forEach(category => {
          acc[category] = (acc[category] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);

    const popularCategories = Object.entries(categoryBorrows)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([category, borrowCount]) => ({
        category,
        borrowCount,
        growthRate: 0 // Simplified for now
      }));

    // Tendances saisonnières (simplifié)
    const seasonalTrends = {
      borrowing: {
        spring: borrowHistory.filter(bh => this.getSeason(new Date(bh.borrowDate)) === 'spring').length,
        summer: borrowHistory.filter(bh => this.getSeason(new Date(bh.borrowDate)) === 'summer').length,
        fall: borrowHistory.filter(bh => this.getSeason(new Date(bh.borrowDate)) === 'fall').length,
        winter: borrowHistory.filter(bh => this.getSeason(new Date(bh.borrowDate)) === 'winter').length
      }
    };

    // Modèles quotidiens (jour de la semaine)
    const dailyPatterns = borrowHistory.reduce((acc, bh) => {
      const dayOfWeek = new Date(bh.borrowDate).toLocaleDateString('fr-FR', { weekday: 'long' });
      acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      borrowingTrends: {
        thisMonth: thisMonthBorrows,
        lastMonth: lastMonthBorrows,
        growth,
        trend
      },
      popularCategories,
      seasonalTrends,
      dailyPatterns
    };
  }

  private static generateInsightStats(
    documents: Document[],
    borrowers: Borrower[],
    borrowHistory: BorrowHistory[]
  ): InsightStats {
    const recommendations: InsightStats['recommendations'] = [];
    const alerts: InsightStats['alerts'] = [];

    // Documents jamais empruntés
    const neverBorrowedCount = documents.filter(doc => 
      !borrowHistory.some(bh => bh.documentId === doc.id)
    ).length;

    if (neverBorrowedCount > documents.length * 0.3) {
      recommendations.push({
        type: 'marketing',
        title: 'Promouvoir les documents non empruntés',
        description: `${neverBorrowedCount} documents (${Math.round(neverBorrowedCount/documents.length*100)}%) n'ont jamais été empruntés. Considérez une campagne de promotion.`,
        priority: 'medium',
        impact: 'Amélioration de l\'utilisation de la collection'
      });
    }

    // Documents en retard
    const overdueCount = borrowHistory.filter(bh => bh.status === 'overdue').length;
    if (overdueCount > 0) {
      alerts.push({
        type: 'overdue',
        title: 'Documents en retard',
        description: 'Des documents sont en retard et nécessitent un suivi',
        count: overdueCount,
        severity: overdueCount > 10 ? 'critical' : 'warning'
      });
    }

    // Emprunteurs inactifs
    const inactiveCount = borrowers.filter(borrower => {
      const hasRecentActivity = borrowHistory.some(bh => 
        bh.borrowerId === borrower.id && 
        new Date(bh.borrowDate) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)
      );
      return !hasRecentActivity;
    }).length;

    if (inactiveCount > borrowers.length * 0.5) {
      recommendations.push({
        type: 'marketing',
        title: 'Réengager les emprunteurs inactifs',
        description: `${inactiveCount} emprunteurs n'ont pas d'activité récente. Lancez une campagne de réengagement.`,
        priority: 'medium',
        impact: 'Augmentation de l\'engagement des utilisateurs'
      });
    }

    // Performance générale
    const collectionUtilization = documents.length > 0 ? 
      (borrowHistory.length / documents.length) * 100 : 0;
    
    const borrowerEngagement = borrowers.length > 0 ? 
      (borrowHistory.length / borrowers.length) * 100 : 0;
    
    const onTimeReturns = borrowHistory.filter(bh => 
      bh.actualReturnDate && new Date(bh.actualReturnDate) <= new Date(bh.expectedReturnDate)
    ).length;
    const returnCompliance = borrowHistory.length > 0 ? 
      (onTimeReturns / borrowHistory.filter(bh => bh.actualReturnDate).length) * 100 : 100;
    
    const overallHealth = (collectionUtilization + borrowerEngagement + returnCompliance) / 3;

    return {
      recommendations,
      alerts,
      performance: {
        collectionUtilization: Math.round(collectionUtilization),
        borrowerEngagement: Math.round(borrowerEngagement),
        returnCompliance: Math.round(returnCompliance),
        overallHealth: Math.round(overallHealth)
      }
    };
  }

  // Méthodes utilitaires
  private static getRatingFromBorrowCount(borrowCount: number, maxBorrows: number): 'high' | 'medium' | 'low' | 'none' {
    if (borrowCount === 0) return 'none';
    if (borrowCount >= maxBorrows * 0.7) return 'high';
    if (borrowCount >= maxBorrows * 0.3) return 'medium';
    return 'low';
  }

  private static isOverdue(document: Document): boolean {
    if (!document.dateRetourPrevu || !document.estEmprunte) return false;
    return new Date() > new Date(document.dateRetourPrevu);
  }

  private static getSeason(date: Date): 'spring' | 'summer' | 'fall' | 'winter' {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'fall';
    return 'winter';
  }

  // Export des statistiques
  static exportToCSV(statistics: DetailedStatistics): string {
    const sections = [
      '# VUE D\'ENSEMBLE',
      `Total Documents,${statistics.overview.totalDocuments}`,
      `Total Emprunteurs,${statistics.overview.totalBorrowers}`,
      `Total Emprunts,${statistics.overview.totalBorrows}`,
      `Emprunts Actifs,${statistics.overview.activeLoans}`,
      `Emprunts en Retard,${statistics.overview.overdueLoans}`,
      `Taux d'Utilisation,%${statistics.overview.utilizationRate.toFixed(2)}`,
      '',
      '# DOCUMENTS POPULAIRES',
      'Titre,Auteur,Nombre d\'Emprunts',
      ...statistics.documents.mostBorrowedDocuments.slice(0, 10).map(item => 
        `"${item.document.titre}","${item.document.auteur}",${item.borrowCount}`
      ),
      '',
      '# TOP EMPRUNTEURS',
      'Nom,Type,Nombre d\'Emprunts,Emprunts Actifs',
      ...statistics.borrowers.topBorrowers.slice(0, 10).map(item => 
        `"${item.borrower.firstName} ${item.borrower.lastName}","${item.borrower.type}",${item.borrowCount},${item.activeLoans}`
      )
    ];

    return sections.join('\n');
  }

  static exportToPDF(statistics: DetailedStatistics): string {
    // Génère du HTML pour conversion PDF
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Statistiques Détaillées de la Bibliothèque</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3E5C49; padding-bottom: 20px; }
            .section { margin-bottom: 30px; }
            .section h2 { color: #3E5C49; border-bottom: 1px solid #eee; padding-bottom: 10px; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
            .stat-card { background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; }
            .stat-value { font-size: 24px; font-weight: bold; color: #C2571B; }
            .stat-label { font-size: 14px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #3E5C49; color: white; }
            .insight { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 10px 0; }
            .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Statistiques Détaillées de la Bibliothèque</h1>
            <p>Généré le ${new Date().toLocaleString('fr-FR')}</p>
          </div>
          
          <div class="section">
            <h2>Vue d'Ensemble</h2>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">${statistics.overview.totalDocuments}</div>
                <div class="stat-label">Documents</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${statistics.overview.totalBorrowers}</div>
                <div class="stat-label">Emprunteurs</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${statistics.overview.totalBorrows}</div>
                <div class="stat-label">Total Emprunts</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${statistics.overview.utilizationRate.toFixed(1)}%</div>
                <div class="stat-label">Taux d'Utilisation</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Documents les Plus Populaires</h2>
            <table>
              <thead>
                <tr><th>Titre</th><th>Auteur</th><th>Emprunts</th></tr>
              </thead>
              <tbody>
                ${statistics.documents.mostBorrowedDocuments.slice(0, 10).map(item => `
                  <tr>
                    <td>${item.document.titre}</td>
                    <td>${item.document.auteur}</td>
                    <td>${item.borrowCount}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Recommandations</h2>
            ${statistics.insights.recommendations.map(rec => `
              <div class="insight">
                <strong>${rec.title}</strong><br>
                ${rec.description}
              </div>
            `).join('')}
          </div>

          <div class="section">
            <h2>Alertes</h2>
            ${statistics.insights.alerts.map(alert => `
              <div class="alert">
                <strong>${alert.title}</strong> (${alert.count})<br>
                ${alert.description}
              </div>
            `).join('')}
          </div>
        </body>
      </html>
    `;
  }
}