interface SlideDeckEmbedProps {
  slideId: string;
  title?: string;
  width?: number;
  height?: number;
}

export default function SlideDeckEmbed({ 
  slideId, 
  title = "SlideDeck presentation",
  width = 560,
  height = 420 
}: SlideDeckEmbedProps) {
  return (
    <div className="slidedeck-embed flex justify-center my-6">
      <iframe
        src={`https://www.slideshare.net/slideshow/embed_code/key/${slideId}`}
        width={width}
        height={height}
        frameBorder="0"
        marginWidth={0}
        marginHeight={0}
        scrolling="no"
        title={title}
        className="rounded-lg shadow-lg max-w-full"
        allowFullScreen
      />
    </div>
  );
}