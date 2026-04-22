import { useState } from "react";
import { Loader2, Video, ExternalLink, RefreshCw } from "lucide-react";

function VideoPanel({ sessionId, userName }) {
  const [isLoading, setIsLoading] = useState(true);
  const [iframeKey, setIframeKey] = useState(0);

  // Build a deterministic, unique room name for this session
  // Prefix ensures no collision with random Jitsi rooms
  const roomName = `CodestSession${(sessionId || "default")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 30)}`;

  // Jitsi URL with config via hash — using string concat (NOT URL object)
  const jitsiUrl = [
    `https://meet.jit.si/${roomName}`,
    "#",
    "config.prejoinPageEnabled=false",
    "&config.startWithAudioMuted=false",
    "&config.startWithVideoMuted=false",
    "&config.disableDeepLinking=true",
    "&config.hideConferenceSubject=true",
    "&interfaceConfig.SHOW_JITSI_WATERMARK=false",
    "&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false",
    "&interfaceConfig.MOBILE_APP_PROMO=false",
    "&interfaceConfig.SHOW_CHROME_EXTENSION_BANNER=false",
    `&userInfo.displayName=${encodeURIComponent(userName || "Guest")}`,
  ].join("");

  return (
    <div className="h-full flex flex-col relative bg-base-300">
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-base-200">
          <Loader2 className="size-10 animate-spin text-primary mb-4" />
          <p className="text-sm font-medium">Connecting to video call...</p>
          <p className="text-xs text-base-content/50 mt-1">
            Camera & mic permission may be requested
          </p>
        </div>
      )}

      {/* Top-right controls — always visible for quick actions */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
        <button
          onClick={() => { setIsLoading(true); setIframeKey((k) => k + 1); }}
          className="btn btn-xs bg-base-100/80 backdrop-blur-sm border-base-content/10 gap-1"
          title="Reload video"
        >
          <RefreshCw className="size-3" />
        </button>
        <button
          onClick={() => window.open(jitsiUrl, "_blank", "noopener")}
          className="btn btn-xs bg-base-100/80 backdrop-blur-sm border-base-content/10 gap-1"
          title="Open in a new tab if embedded video has issues"
        >
          <ExternalLink className="size-3" />
          Pop Out
        </button>
      </div>

      {/* Live badge */}
      {!isLoading && (
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 bg-success/90 text-success-content px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm pointer-events-none">
          <Video className="size-3" />
          Live
        </div>
      )}

      {/* Jitsi iframe */}
      <iframe
        key={iframeKey}
        src={jitsiUrl}
        allow="camera; microphone; display-capture; fullscreen; autoplay; clipboard-write"
        allowFullScreen
        className="flex-1 w-full border-none"
        style={{ minHeight: 0 }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export default VideoPanel;
