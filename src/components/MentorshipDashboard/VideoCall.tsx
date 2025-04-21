
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { Video, VideoOff, Mic, MicOff } from 'lucide-react';
import { Card } from "@/components/ui/card";

const VideoCall: React.FC<{
  sessionId: string;
  onEndCall: () => void;
}> = ({ sessionId, onEndCall }) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <div className="p-4 space-y-4">
        <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center">
          <div className="text-white">Video Stream Placeholder</div>
        </div>
        
        <div className="flex justify-center gap-4">
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
      </div>
    </Card>
  );
};

export default VideoCall;
