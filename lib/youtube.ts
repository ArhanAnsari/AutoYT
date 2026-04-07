import { google } from "googleapis";
import { Readable } from "stream";

/**
 * Initializes a Google OAuth2 client with the user's access token
 */
export function getYouTubeClient(accessToken: string, refreshToken?: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  oauth2Client.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  return google.youtube({
    version: "v3",
    auth: oauth2Client,
  });
}

/**
 * Uploads a video buffer/stream to YouTube
 */
export async function uploadVideoToYouTube({
  accessToken,
  refreshToken,
  videoStream,
  title,
  description,
  tags = [],
  categoryId = "22" // 22 = People & Blogs, 24 = Entertainment, etc.
}: {
  accessToken: string;
  refreshToken?: string;
  videoStream: Readable;
  title: string;
  description: string;
  tags?: string[];
  categoryId?: string;
}) {
  const youtube = getYouTubeClient(accessToken, refreshToken);

  try {
    const res = await youtube.videos.insert({
      part: ["snippet", "status"],
      requestBody: {
        snippet: {
          title,
          description,
          tags,
          categoryId,
        },
        status: {
          privacyStatus: "private", // Always start private or unlisted safely.
          selfDeclaredMadeForKids: false,
        },
      },
      media: {
        body: videoStream,
      },
    });

    return res.data;
  } catch (error) {
    console.error("YouTube Upload Error: ", error);
    throw error;
  }
}
