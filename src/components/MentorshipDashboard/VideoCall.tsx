
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
      // Request user media permissions explicitly
      const constraints = {
        video: videoEnabled,
        audio: audioEnabled,
      };
      
      console.log("Requesting user media with constraints:", constraints);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Media stream obtained:", mediaStream);
      
      setStream(mediaStream);
      
      // Ensure video element exists and set its source
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, playing video");
          videoRef.current?.play().catch(e => {
            console.error("Error playing video:", e);
          });
        };
      }
      
      toast.success("Camera and microphone connected successfully");
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error(`Failed to access camera or microphone: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleStartCall = async () => {
    console.log("Starting call and requesting permissions");
    await startUserMedia();
    setCallStarted(true);
  };

  const toggleVideo = async () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      console.log("Video tracks:", videoTracks);
      
      if (videoTracks.length > 0) {
        const newState = !videoEnabled;
        videoTracks[0].enabled = newState;
        setVideoEnabled(newState);
        console.log(`Video ${newState ? 'enabled' : 'disabled'}`);
      } else if (!videoEnabled) {
        // If video is disabled and no video tracks exist, try to add a video track
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
          const videoTrack = videoStream.getVideoTracks()[0];
          stream.addTrack(videoTrack);
          setVideoEnabled(true);
          console.log("Added new video track to stream");
        } catch (error) {
          console.error("Error adding video track:", error);
          toast.error("Failed to enable video");
        }
      }
    }
  };

  const toggleAudio = async () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      console.log("Audio tracks:", audioTracks);
      
      if (audioTracks.length > 0) {
        const newState = !audioEnabled;
        audioTracks[0].enabled = newState;
        setAudioEnabled(newState);
        console.log(`Audio ${newState ? 'enabled' : 'disabled'}`);
      } else if (!audioEnabled) {
        // If audio is disabled and no audio tracks exist, try to add an audio track
        try {
          const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const audioTrack = audioStream.getAudioTracks()[0];
          stream.addTrack(audioTrack);
          setAudioEnabled(true);
          console.log("Added new audio track to stream");
        } catch (error) {
          console.error("Error adding audio track:", error);
          toast.error("Failed to enable audio");
        }
      }
    }
  };

  const stopStream = () => {
    if (stream) {
      console.log("Stopping all media tracks");
      stream.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`);
        track.stop();
      });
      setStream(null);
      
      // Clear video element source
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  };

  const handleEndCall = () => {
    console.log("Ending call and cleaning up");
    stopStream();
    onEndCall();
  };

  useEffect(() => {
    // Cleanup function to stop all media when component unmounts
    return () => {
      console.log("Component unmounting, stopping media");
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
            muted={audioEnabled} // Note: Muted by default to avoid audio feedback
            className="w-full h-full object-cover"
          />
          {!stream && (
            <div className="absolute text-white">
              Loading video stream...
            </div>
          )}
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
