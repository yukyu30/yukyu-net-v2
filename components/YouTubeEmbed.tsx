interface YouTubeEmbedProps {
  videoId: string;
  title?: string;
  width?: number;
  height?: number;
}

export default function YouTubeEmbed({ 
  videoId, 
  title = "YouTube video player",
  width = 560,
  height = 315 
}: YouTubeEmbedProps) {
  return (
    <div className="youtube-embed flex justify-center my-6">
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="rounded-lg shadow-lg max-w-full"
        style={{ aspectRatio: '16/9' }}
      />
    </div>
  );
}