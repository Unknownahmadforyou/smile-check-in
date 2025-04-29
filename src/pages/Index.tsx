
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Check, User, Calendar } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center py-12 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gradient-text">SmileCheck Attendance System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Modern facial recognition attendance tracking for schools, businesses, and organizations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-attendance-light flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-attendance-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Register Your Face</h3>
            <p className="text-gray-500 mb-4">Create your profile by registering your face data securely.</p>
            <Link to="/register" className="mt-auto">
              <Button variant="outline" className="w-full">Register</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-attendance-light flex items-center justify-center mb-4">
              <Check className="h-6 w-6 text-attendance-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Mark Attendance</h3>
            <p className="text-gray-500 mb-4">Quickly mark your attendance with a simple face scan.</p>
            <Link to="/scan" className="mt-auto">
              <Button className="w-full bg-attendance-primary hover:bg-attendance-dark">Scan Now</Button>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-attendance-light flex items-center justify-center mb-4">
              <Calendar className="h-6 w-6 text-attendance-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">View Dashboard</h3>
            <p className="text-gray-500 mb-4">Access your attendance history and analytics.</p>
            <Link to="/dashboard" className="mt-auto">
              <Button variant="outline" className="w-full">Dashboard</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-attendance-light p-8 rounded-xl w-full">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
              <h2 className="text-2xl font-bold mb-4 text-attendance-dark">How It Works</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-attendance-primary text-white flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">1</span>
                  <span>Register yourself by capturing your face data securely</span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-attendance-primary text-white flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">2</span>
                  <span>Use the scan feature to mark your attendance when needed</span>
                </li>
                <li className="flex items-start">
                  <span className="h-6 w-6 rounded-full bg-attendance-primary text-white flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">3</span>
                  <span>View your attendance history and reports from the dashboard</span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/3">
              <Link to="/register">
                <Button className="w-full bg-attendance-primary hover:bg-attendance-dark">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
