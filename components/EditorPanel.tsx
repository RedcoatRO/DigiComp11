
import * as React from 'react';
import { SlideLayout, ResourceType, ActionType } from '../types';
import { ImageIcon, MusicIcon, PlayIcon } from './Icons';
import { ThemeContext } from './PowerPointSimulator';
import Shape from './Shape';


const EditableText = ({ content, onUpdate, className, placeholder, theme }) => {
  const textStyle = {
      color: theme.styles.slide.color,
  };

  return React.createElement(
    'div',
    {
      style: textStyle,
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e) => onUpdate(e.currentTarget.innerHTML || ''),
      className: `focus:outline-none focus:ring-2 focus:ring-blue-400 p-2 ${className}`,
      dangerouslySetInnerHTML: { __html: !content.html || content.html.includes("Click pentru a adăuga") || content.html.includes("Adăugați o descriere") ? `<span class="text-gray-400">${placeholder}</span>` : content.html }
    }
  );
};

const EditorPanel = ({ slide, onUpdateSlide, onUpdateShapePosition, logAction }) => {
  const theme = React.useContext(ThemeContext);
  
  // Stare locală pentru a gestiona tragerea formelor
  const [draggingShape, setDraggingShape] = React.useState(null);

  const handleDrop = (e, targetArea) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const resource = JSON.parse(e.dataTransfer.getData('application/json'));
      
      // --- Validare Drop Resurse ---
      const allowedDrops = {
          title: [ResourceType.TEXT],
          subtitle: [ResourceType.TEXT],
          caption: [ResourceType.TEXT],
          image: [ResourceType.IMAGE],
          media: [ResourceType.IMAGE],
          audio: [ResourceType.AUDIO],
      };
      
      if (!allowedDrops[targetArea] || !allowedDrops[targetArea].includes(resource.type)) {
          alert(`Nu puteți plasa o resursă de tip "${resource.type}" în această zonă.`);
          return;
      }
      // --- Sfârșit Validare ---
      
      logAction({ type: ActionType.DROP_RESOURCE, payload: { resourceType: resource.type, targetArea } });

      const updatedSlide = { ...slide, content: { ...slide.content } };

      switch (resource.type) {
        case ResourceType.TEXT:
          if (targetArea === 'title' && updatedSlide.content.title) {
            updatedSlide.content.title = { html: resource.content.split('. ')[0] };
          } else if (targetArea === 'subtitle' && updatedSlide.content.subtitle) {
            updatedSlide.content.subtitle = { html: resource.content };
          } else if (targetArea === 'caption' && updatedSlide.content.caption) {
            updatedSlide.content.caption = { html: resource.content };
          }
          break;
        case ResourceType.IMAGE:
          if ((targetArea === 'image' || targetArea === 'media') && updatedSlide.content.image) {
            updatedSlide.content.image = { ...updatedSlide.content.image, src: resource.content, alt: 'Imagine încărcată de utilizator' };
          }
          break;
        case ResourceType.AUDIO:
          if (targetArea === 'audio' && updatedSlide.content.audio) {
            updatedSlide.content.audio = { ...updatedSlide.content.audio, src: resource.content };
          }
          break;
      }
      onUpdateSlide(updatedSlide);
    } catch (error) {
      console.error("Failed to handle drop:", error);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const updateText = (key, html) => {
    logAction({ type: ActionType.UPDATE_TEXT, payload: { slideId: slide.id, field: key } });
    const updatedSlide = {
      ...slide,
      content: { ...slide.content, [key]: { html } }
    };
    onUpdateSlide(updatedSlide);
  };
  
  // --- Logică pentru tragerea formelor ---
  const handleShapeMouseDown = (e, shapeId) => {
      e.stopPropagation(); // Previne declanșarea altor evenimente
      const startX = e.clientX;
      const startY = e.clientY;
      const shape = slide.shapes.find(s => s.id === shapeId);
      setDraggingShape({ shapeId, startX, startY, initialX: shape.x, initialY: shape.y });
  };
  
  const handleMouseMove = (e) => {
      if (!draggingShape) return;
      
      const dx = e.clientX - draggingShape.startX;
      const dy = e.clientY - draggingShape.startY;
      
      const newX = draggingShape.initialX + dx;
      const newY = draggingShape.initialY + dy;

      onUpdateShapePosition(draggingShape.shapeId, newX, newY);
  };

  const handleMouseUp = () => {
      setDraggingShape(null);
  };
  // --- Sfârșit logică tragere ---

  const renderSlideLayout = () => {
    const slideStyle = {
        backgroundColor: slide.background?.value && slide.background.type === 'color' ? slide.background.value : theme.styles.slide.backgroundColor,
        backgroundImage: slide.background?.value && slide.background.type === 'image' ? slide.background.value : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: theme.styles.slide.color,
        position: 'relative', // Necesar pentru poziționarea absolută a formelor
        overflow: 'hidden', // Previne ieșirea formelor din slide
    };

    const dropZoneBaseClass = "border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 transition-all";

    switch (slide.layout) {
      case SlideLayout.TITLE:
        return React.createElement('div', { className: "w-full h-full flex flex-col justify-center items-center p-16", style: slideStyle },
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'title'), onDragOver: handleDragOver, className: `w-full mb-4 ${dropZoneBaseClass}` } as any,
            React.createElement(EditableText, { content: slide.content.title, onUpdate: (html) => updateText('title', html), className: "text-5xl font-bold text-center", placeholder: "Click pentru a adăuga titlu", theme })
          ),
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'subtitle'), onDragOver: handleDragOver, className: `w-3/4 ${dropZoneBaseClass}` } as any,
            React.createElement(EditableText, { content: slide.content.subtitle, onUpdate: (html) => updateText('subtitle', html), className: "text-2xl text-center", placeholder: "Click pentru a adăuga subtitlu", theme })
          ),
          slide.shapes.map(shape => React.createElement(Shape, { key: shape.id, shape: shape, onMouseDown: handleShapeMouseDown }))
        );
      case SlideLayout.IMAGE_WITH_CAPTION:
        const imageStyle = { filter: slide.content.image?.filter || 'none', transition: 'filter 0.3s ease' };
        return React.createElement('div', { className: "w-full h-full flex flex-col justify-center items-center p-8", style: slideStyle },
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'image'), onDragOver: handleDragOver, className: `w-full flex-grow flex justify-center items-center overflow-hidden ${dropZoneBaseClass}` } as any,
            slide.content.image?.src ?
              React.createElement('img', { src: slide.content.image.src, alt: slide.content.image.alt, className: "w-full h-full object-contain", style: imageStyle }) :
              React.createElement('div', { className: "text-center text-gray-400" }, React.createElement(ImageIcon, { className: "h-16 w-16 mx-auto" }), React.createElement('p', null, "Trageți imaginea aici"))
          ),
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'caption'), onDragOver: handleDragOver, className: `w-full mt-4 ${dropZoneBaseClass}` } as any,
            React.createElement(EditableText, { content: slide.content.caption, onUpdate: (html) => updateText('caption', html), className: "text-lg text-center", placeholder: "Adăugați o descriere", theme })
          ),
          slide.shapes.map(shape => React.createElement(Shape, { key: shape.id, shape: shape, onMouseDown: handleShapeMouseDown }))
        );
      case SlideLayout.MEDIA_WITH_TEXT:
        const mediaImageStyle = { filter: slide.content.image?.filter || 'none', transition: 'filter 0.3s ease' };
        return React.createElement('div', { className: "w-full h-full flex flex-col items-center p-8", style: slideStyle },
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'title'), onDragOver: handleDragOver, className: `w-full mb-4 ${dropZoneBaseClass}` } as any,
            React.createElement(EditableText, { content: slide.content.title, onUpdate: (html) => updateText('title', html), className: "text-3xl font-bold text-center", placeholder: "Titlu media", theme })
          ),
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'media'), onDragOver: handleDragOver, className: `w-full flex-grow flex justify-center items-center overflow-hidden relative ${dropZoneBaseClass}` } as any,
            slide.content.image?.src ?
              React.createElement('img', { src: slide.content.image.src, alt: slide.content.image.alt, className: "w-full h-full object-contain", style: mediaImageStyle }) :
              React.createElement('div', { className: "text-center text-gray-400" }, React.createElement(ImageIcon, { className: "h-16 w-16 mx-auto" }), React.createElement('p', null, "Trageți imaginea aici"))
          ),
          React.createElement('div', { onDrop: (e) => handleDrop(e, 'audio'), onDragOver: handleDragOver, className: `w-full mt-4 p-4 flex justify-center items-center space-x-4 border-2 border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50/50 transition-all` } as any,
            slide.content.audio?.src ?
              React.createElement(React.Fragment, null, React.createElement(MusicIcon, { className: "h-8 w-8 text-purple-600" }), React.createElement('span', { className: "text-purple-800 font-medium" }, "Fișier audio încărcat."), React.createElement('button', { onClick: () => new Audio(slide.content.audio.src).play(), className: "p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition" }, React.createElement(PlayIcon, { className: "h-5 w-5" }))) :
              React.createElement('div', { className: "text-center text-gray-400" }, React.createElement(MusicIcon, { className: "h-10 w-10 mx-auto" }), React.createElement('p', null, "Trageți fișierul audio aici"))
          ),
          slide.shapes.map(shape => React.createElement(Shape, { key: shape.id, shape: shape, onMouseDown: handleShapeMouseDown }))
        );
      default:
        return React.createElement('div', { style: slideStyle }, "Layout necunoscut");
    }
  };

  return React.createElement(
    'div', { className: "flex-1 flex items-center justify-center p-8", style: { backgroundColor: theme.styles.app.backgroundColor }, onMouseMove: handleMouseMove, onMouseUp: handleMouseUp },
    React.createElement(
      'div', { className: "aspect-video w-[800px] bg-white shadow-2xl" },
      renderSlideLayout()
    )
  );
};

export default EditorPanel;