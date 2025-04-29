
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import WebcamCapture from '@/components/WebcamCapture';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { dataService, User } from '@/services/mockDataService';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, User as UserIcon } from 'lucide-react';

const Scan = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isScanning, setIsScanning] = useState(false);
  const [recognizedUser, setRecognizedUser] = useState<User | null>(null);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  
  const handleCapture = (imageSrc: string) => {
    if (!isScanning) return;
    
    // For demo purposes, just use the image as the face data
    // In a real app, you'd extract features using ML
    const user = dataService.findUserByFace(imageSrc);
    
    if (user) {
      setIsScanning(false);
      setRecognizedUser(user);
      
      toast({
        title: "Face Recognized",
        description: `Welcome, ${user.name}!`,
      });
      
      // Mark attendance automatically
      const record = dataService.markAttendance(user.id);
      
      if (record) {
        setAttendanceMarked(true);
        
        toast({
          title: "Attendance Marked",
          description: "Your attendance has been successfully recorded.",
          variant: "default",
        });
      }
    }
  };
  
  const handleStartScan = () => {
    setIsScanning(true);
    setRecognizedUser(null);
    setAttendanceMarked(false);
  };
  
  const handleReset = () => {
    setIsScanning(false);
    setRecognizedUser(null);
    setAttendanceMarked(false);
  };
  
  // For demo, simulate a successful recognition after a few seconds
  useEffect(() => {
    let timeout: number;
    
    if (isScanning) {
      // For demo purposes only - simulate a face match after 5 seconds
      timeout = window.setTimeout(() => {
        const users = dataService.getAllUsers();
        if (users.length > 0) {
          const randomUser = users[0]; // Just use the first user
          setIsScanning(false);
          setRecognizedUser(randomUser);
          
          toast({
            title: "Face Recognized",
            description: `Welcome, ${randomUser.name}!`,
          });
          
          // Mark attendance automatically
          const record = dataService.markAttendance(randomUser.id);
          
          if (record) {
            setAttendanceMarked(true);
            
            toast({
              title: "Attendance Marked",
              description: "Your attendance has been successfully recorded.",
              variant: "default",
            });
          }
        } else {
          // No users found
          toast({
            title: "No Users Found",
            description: "Please register at least one user before scanning.",
            variant: "destructive",
          });
          setIsScanning(false);
        }
      }, 5000);
    }
    
    return () => {
      clearTimeout(timeout);
    };
  }, [isScanning, toast]);
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Mark Attendance</h1>
        
        <Card className="shadow-md mb-8">
          <CardHeader>
            <CardTitle>Face Recognition</CardTitle>
            <CardDescription>
              {isScanning 
                ? "Looking for your face... Please stay still" 
                : "Start scanning to mark your attendance"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recognizedUser ? (
              <div className="flex flex-col items-center py-6 animate-fade-in">
                <div className="w-24 h-24 rounded-full bg-attendance-light flex items-center justify-center mb-4">
                  {attendanceMarked ? (
                    <CheckCircle className="h-12 w-12 text-attendance-primary" />
                  ) : (
                    <Clock className="h-12 w-12 text-attendance-primary" />
                  )}
                </div>
                
                <h3 className="text-xl font-bold mb-1">{recognizedUser.name}</h3>
                <p className="text-gray-500">{recognizedUser.department}</p>
                
                <div className="mt-6 bg-attendance-light rounded-lg p-4 w-full max-w-sm">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-medium">{attendanceMarked ? "Present" : "Pending"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Time</p>
                      <p className="font-medium">{new Date().toLocaleTimeString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 space-x-3">
                  <Button 
                    onClick={() => navigate('/dashboard')} 
                    className="bg-attendance-primary hover:bg-attendance-dark"
                  >
                    View Dashboard
                  </Button>
                  <Button variant="outline" onClick={handleReset}>
                    Scan Another
                  </Button>
                </div>
              </div>
            ) : (
              <WebcamCapture 
                onCapture={handleCapture} 
                isScanning={isScanning}
              />
            )}
            
            {!isScanning && !recognizedUser && (
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleStartScan}
                  className="bg-attendance-primary hover:bg-attendance-dark"
                >
                  Start Scanning
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-lg font-semibold mb-4">How it works</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-attendance-light flex items-center justify-center mr-3 flex-shrink-0">
                <UserIcon className="h-4 w-4 text-attendance-primary" />
              </div>
              <div>
                <p className="font-medium">Face Detection</p>
                <p className="text-sm text-gray-500">Your face is detected and analyzed</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-attendance-light flex items-center justify-center mr-3 flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-attendance-primary" />
              </div>
              <div>
                <p className="font-medium">Verification</p>
                <p className="text-sm text-gray-500">Your identity is verified against registered faces</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="h-8 w-8 rounded-full bg-attendance-light flex items-center justify-center mr-3 flex-shrink-0">
                <Clock className="h-4 w-4 text-attendance-primary" />
              </div>
              <div>
                <p className="font-medium">Attendance Recording</p>
                <p className="text-sm text-gray-500">Your attendance is automatically recorded with timestamp</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Scan;
