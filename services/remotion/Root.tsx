import { Composition } from "remotion";
import { AutoYTVideo } from "./AutoYTComposition";

export const RemotionRoot = () => {
  return (
    <Composition
      id="AutoYTVideo"
      component={AutoYTVideo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        title: "AutoYT Video",
        scenes: [
          {
            order: 0,
            narrationText: "Welcome to AutoYT",
            imageAssetUrl: "https://via.placeholder.com/1920x1080",
            durationMs: 5000,
          },
        ],
      }}
    />
  );
};
