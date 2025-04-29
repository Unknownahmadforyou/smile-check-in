
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import WebcamCapture from '@/components/WebcamCapture';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { dataService } from '@/services/mockDataService';

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: '',
  });
  
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({ ...prev, department: value }));
  };
  
  const handleCapture = (imageSrc: string) => {
    setFaceImage(imageSrc);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!faceImage) {
      toast({
        title: "Missing Face Image",
        description: "Please capture your face image before registering.",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.name || !formData.email || !formData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for existing user with same email
    const users = dataService.getAllUsers();
    const existingUser = users.find(user => user.email === formData.email);
    
    if (existingUser) {
      toast({
        title: "Email Already Registered",
        description: "This email address is already registered in the system.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Register the user
      const newUser = dataService.addUser({
        name: formData.name,
        email: formData.email,
        department: formData.department,
        faceData: faceImage,
      });
      
      toast({
        title: "Registration Successful",
        description: "Your face data has been registered successfully.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error while registering. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 gradient-text">Register Your Face</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Face Capture</CardTitle>
              <CardDescription>
                Position your face clearly and take a photo
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {faceImage ? (
                <div className="webcam-container w-full max-w-md aspect-video">
                  <img 
                    src={faceImage} 
                    alt="Captured face" 
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              ) : (
                <WebcamCapture onCapture={handleCapture} />
              )}
            </CardContent>
            <CardFooter>
              {faceImage && (
                <Button 
                  variant="outline" 
                  onClick={() => setFaceImage(null)} 
                  className="w-full"
                >
                  Retake Photo
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Enter your details to complete registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={handleDepartmentChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="sales">Sales</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-attendance-primary hover:bg-attendance-dark" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Registering..." : "Complete Registration"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
