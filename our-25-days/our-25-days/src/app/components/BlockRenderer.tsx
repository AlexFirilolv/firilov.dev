'use client';

type BlockType = 'title' | 'paragraph' | 'image' | 'quote' | 'highlight';

export interface Block {
  id: string;
  block_type: BlockType;
  content: string;
}

export interface DisplaySettings {
    imageSize?: string;
    titleFontSize?: string;
    paragraphFontSize?: string;
    quoteFontSize?: string;
    highlightFontSize?: string;
}

export const BlockRenderer = ({ block, settings = {} }: { block: Block, settings?: DisplaySettings }) => {
    const style: React.CSSProperties = {};

    switch (block.block_type) {
      case 'title':
        if (settings.titleFontSize) style.fontSize = settings.titleFontSize;
        return <h1 className="text-5xl sm:text-6xl font-bold text-gray-800 my-4" style={{ ...style, fontFamily: 'Playfair Display, serif' }}>{block.content}</h1>;
      case 'paragraph':
        if (settings.paragraphFontSize) style.fontSize = settings.paragraphFontSize;
        return <p className="text-lg sm:text-xl text-gray-700 leading-relaxed my-4" style={style}>{block.content}</p>;
      case 'image':
        if (settings.imageSize) style.width = settings.imageSize;
        return <img src={block.content} alt="Memory" className="h-auto rounded-xl shadow-lg my-4 mx-auto" style={style} />;
      case 'quote':
        if (settings.quoteFontSize) style.fontSize = settings.quoteFontSize;
        return <blockquote className="text-xl italic text-center text-gray-600 border-l-4 border-pink-300 pl-4 my-6" style={style}>{block.content}</blockquote>;
      case 'highlight':
        if (settings.highlightFontSize) style.fontSize = settings.highlightFontSize;
        return <div className="p-4 bg-pink-100/50 rounded-lg text-pink-800 my-4" style={style}>{block.content}</div>;
      default:
        return null;
    }
}; 