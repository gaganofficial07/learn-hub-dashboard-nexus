
import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Space } from 'antd';
import { Video, VideoOff, Mic, MicOff, PhoneCall } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const { Title, Text } = Typography;

const VideoCall: React.FC<{
  sessionId: string;
  studentName: string;
  topic: string;
  onEndCall: () => void;
}> = ({ sessionId, studentName, topic, onEndCall }) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callStarted, setCallStarted] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startUserMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      toast.success("Camera and microphone connected successfully");
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error("Failed to access camera or microphone");
    }
  };

  const handleStartCall = async () => {
    await startUserMedia();
    setCallStarted(true);
  };

  const toggleVideo = async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoEnabled;
        setVideoEnabled(!videoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioEnabled;
        setAudioEnabled(!audioEnabled);
      }
    }
  };

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleEndCall = () => {
    stopStream();
    onEndCall();
  };

  useEffect(() => {
    return () => {
      stopStream();
    };
  }, []);

  if (!callStarted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            <Title level={3}>Ready to Start Call</Title>
            <div className="space-y-2">
              <Text>Session ID: {sessionId}</Text>
              <div><strong>Student:</strong> {studentName}</div>
              <div><strong>Topic:</strong> {topic}</div>
            </div>
            <Button 
              type="primary" 
              size="large"
              icon={<PhoneCall className="mr-2" />}
              onClick={handleStartCall}
              className="mt-4"
            >
              Start Video Call
            </Button>
            <Button onClick={onEndCall}>Cancel</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardContent className="p-6 space-y-4">
        <Title level={4} className="mb-4">Call with {studentName}</Title>
        
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button
            type={videoEnabled ? 'primary' : 'default'}
            onClick={toggleVideo}
            icon={videoEnabled ? <Video /> : <VideoOff />}
          >
            {videoEnabled ? 'Video On' : 'Video Off'}
          </Button>
          
          <Button
            type={audioEnabled ? 'primary' : 'default'}
            onClick={toggleAudio}
            icon={audioEnabled ? <Mic /> : <MicOff />}
          >
            {audioEnabled ? 'Mic On' : 'Mic Off'}
          </Button>
          
          <Button danger onClick={handleEndCall}>
            End Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCall;
