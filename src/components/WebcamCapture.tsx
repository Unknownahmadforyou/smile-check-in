
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WebcamCaptureProps {
  onCapture: (imageSrc: string) => void;
  isScanning?: boolean;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, isScanning = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  // Start webcam
  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access webcam. Please check permissions and try again.');
    }
  };
  
  // Stop webcam
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCameraActive(false);
    }
  };
  
  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && isCameraActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageSrc = canvas.toDataURL('image/png');
      onCapture(imageSrc);
    }
  };
  
  // Auto-scan effect for attendance marking
  useEffect(() => {
    let interval: number | null = null;
    
    if (isScanning && isCameraActive) {
      interval = window.setInterval(() => {
        capturePhoto();
      }, 2000); // Scan every 2 seconds
    }
    
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isScanning, isCameraActive]);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);
  
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className={cn(
        "webcam-container w-full max-w-md aspect-video bg-gray-100",
        isCameraActive ? "" : "flex items-center justify-center"
      )}>
        {!isCameraActive && !error && (
          <div className="text-center p-6">
            <User className="w-16 h-16 mx-auto text-gray-400 mb-3" />
            <p className="text-gray-500">Camera inactive</p>
            <Button onClick={startCamera} variant="outline" className="mt-4">
              Start Camera
            </Button>
          </div>
        )}
        
        {error && (
          <div className="text-center p-6">
            <p className="text-red-500">{error}</p>
            <Button onClick={startCamera} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        )}
        
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={isCameraActive ? "w-full h-full object-cover" : "hidden"}
        />
        
        {isScanning && isCameraActive && (
          <div className="scanning-overlay">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-2 border-attendance-primary flex items-center justify-center">
                <div className="face-scan-ring w-48 h-48"></div>
                <div className="face-scan-ring w-52 h-52" style={{ animationDelay: "0.5s" }}></div>
                <div className="face-scan-ring w-56 h-56" style={{ animationDelay: "1s" }}></div>
                <div className="text-white text-sm font-medium">Scanning...</div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
      
      <div className="flex space-x-2 w-full max-w-md">
        {isCameraActive && !isScanning && (
          <Button onClick={capturePhoto} className="flex-1 bg-attendance-primary hover:bg-attendance-dark">
            Capture Photo
          </Button>
        )}
        
        <Button 
          onClick={isCameraActive ? stopCamera : startCamera} 
          variant={isCameraActive ? "outline" : "default"}
          className={cn(
            "flex-1",
            isCameraActive ? "" : "bg-attendance-primary hover:bg-attendance-dark"
          )}
        >
          {isCameraActive ? "Stop Camera" : "Start Camera"}
        </Button>
      </div>
    </div>
  );
};

export default WebcamCapture;
