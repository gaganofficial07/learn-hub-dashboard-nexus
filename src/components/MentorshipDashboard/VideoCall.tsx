
import React, { useState, useEffect } from 'react';
import { Button, Space, Typography } from 'antd';
import { Video, VideoOff, Mic, MicOff, PhoneCall } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

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

  const handleStartCall = () => {
    setCallStarted(true);
  };

  if (!callStarted) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center space-y-6">
            <Title level={3}>Ready to Start Call</Title>
            <div className="space-y-2">
              <Text>Session ID: {sessionId}</Text>
              <Text block><strong>Student:</strong> {studentName}</Text>
              <Text block><strong>Topic:</strong> {topic}</Text>
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
        
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-white">Video Stream with {studentName}</div>
        </div>
        
        <div className="flex justify-center gap-4 mt-4">
          <Button
            type={videoEnabled ? 'primary' : 'default'}
            onClick={() => setVideoEnabled(!videoEnabled)}
            icon={videoEnabled ? <Video /> : <VideoOff />}
          >
            {videoEnabled ? 'Video On' : 'Video Off'}
          </Button>
          
          <Button
            type={audioEnabled ? 'primary' : 'default'}
            onClick={() => setAudioEnabled(!audioEnabled)}
            icon={audioEnabled ? <Mic /> : <MicOff />}
          >
            {audioEnabled ? 'Mic On' : 'Mic Off'}
          </Button>
          
          <Button danger onClick={onEndCall}>
            End Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCall;
