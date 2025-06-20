import React, { useState, useMemo } from "react";
import {
  AvatarQuality,
  ElevenLabsModel,
  STTProvider,
  VoiceEmotion,
  StartAvatarRequest,
  VoiceChatTransport,
} from "@heygen/streaming-avatar";

import { Input } from "../Input";
import { Select } from "../Select";

import { Field } from "./Field";

import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";

interface AvatarConfigProps {
  onConfigChange: (config: StartAvatarRequest) => void;
  config: StartAvatarRequest;
}

export const AvatarConfig: React.FC<AvatarConfigProps> = ({
  onConfigChange,
  config,
}) => {
  const onChange = <T extends keyof StartAvatarRequest>(
    key: T,
    value: StartAvatarRequest[T],
  ) => {
    onConfigChange({ ...config, [key]: value });
  };
  const [showMore, setShowMore] = useState<boolean>(false);

  const selectedAvatar = useMemo(() => {
    const avatar = AVATARS.find(
      (avatar) => avatar.avatar_id === config.avatarName,
    );

    return avatar || AVATARS[0]; // Default to first avatar if not found
  }, [config.avatarName]);

  return (
    <div className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-6 md:p-8 shadow-lg space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-200 mb-4 text-center">1. Choose Your Avatar</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {AVATARS.map((avatar) => (
            <button
              key={avatar.avatar_id}
              onClick={() => onChange("avatarName", avatar.avatar_id)}
              className={`relative p-0 rounded-lg overflow-hidden border-2 transition-all duration-200 bg-slate-800/60 hover:bg-slate-700/80 ${
                config.avatarName === avatar.avatar_id
                  ? "border-indigo-500 scale-105 shadow-lg"
                  : "border-slate-600 hover:border-indigo-500"
              }`}
            >
              <img src={avatar.thumbnail} alt={avatar.name} className="w-full h-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-center">
                <p className="text-sm font-semibold text-white truncate">{avatar.name}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Field label="2. Select Language">
          <Select
            isSelected={(option) => option.value === config.language}
            options={STT_LANGUAGE_LIST}
            renderOption={(option) => option.label}
            value={STT_LANGUAGE_LIST.find((option) => option.value === config.language)?.label}
            onSelect={(option) => onChange("language", option.value)}
          />
        </Field>
        <Field label="3. Set Quality">
          <Select
            isSelected={(option) => option === config.quality}
            options={Object.values(AvatarQuality)}
            renderOption={(option) => option}
            value={config.quality}
            onSelect={(option) => onChange("quality", option)}
          />
        </Field>
      </div>
    </div>
  );
};
