import React from "react";
import { AbsoluteFill, Img, Audio, useVideoConfig, Sequence, spring } from "remotion";

interface AutoYTVideoProps {
  scenes: {
    order: number;
    narrationText: string;
    imageAssetUrl?: string;
    audioAssetUrl?: string;
    durationMs?: number;
  }[];
  title: string;
}

export const AutoYTVideo: React.FC<AutoYTVideoProps> = ({ scenes, title }) => {
  const { durationInFrames, fps } = useVideoConfig();

  const getSceneDuration = (index: number) => {
    const scene = scenes[index];
    const durationMs = scene.durationMs || 5000;
    return Math.ceil((durationMs / 1000) * fps);
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      {scenes.map((scene, idx) => {
        let startFrame = 0;
        for (let i = 0; i < idx; i++) {
          startFrame += getSceneDuration(i);
        }
        return (
          <Sequence
            key={`scene-${idx}`}
            from={startFrame}
            durationInFrames={getSceneDuration(idx)}
          >
            <SceneComponent
              scene={scene}
              title={title}
              isOutro={idx === scenes.length - 1}
            />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

interface SceneComponentProps {
  scene: {
    narrationText: string;
    imageAssetUrl?: string;
    audioAssetUrl?: string;
  };
  title: string;
  isOutro?: boolean;
}

const SceneComponent: React.FC<SceneComponentProps> = ({
  scene,
  title,
  isOutro,
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
      }}
    >
      {scene.imageAssetUrl && (
        <Img
          src={scene.imageAssetUrl}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.7,
          }}
        />
      )}

      <div
        style={{
          position: "relative",
          zIndex: 10,
          textAlign: "center",
          color: "#fff",
          padding: "60px 40px",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          borderRadius: "12px",
          maxWidth: "90%",
        }}
      >
        <div
          style={{
            fontSize: isOutro ? "48px" : "56px",
            fontWeight: "700",
            lineHeight: "1.4",
            textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)",
          }}
        >
          {scene.narrationText}
        </div>
        {!isOutro && (
          <div
            style={{
              fontSize: "32px",
              marginTop: "30px",
              opacity: 0.8,
              fontWeight: "500",
            }}
          >
            {title}
          </div>
        )}
      </div>

      {scene.audioAssetUrl && (
        <Audio src={scene.audioAssetUrl} />
      )}
    </AbsoluteFill>
  );
};
