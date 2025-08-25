// LocalStorage utility functions for data persistence
// Future migration to Supabase will be easier with this abstraction

export interface UserProfile {
  id: string;
  name?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MotivationPoint {
  id: string;
  year: number;
  level: number; // 1-5 scale
  type: 'positive' | 'negative';
  description: string;
  createdAt: string;
}

export interface SkillScore {
  questionId: string;
  score: number; // 0-10 scale
  updatedAt: string;
}

export interface BusinessPlanData {
  revenueData: {
    year1: number;
    year2: number;
    year3: number;
    unitPrice: number;
    customers: number[];
  };
  costData: {
    development: number[];
    marketing: number[];
    operations: number[];
    personnel: number[];
  };
  updatedAt: string;
}

export interface UserData {
  profile: UserProfile;
  motivationPoints: MotivationPoint[];
  skillScores: SkillScore[];
  businessPlan?: BusinessPlanData;
  whyMeText?: string;
}

class StorageService {
  private readonly STORAGE_KEY = 'origin_quest_data';
  private readonly VERSION = '1.0';

  // Get current user data
  getUserData(): UserData | null {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (!data) return null;
      
      const parsed = JSON.parse(data);
      if (parsed.version !== this.VERSION) {
        // Handle version migration if needed
        return this.migrateData(parsed);
      }
      
      return parsed.data;
    } catch (error) {
      console.error('Error loading user data:', error);
      return null;
    }
  }

  // Save user data
  saveUserData(userData: UserData): boolean {
    try {
      const dataToSave = {
        version: this.VERSION,
        data: userData,
        savedAt: new Date().toISOString()
      };
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  }

  // Initialize new user
  initializeUser(): UserData {
    const newUser: UserData = {
      profile: {
        id: this.generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      motivationPoints: [],
      skillScores: []
    };
    
    this.saveUserData(newUser);
    return newUser;
  }

  // Motivation Points
  saveMotivationPoint(point: Omit<MotivationPoint, 'id' | 'createdAt'>): boolean {
    const userData = this.getUserData() || this.initializeUser();
    
    const newPoint: MotivationPoint = {
      ...point,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    };
    
    userData.motivationPoints.push(newPoint);
    userData.profile.updatedAt = new Date().toISOString();
    
    return this.saveUserData(userData);
  }

  getMotivationPoints(): MotivationPoint[] {
    const userData = this.getUserData();
    return userData?.motivationPoints || [];
  }

  deleteMotivationPoint(pointId: string): boolean {
    const userData = this.getUserData();
    if (!userData) return false;
    
    userData.motivationPoints = userData.motivationPoints.filter(p => p.id !== pointId);
    userData.profile.updatedAt = new Date().toISOString();
    
    return this.saveUserData(userData);
  }

  // Skill Scores
  saveSkillScore(questionId: string, score: number): boolean {
    const userData = this.getUserData() || this.initializeUser();
    
    // Remove existing score for this question
    userData.skillScores = userData.skillScores.filter(s => s.questionId !== questionId);
    
    // Add new score
    userData.skillScores.push({
      questionId,
      score,
      updatedAt: new Date().toISOString()
    });
    
    userData.profile.updatedAt = new Date().toISOString();
    
    return this.saveUserData(userData);
  }

  getSkillScores(): Record<string, number> {
    const userData = this.getUserData();
    if (!userData) return {};
    
    const scores: Record<string, number> = {};
    userData.skillScores.forEach(score => {
      scores[score.questionId] = score.score;
    });
    
    return scores;
  }

  // Business Plan
  saveBusinessPlan(businessPlan: Omit<BusinessPlanData, 'updatedAt'>): boolean {
    const userData = this.getUserData() || this.initializeUser();
    
    userData.businessPlan = {
      ...businessPlan,
      updatedAt: new Date().toISOString()
    };
    
    userData.profile.updatedAt = new Date().toISOString();
    
    return this.saveUserData(userData);
  }

  getBusinessPlan(): BusinessPlanData | null {
    const userData = this.getUserData();
    return userData?.businessPlan || null;
  }

  // Utility methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private migrateData(oldData: any): UserData | null {
    // Handle data migration between versions
    console.log('Migrating data from version:', oldData.version);
    return null;
  }

  // Clear all data
  clearAllData(): boolean {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  // Export data for backup
  exportData(): string {
    const userData = this.getUserData();
    return JSON.stringify(userData, null, 2);
  }

  // Import data from backup
  importData(jsonData: string): boolean {
    try {
      const userData = JSON.parse(jsonData);
      return this.saveUserData(userData);
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }
}

export const storageService = new StorageService();