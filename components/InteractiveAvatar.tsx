import {
  AvatarQuality,
  StreamingEvents,
  VoiceChatTransport,
  VoiceEmotion,
  StartAvatarRequest,
  STTProvider,
  ElevenLabsModel,
} from "@heygen/streaming-avatar";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, useUnmount, useDebounce } from "ahooks";

import { Button } from "./Button";
import { AvatarConfig } from "./AvatarConfig";
import { AvatarVideo } from "./AvatarSession/AvatarVideo";
import { useStreamingAvatarSession } from "./logic/useStreamingAvatarSession";
import { AvatarControls } from "./AvatarSession/AvatarControls";
import { useVoiceChat } from "./logic/useVoiceChat";
import { StreamingAvatarProvider, StreamingAvatarSessionState } from "./logic";
import { LoadingIcon } from "./Icons";
import { MessageHistory } from "./AvatarSession/MessageHistoryNew";
import { useMessageHistory, MessageSender } from "./logic";
import { Message } from "./logic/context";
import MCQSection from "./AvatarSession/MCQSection";
import AINavbar from './AINavbar';

import { AVATARS } from "@/app/lib/constants";

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: AVATARS[0].avatar_id,
  knowledgeId: "dd9af48db6d54e8fb5c63cae6a8f11dd",
  knowledgeBase: "You are an intelligent, friendly, and patient AI tutor designed to help users learn new topics.",
  voice: {
    rate: 1.5,
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "en",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

function InteractiveAvatar({ onTestComplete, onConversationUpdate }: { onTestComplete?: () => void, onConversationUpdate?: (text: string) => void }) {
  const { initAvatar, startAvatar, stopAvatar, sessionState, stream } =
    useStreamingAvatarSession();
  const { startVoiceChat } = useVoiceChat();
  const { messages } = useMessageHistory();

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);
  const [currentSummary, setCurrentSummary] = useState<string | null>(null);
  const debouncedMessages = useDebounce(messages, { wait: 1000 }); // Debounce messages

  const mediaStream = useRef<HTMLVideoElement>(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      throw error;
    }
  }

  const startSessionV2 = useMemoizedFn(async (isVoiceChat: boolean) => {
    try {
      const newToken = await fetchAccessToken();
      const avatar = initAvatar(newToken);

      avatar.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
        console.log("Avatar started talking", e);
      });
      avatar.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
        console.log("Avatar stopped talking", e);
      });
      avatar.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
      });
      avatar.on(StreamingEvents.STREAM_READY, (event) => {
        console.log(">>>>> Stream ready:", event.detail);
      });
      avatar.on(StreamingEvents.USER_START, (event) => {
        console.log(">>>>> User started talking:", event);
      });
      avatar.on(StreamingEvents.USER_STOP, (event) => {
        console.log(">>>>> User stopped talking:", event);
      });
      avatar.on(StreamingEvents.USER_END_MESSAGE, (event) => {
        console.log(">>>>> User end message:", event);
      });
      avatar.on(StreamingEvents.USER_TALKING_MESSAGE, (event) => {
        // console.log(">>>>> User talking message:", event); // Commented out to prevent display
      });
      avatar.on(StreamingEvents.AVATAR_TALKING_MESSAGE, (event) => {
        // console.log(">>>>> Avatar talking message:", event); // Commented out to prevent display
      });
      avatar.on(StreamingEvents.AVATAR_END_MESSAGE, (event) => {
        console.log(">>>>> Avatar end message:", event);
      });

      await startAvatar(config);

      if (isVoiceChat) {
        await startVoiceChat();
      }
    } catch (error) {
      console.error("Error starting avatar session:", error);
    }
  });

  const handleSummarize = async (conversationMessages: Message[]) => {
    if (conversationMessages.length === 0) {
      setCurrentSummary(null);
      return;
    }

    const conversationText = conversationMessages.map(msg => `${msg.sender}: ${msg.content}`).join("\n");

    try {
      const response = await fetch("/api/summarize-conversation", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversationText }),
      });
      const data = await response.json();

      if (response.ok) {
        setCurrentSummary(data.summary);
      } else {
        console.error("Failed to get summary:", data.error);
        setCurrentSummary("Failed to summarize conversation.");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      setCurrentSummary("An error occurred while summarizing.");
    }
  };

  useEffect(() => {
    if (sessionState === StreamingAvatarSessionState.CONNECTED && debouncedMessages.length > 0) {
      handleSummarize(debouncedMessages);
    } else if (sessionState === StreamingAvatarSessionState.INACTIVE) {
      setCurrentSummary(null);
    }
  }, [debouncedMessages, sessionState]);

  useUnmount(() => {
    stopAvatar();
  });

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  useEffect(() => {
    if (onConversationUpdate && currentSummary) {
      onConversationUpdate(currentSummary);
    }
  }, [currentSummary, onConversationUpdate]);

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-center p-4 md:p-8">
      {sessionState === StreamingAvatarSessionState.INACTIVE ? (
        <div className="w-full max-w-4xl flex flex-col items-center gap-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
              Customize Your Avatar
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Choose an avatar, select a language, and get ready to start your interactive lesson.
            </p>
          </div>
          <AvatarConfig config={config} onConfigChange={setConfig} />
          <div className="flex flex-row gap-4 mt-4">
            <Button onClick={() => startSessionV2(true)}>Start Voice Chat</Button>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col md:flex-row items-stretch justify-center gap-4">
          <div className="flex flex-col rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden w-full md:w-2/3">
            <div className="relative w-full aspect-video overflow-hidden flex flex-col items-center justify-center">
              {sessionState === StreamingAvatarSessionState.CONNECTED ? (
                <AvatarVideo ref={mediaStream} />
              ) : null}
            </div>
            <div className="flex flex-col gap-3 items-center justify-center p-4 border-t border-slate-700 w-full">
              {sessionState === StreamingAvatarSessionState.CONNECTED ? (
                <AvatarControls />
              ) : (
                <LoadingIcon />
              )}
            </div>
          </div>
          {sessionState === StreamingAvatarSessionState.CONNECTED && (
            <div className="flex flex-col rounded-xl bg-slate-800/50 border border-slate-700 overflow-hidden w-full md:w-1/3 h-[800px]">
              <MessageHistory className="h-full" summary={currentSummary} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function InteractiveAvatarWrapper({ onTestComplete }: { onTestComplete?: () => void }) {
  const [showMCQ, setShowMCQ] = useState(false);
  const [conversationText, setConversationText] = useState('');

  const handleGenerateMCQ = () => {
    if (!conversationText) {
      alert('Please have a conversation first before generating MCQs');
      return;
    }
    setShowMCQ(true);
  };

  return (
    <div className="pt-16">
      <AINavbar onGenerateMCQ={handleGenerateMCQ} showGenerate={!showMCQ && !!conversationText} />
      <div className={`relative ${showMCQ ? 'blur-sm' : ''}`}>
        <StreamingAvatarProvider basePath={process.env.NEXT_PUBLIC_BASE_API_URL}>
          <InteractiveAvatar 
            onTestComplete={onTestComplete} 
            onConversationUpdate={setConversationText}
          />
        </StreamingAvatarProvider>
      </div>
      
      {showMCQ && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-gradient-to-br from-neutral-900 to-black p-6 rounded-xl shadow-2xl shadow-black/80 border border-gray-800 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-white">Test Your Knowledge</h2>
            <div className="border-t border-gray-800 pt-4">
              <MCQSection 
                conversationText={conversationText} 
                singleQuestionMode={true}
                onTestComplete={() => {
                  setTimeout(() => setShowMCQ(false), 2000);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
