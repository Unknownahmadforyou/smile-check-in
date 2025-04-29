
// User types
export interface User {
  id: string;
  name: string;
  email: string;
  department: string;
  faceData: string; // Base64 string representing face data (in a real app, this would be feature vectors)
  createdAt: Date;
}

// Attendance record type
export interface AttendanceRecord {
  id: string;
  userId: string;
  timestamp: Date;
  status: 'present' | 'absent' | 'late';
}

// Mock database
class MockDataService {
  private users: User[] = [];
  private attendanceRecords: AttendanceRecord[] = [];
  
  constructor() {
    // Load data from localStorage if available
    this.loadData();
  }
  
  // User methods
  getAllUsers(): User[] {
    return [...this.users];
  }
  
  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
  
  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    this.saveData();
    return newUser;
  }
  
  updateUser(id: string, userData: Partial<User>): User | null {
    const index = this.users.findIndex(user => user.id === id);
    if (index === -1) return null;
    
    this.users[index] = { ...this.users[index], ...userData };
    this.saveData();
    return this.users[index];
  }
  
  deleteUser(id: string): boolean {
    const initialLength = this.users.length;
    this.users = this.users.filter(user => user.id !== id);
    
    if (this.users.length !== initialLength) {
      // Also delete attendance records for this user
      this.attendanceRecords = this.attendanceRecords.filter(record => record.userId !== id);
      this.saveData();
      return true;
    }
    
    return false;
  }
  
  // Attendance methods
  getAllAttendanceRecords(): AttendanceRecord[] {
    return [...this.attendanceRecords];
  }
  
  getAttendanceByUserId(userId: string): AttendanceRecord[] {
    return this.attendanceRecords.filter(record => record.userId === userId);
  }
  
  getAttendanceByDate(date: Date): AttendanceRecord[] {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    
    return this.attendanceRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= startOfDay && recordDate <= endOfDay;
    });
  }
  
  markAttendance(userId: string, status: 'present' | 'absent' | 'late' = 'present'): AttendanceRecord | null {
    // Verify user exists
    const user = this.getUserById(userId);
    if (!user) return null;
    
    // Check if attendance already marked today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const alreadyMarkedToday = this.attendanceRecords.some(record => {
      const recordDate = new Date(record.timestamp);
      recordDate.setHours(0, 0, 0, 0);
      return record.userId === userId && recordDate.getTime() === today.getTime();
    });
    
    if (alreadyMarkedToday) {
      // Update existing record
      const recordIndex = this.attendanceRecords.findIndex(record => {
        const recordDate = new Date(record.timestamp);
        recordDate.setHours(0, 0, 0, 0);
        return record.userId === userId && recordDate.getTime() === today.getTime();
      });
      
      this.attendanceRecords[recordIndex].status = status;
      this.attendanceRecords[recordIndex].timestamp = new Date();
      this.saveData();
      
      return this.attendanceRecords[recordIndex];
    }
    
    // Create new record
    const newRecord: AttendanceRecord = {
      id: crypto.randomUUID(),
      userId,
      timestamp: new Date(),
      status
    };
    
    this.attendanceRecords.push(newRecord);
    this.saveData();
    return newRecord;
  }
  
  // Storage methods
  private saveData(): void {
    localStorage.setItem('smilecheck_users', JSON.stringify(this.users));
    localStorage.setItem('smilecheck_attendance', JSON.stringify(this.attendanceRecords));
  }
  
  private loadData(): void {
    try {
      const usersData = localStorage.getItem('smilecheck_users');
      const attendanceData = localStorage.getItem('smilecheck_attendance');
      
      if (usersData) {
        this.users = JSON.parse(usersData).map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt)
        }));
      }
      
      if (attendanceData) {
        this.attendanceRecords = JSON.parse(attendanceData).map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        }));
      }
    } catch (error) {
      console.error("Error loading data from localStorage", error);
      this.users = [];
      this.attendanceRecords = [];
    }
  }
  
  // For face recognition (in a real app this would use ML)
  findUserByFace(faceData: string): User | null {
    // Simple mock: just find a user where the face data is an exact match
    // In a real app, you would use similarity metrics
    const user = this.users.find(u => u.faceData === faceData);
    return user || null;
  }
}

export const dataService = new MockDataService();
