import * as React from 'react';
import { SlideLayout } from '../types';
import { TrashIcon, DuplicateIcon } from './Icons';
import ContextMenu from './ContextMenu';

const SlideThumbnail = ({ slide }) => {
  
  const slideStyle = {
    backgroundColor: slide.background?.value && slide.background.type === 'color' ? slide.background.value : '#FFFFFF',
    backgroundImage: slide.background?.value && slide.background.type === 'image' ? slide.background.value : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#000000' // Default text color for thumbnail, can be improved with theme
  };

  const renderContent = () => {
    switch (slide.layout) {
      case SlideLayout.TITLE:
        return React.createElement(
          'div', { className: "text-center p-1", style: slideStyle },
          React.createElement('div', { className: "text-[5px] font-bold truncate", dangerouslySetInnerHTML: { __html: slide.content.title?.html } }),
          React.createElement('div', { className: "text-[4px] mt-1 truncate", dangerouslySetInnerHTML: { __html: slide.content.subtitle?.html } })
        );
      case SlideLayout.IMAGE_WITH_CAPTION:
        return React.createElement(
          'div', { className: "flex flex-col h-full", style: slideStyle },
          React.createElement(
            'div', { className: "flex-grow bg-gray-300 flex items-center justify-center" },
            slide.content.image?.src ? React.createElement('img', { src: slide.content.image.src, className: "h-full w-full object-cover", alt: "mini", style: { filter: slide.content.image.filter || 'none' } }) : React.createElement('span', { className: "text-[5px] text-gray-500" }, "Imagine")
          ),
          React.createElement('div', { className: "text-[4px] p-1 truncate bg-white", dangerouslySetInnerHTML: { __html: slide.content.caption?.html } })
        );
      case SlideLayout.MEDIA_WITH_TEXT:
        return React.createElement(
          'div', { className: "flex flex-col h-full", style: slideStyle },
          React.createElement('div', { className: "text-[5px] text-center font-bold p-0.5 truncate bg-white bg-opacity-50", dangerouslySetInnerHTML: { __html: slide.content.title?.html } }),
          React.createElement(
            'div', { className: "flex-grow bg-gray-300 flex items-center justify-center" },
            slide.content.image?.src ? React.createElement('img', { src: slide.content.image.src, className: "h-full w-full object-cover", alt: "mini", style: { filter: slide.content.image.filter || 'none' } }) : React.createElement('span', { className: "text-[5px] text-gray-500" }, "Imagine")
          ),
          slide.content.audio?.src && React.createElement('div', { className: "text-[5px] text-center bg-purple-200 text-purple-700" }, "Audio")
        );
      default: return null;
    }
  }
  return React.createElement(
    'div', { className: "w-full aspect-video bg-white shadow-md border border-gray-300 overflow-hidden" },
    renderContent()
  );
};

const SlidePanel = ({ slides, currentSlideIndex, onSelectSlide, onDeleteSlide, onDuplicateSlide, onReorderSlides, onAddSlide }) => {
  const draggedItemIndex = React.useRef(null);
  const [dragOverIndex, setDragOverIndex] = React.useState(null);
  const [contextMenu, setContextMenu] = React.useState(null); // { x, y, index }

  const handleDragStart = (e, index) => {
    draggedItemIndex.current = index;
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        if(e.currentTarget) e.currentTarget.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnter = (e, index) => {
    if (index !== draggedItemIndex.current) {
        setDragOverIndex(index);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  
  const handleDragLeave = () => {
      setDragOverIndex(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (dragOverIndex !== null && draggedItemIndex.current !== null) {
      onReorderSlides(draggedItemIndex.current, dragOverIndex);
    }
    cleanupDragState(e.currentTarget);
  };

  const handleDragEnd = (e) => {
    cleanupDragState(e.currentTarget);
  };
  
  const cleanupDragState = (element) => {
    if(draggedItemIndex.current !== null && element && element.parentElement){
        const originalElement = element.parentElement.querySelector(`[data-index='${draggedItemIndex.current}']`);
        if(originalElement) originalElement.style.opacity = '1';
    }
    draggedItemIndex.current = null;
    setDragOverIndex(null);
  };

  const handleContextMenu = (e, index) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, index });
  };

  const closeContextMenu = () => setContextMenu(null);

  React.useEffect(() => {
      window.addEventListener('click', closeContextMenu);
      return () => window.removeEventListener('click', closeContextMenu);
  }, []);

  const contextMenuItems = contextMenu ? [
      { label: 'Slide nou', action: () => onAddSlide(contextMenu.index) },
      { label: 'Duplicare Slide', action: () => onDuplicateSlide(contextMenu.index) },
      { label: 'Ștergere Slide', action: () => onDeleteSlide(contextMenu.index), className: 'text-red-600' },
  ] : [];

  return React.createElement(
    'div',
    { className: "w-48 bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto" },
    React.createElement(
      'div',
      { className: "space-y-1", onDragLeave: handleDragLeave },
      slides.map((slide, index) => {
        const props = {
            'data-index': index,
            draggable: true,
            onDragStart: (e) => handleDragStart(e, index),
            onDragEnter: (e) => handleDragEnter(e, index),
            onDragOver: handleDragOver,
            onDrop: handleDrop,
            onDragEnd: handleDragEnd,
            onClick: () => onSelectSlide(index),
            onContextMenu: (e) => handleContextMenu(e, index),
            className: `group relative flex items-start space-x-2 p-1 rounded-md cursor-pointer transition-all ${currentSlideIndex === index ? 'bg-blue-200 ring-2 ring-blue-500' : 'hover:bg-gray-200'}`
        };
        
        const duplicateButtonProps = {
            onClick: (e) => { e.stopPropagation(); onDuplicateSlide(index); },
            className: "p-0.5 text-gray-600 hover:bg-gray-300 rounded"
        };
        
        const deleteButtonProps = {
            onClick: (e) => { e.stopPropagation(); onDeleteSlide(index); },
            className: "p-0.5 text-red-600 hover:bg-red-200 rounded"
        };

        return React.createElement(
          'div',
          { key: slide.id },
          dragOverIndex === index && React.createElement('div', { className: 'h-1.5 bg-blue-500 rounded-full my-1 transition-all' }),
          React.createElement('div', props,
              React.createElement('span', { className: "text-sm font-semibold text-gray-600 w-6 text-right" }, index + 1),
              React.createElement('div', { className: "flex-1" }, React.createElement(SlideThumbnail, { slide: slide })),
              React.createElement(
                'div', { className: "absolute top-0 right-0 p-0.5 flex space-x-0.5 bg-gray-100 bg-opacity-80 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity" },
                React.createElement('button', duplicateButtonProps, React.createElement(DuplicateIcon, { className: "h-3 w-3" })),
                React.createElement('button', deleteButtonProps, React.createElement(TrashIcon, { className: "h-3 w-3" }))
              )
            )
        );
      })
    ),
    contextMenu && React.createElement(ContextMenu, { x: contextMenu.x, y: contextMenu.y, items: contextMenuItems, onClose: closeContextMenu })
  );
};

export default SlidePanel;