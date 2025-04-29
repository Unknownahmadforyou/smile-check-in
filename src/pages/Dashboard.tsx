
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { dataService, User, AttendanceRecord } from '@/services/mockDataService';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User as UserIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  
  useEffect(() => {
    const allUsers = dataService.getAllUsers();
    setUsers(allUsers);
    
    if (allUsers.length > 0 && !selectedUser) {
      setSelectedUser(allUsers[0].id);
    }
  }, []);
  
  useEffect(() => {
    if (selectedUser) {
      const records = dataService.getAttendanceByUserId(selectedUser);
      setAttendanceRecords(records);
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedUser]);
  
  const handleUserChange = (userId: string) => {
    setSelectedUser(userId);
  };
  
  const getAttendanceSummary = () => {
    if (!attendanceRecords.length) return { present: 0, absent: 0, late: 0 };
    
    return attendanceRecords.reduce((acc, record) => {
      acc[record.status] += 1;
      return acc;
    }, { present: 0, absent: 0, late: 0 });
  };
  
  const summary = getAttendanceSummary();
  const totalDays = attendanceRecords.length;
  const attendanceRate = totalDays > 0 ? ((summary.present / totalDays) * 100).toFixed(1) : '0';
  
  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.name : 'Unknown User';
  };
  
  const filterByDate = (records: AttendanceRecord[], days: number) => {
    if (days === 0) return records; // All records
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return records.filter(record => new Date(record.timestamp) >= cutoffDate);
  };
  
  const filteredRecords = filterByDate(
    attendanceRecords, 
    activeTab === 'all' ? 0 : parseInt(activeTab, 10)
  );
  
  return (
    <Layout>
      <div className="max-w-5xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Attendance Dashboard</h1>
        
        <div className="mb-8">
          <Card className="shadow-md">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle>User Selection</CardTitle>
                  <CardDescription>
                    Select a user to view their attendance records
                  </CardDescription>
                </div>
                <div className="w-full md:w-64 mt-4 md:mt-0">
                  <Select value={selectedUser || ''} onValueChange={handleUserChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
        
        {selectedUser && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="shadow-md bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Present Days
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{summary.present}</div>
                      <p className="text-xs text-gray-500">out of {totalDays} total days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Attendance Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-attendance-light flex items-center justify-center mr-3">
                      <UserIcon className="h-5 w-5 text-attendance-primary" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{attendanceRate}%</div>
                      <p className="text-xs text-gray-500">overall attendance rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-md bg-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    Last Attendance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      {attendanceRecords.length > 0 ? (
                        <>
                          <div className="text-lg font-medium">
                            {format(new Date(attendanceRecords[0].timestamp), 'MMM d, yyyy')}
                          </div>
                          <p className="text-xs text-gray-500">
                            {format(new Date(attendanceRecords[0].timestamp), 'h:mm a')}
                          </p>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500">No records yet</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>
                  View detailed attendance records
                </CardDescription>
                <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList>
                    <TabsTrigger value="all">All Time</TabsTrigger>
                    <TabsTrigger value="30">Last 30 Days</TabsTrigger>
                    <TabsTrigger value="7">Last 7 Days</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                {filteredRecords.length > 0 ? (
                  <div className="border rounded-md">
                    <div className="grid grid-cols-3 bg-muted py-2 px-4 font-medium text-sm">
                      <div>Date</div>
                      <div>Time</div>
                      <div>Status</div>
                    </div>
                    <div className="divide-y">
                      {filteredRecords.map(record => (
                        <div key={record.id} className="grid grid-cols-3 px-4 py-3 text-sm">
                          <div>{format(new Date(record.timestamp), 'MMM d, yyyy')}</div>
                          <div>{format(new Date(record.timestamp), 'h:mm a')}</div>
                          <div>
                            <span 
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                                record.status === 'present' ? 'bg-green-100 text-green-800' : 
                                record.status === 'absent' ? 'bg-red-100 text-red-800' : 
                                'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No attendance records found for the selected period
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
        
        {users.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No Users Registered</h3>
            <p className="text-gray-500 mb-4">
              Register at least one user to view attendance records
            </p>
            <a href="/register" className="text-attendance-primary hover:text-attendance-dark underline">
              Register a New User
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
};

// Helper component for the icons
const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

export default Dashboard;
