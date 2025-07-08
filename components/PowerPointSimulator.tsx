
import * as React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ReactDOM from 'react-dom/client';

import Ribbon from './Ribbon';
import SlidePanel from './SlidePanel';
import EditorPanel from './EditorPanel';
import ResourcePanel from './ResourcePanel';
import Slideshow from './Slideshow';
import NotesPanel from './NotesPanel';
import { MinimizeIcon, MaximizeIcon, CloseIcon } from './Icons';
import { ResourceType, SlideLayout } from '../types';

// --- THEMES & CONTEXT ---
const THEMES = {
  'Luminos': {
    name: 'Luminos',
    styles: {
      app: { backgroundColor: '#E5E7EB' /* gray-200 */, color: '#1F2937' /* gray-800 */ },
      slide: { backgroundColor: '#FFFFFF', color: '#1F2937' },
      ribbon: { backgroundColor: '#F3F4F6' /* gray-100 */, color: '#1F2937' },
    }
  },
  'Întunecat': {
    name: 'Întunecat',
    styles: {
      app: { backgroundColor: '#1F2937' /* gray-800 */, color: '#F9FAFB' /* gray-50 */ },
      slide: { backgroundColor: '#4B5563' /* gray-600 */, color: '#F9FAFB' },
      ribbon: { backgroundColor: '#374151' /* gray-700 */, color: '#F9FAFB' },
    }
  },
  'Sepia': {
      name: 'Sepia',
      styles: {
          app: { backgroundColor: '#fdf4e8', color: '#5d4037' },
          slide: { backgroundColor: '#fbf0e2', color: '#5d4037' },
          ribbon: { backgroundColor: '#f6e7d6', color: '#5d4037' },
      }
  }
};
export const ThemeContext = React.createContext(THEMES['Luminos']);
// --- END THEMES & CONTEXT ---


// --- CONSTANTS MOVED HERE TO FIX MODULE LOADING ERRORS ---
const RESOURCES = [
  { id: 'res-text', type: ResourceType.TEXT, name: 'text.txt', content: "Integrarea resurselor digitale diverse, precum text, imagini și sunet, este esențială în prezentările moderne. Aceasta permite o comunicare mai eficientă și un impact vizual sporit.", iconName: 'FileTextIcon' },
  { id: 'res-image', type: ResourceType.IMAGE, name: 'poza.jpg', content: 'https://picsum.photos/seed/tech/800/600', iconName: 'ImageIcon' },
  { id: 'res-audio', type: ResourceType.AUDIO, name: 'explicatie.mp3', content: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', iconName: 'MusicIcon' },
];

const INITIAL_SLIDES = [
  {
    id: `slide-${Date.now()}-1`, layout: SlideLayout.TITLE,
    background: { type: 'color', value: '' },
    content: { title: { html: 'Click pentru a adăuga titlu' }, subtitle: { html: 'Click pentru a adăuga subtitlu' } },
    shapes: [], notes: '', transition: 'fade',
  },
  {
    id: `slide-${Date.now()}-2`, layout: SlideLayout.IMAGE_WITH_CAPTION,
    background: { type: 'color', value: '' },
    content: { image: { src: '', alt: '', filter: 'none' }, caption: { html: 'Adăugați o descriere pentru imagine' } },
    shapes: [], notes: '', transition: 'fade',
  },
  {
    id: `slide-${Date.now()}-3`, layout: SlideLayout.MEDIA_WITH_TEXT,
    background: { type: 'color', value: '' },
    content: { title: { html: 'Imagine și Sunet' }, image: { src: '', alt: '', filter: 'none' }, audio: { src: '', autoplay: false } },
    shapes: [], notes: '', transition: 'fade',
  },
];
// --- END OF CONSTANTS ---

// --- UNDO/REDO & STATE MANAGEMENT ---
// Starea inițială este citită din LocalStorage sau se folosește starea implicită.
const getInitialState = () => {
    try {
        const savedState = localStorage.getItem('powerpoint-slides-history');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Asigură că starea salvată are structura corectă
            if (parsedState.present) {
                return parsedState;
            }
        }
    } catch (e) {
        console.error("Failed to load state from localStorage", e);
    }
    // Fallback la starea inițială
    return {
        past: [],
        present: { slides: INITIAL_SLIDES, currentSlideIndex: 0 },
        future: [],
    };
};
// --- END UNDO/REDO ---

const PowerPointSimulator = () => {
  // Starea aplicației acum include istoricul pentru undo/redo.
  const [state, setState] = React.useState(getInitialState);
  const { slides, currentSlideIndex } = state.present;

  const [isSlideshowVisible, setSlideshowVisible] = React.useState(false);
  const [activeTheme, setActiveTheme] = React.useState(THEMES['Luminos']);
  
  // --- STATE UPDATE LOGIC ---
  // O funcție centralizată pentru a actualiza starea și a gestiona istoricul.
  // Orice modificare a slide-urilor trebuie să treacă prin această funcție.
  const updateState = React.useCallback((newState, actionType = 'update') => {
      setState(prevState => {
          // La o acțiune nouă, istoricul 'future' este resetat.
          const newPresent = typeof newState === 'function' ? newState(prevState.present) : newState;
          return {
              past: [...prevState.past, prevState.present],
              present: newPresent,
              future: [],
          };
      });
  }, []);

  const handleSelectSlide = (index) => {
    // Selectarea unui slide nu trebuie să fie o acțiune care poate fi anulată,
    // deci modificăm direct starea fără a folosi updateState.
    setState(prevState => ({ ...prevState, present: { ...prevState.present, currentSlideIndex: index }}));
  };
  
  // Toate funcțiile de mai jos folosesc acum `updateState` pentru a permite undo/redo.
  const handleUpdateSlide = React.useCallback((updatedSlide) => {
    updateState(prev => ({
        ...prev,
        slides: prev.slides.map(s => (s.id === updatedSlide.id ? updatedSlide : s))
    }));
  }, [updateState]);

  const handleAddSlide = React.useCallback((atIndex) => {
    const newSlide = {
      id: `slide-${Date.now()}`, layout: SlideLayout.TITLE,
      background: { type: 'color', value: '' },
      content: { title: { html: 'Titlu nou' }, subtitle: { html: 'Faceți click pentru a edita' } },
      shapes: [], notes: '', transition: 'fade',
    };
    const newIndex = (typeof atIndex === 'number' ? atIndex : currentSlideIndex) + 1;
    
    updateState(prev => {
        const newSlides = [...prev.slides];
        newSlides.splice(newIndex, 0, newSlide);
        return { slides: newSlides, currentSlideIndex: newIndex };
    });
  }, [currentSlideIndex, updateState]);

  const handleDeleteSlide = React.useCallback((indexToDelete) => {
    if (slides.length <= 1) { alert("Nu puteți șterge ultimul slide."); return; }
    if (window.confirm(`Sunteți sigur că doriți să ștergeți slide-ul ${indexToDelete + 1}?`)) {
        updateState(prev => {
            const newSlides = prev.slides.filter((_, index) => index !== indexToDelete);
            const newCurrentIndex = prev.currentSlideIndex >= indexToDelete ? Math.max(0, prev.currentSlideIndex - 1) : prev.currentSlideIndex;
            return { slides: newSlides, currentSlideIndex: newCurrentIndex };
        });
    }
  }, [slides.length, updateState]);

  const handleDuplicateSlide = React.useCallback((indexToDuplicate) => {
    const newSlide = JSON.parse(JSON.stringify(slides[indexToDuplicate]));
    newSlide.id = `slide-${Date.now()}`;
    const newIndex = indexToDuplicate + 1;
    
    updateState(prev => {
        const newSlides = [...prev.slides];
        newSlides.splice(newIndex, 0, newSlide);
        return { slides: newSlides, currentSlideIndex: newIndex };
    });
  }, [slides, updateState]);
  
  const handleChangeLayout = React.useCallback((newLayout) => {
    const currentSlide = slides[currentSlideIndex];
    const updatedSlide = { ...currentSlide, layout: newLayout };

    // Asigură că noile câmpuri de conținut există la schimbarea layout-ului
    const requiredContent = {
        [SlideLayout.TITLE]: { title: { html: '' }, subtitle: { html: '' } },
        [SlideLayout.IMAGE_WITH_CAPTION]: { image: { src: '', alt: '', filter: 'none' }, caption: { html: '' } },
        [SlideLayout.MEDIA_WITH_TEXT]: { title: { html: '' }, image: { src: '', alt: '', filter: 'none' }, audio: { src: '', autoplay: false } },
    };
    
    updatedSlide.content = { ...requiredContent[newLayout], ...currentSlide.content };

    handleUpdateSlide(updatedSlide);
  }, [slides, currentSlideIndex, handleUpdateSlide]);

  const handleReorderSlides = React.useCallback((sourceIndex, destinationIndex) => {
    if (sourceIndex === destinationIndex) return;
    updateState(prev => {
        const newSlides = Array.from(prev.slides);
        const [reorderedItem] = newSlides.splice(sourceIndex, 1);
        newSlides.splice(destinationIndex, 0, reorderedItem);
        
        let newCurrentIndex = prev.currentSlideIndex;
        if (prev.currentSlideIndex === sourceIndex) newCurrentIndex = destinationIndex;
        else if (sourceIndex < prev.currentSlideIndex && destinationIndex >= prev.currentSlideIndex) newCurrentIndex--;
        else if (sourceIndex > prev.currentSlideIndex && destinationIndex <= prev.currentSlideIndex) newCurrentIndex++;
        
        return { slides: newSlides, currentSlideIndex: newCurrentIndex };
    });
  }, [updateState]);
  
  const handleApplyImageFilter = React.useCallback((filterValue) => {
    const currentSlide = slides[currentSlideIndex];
    if (currentSlide.content.image) {
        const updatedSlide = { ...currentSlide, content: { ...currentSlide.content, image: { ...currentSlide.content.image, filter: filterValue }}};
        handleUpdateSlide(updatedSlide);
    } else {
        alert("Slide-ul curent nu conține o imagine.");
    }
  }, [slides, currentSlideIndex, handleUpdateSlide]);

  const handleSetTheme = (themeName) => setActiveTheme(THEMES[themeName]);
  
  const handleSetBackground = (background, applyToAll) => {
      if (applyToAll) {
          updateState(prev => ({...prev, slides: prev.slides.map(slide => ({ ...slide, background }))}));
      } else {
          const updatedSlide = { ...slides[currentSlideIndex], background };
          handleUpdateSlide(updatedSlide);
      }
  };
  
  const handleAddShape = (type) => {
      const newShape = {
          id: `shape-${Date.now()}`, type,
          x: 50, y: 50, width: 100, height: type === 'circle' ? 100 : 60,
          color: '#3B82F6' // blue-500
      };
      const updatedSlide = { ...slides[currentSlideIndex], shapes: [...slides[currentSlideIndex].shapes, newShape] };
      handleUpdateSlide(updatedSlide);
  };
  
  const handleUpdateShapePosition = (shapeId, x, y) => {
      const updatedShapes = slides[currentSlideIndex].shapes.map(shape =>
          shape.id === shapeId ? { ...shape, x, y } : shape
      );
      const updatedSlide = { ...slides[currentSlideIndex], shapes: updatedShapes };
      handleUpdateSlide(updatedSlide);
};
  
  const handleUpdateNotes = (notes) => {
      const updatedSlide = { ...slides[currentSlideIndex], notes };
      handleUpdateSlide(updatedSlide);
  };
  
  const handleSetTransition = (transitionName) => {
      const updatedSlide = { ...slides[currentSlideIndex], transition: transitionName };
      handleUpdateSlide(updatedSlide);
  };
  
  const handleStartSlideshow = async () => {
    try {
      if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      setSlideshowVisible(true);
    } catch (err) {
      console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      setSlideshowVisible(true);
    }
  };
  
  const handleCloseSlideshow = () => {
      if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen();
      setSlideshowVisible(false);
  };
  
  // --- UNDO/REDO LOGIC ---
  const canUndo = state.past.length > 0;
  const canRedo = state.future.length > 0;

  const handleUndo = React.useCallback(() => {
    if (!canUndo) return;
    setState(prevState => {
      const newFuture = [prevState.present, ...prevState.future];
      const newPresent = prevState.past[prevState.past.length - 1];
      const newPast = prevState.past.slice(0, prevState.past.length - 1);
      return { past: newPast, present: newPresent, future: newFuture };
    });
  }, [canUndo]);

  const handleRedo = React.useCallback(() => {
    if (!canRedo) return;
    setState(prevState => {
      const newPast = [...prevState.past, prevState.present];
      const newPresent = prevState.future[0];
      const newFuture = prevState.future.slice(1);
      return { past: newPast, present: newPresent, future: newFuture };
    });
  }, [canRedo]);
  
  // --- LOCALSTORAGE & KEYBOARD SHORTCUTS ---
  React.useEffect(() => {
      // Salvează în LocalStorage la fiecare modificare a stării
      localStorage.setItem('powerpoint-slides-history', JSON.stringify(state));
  }, [state]);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      const isEditingText = e.target.isContentEditable || ['INPUT', 'TEXTAREA'].includes(e.target.tagName);
      
      // Ctrl/Cmd + Z/Y pentru Undo/Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); handleUndo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); handleRedo(); }

      if (isEditingText) {
          if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); document.execCommand('bold'); }
      } else {
          // Navigare între slide-uri cu săgeți când nu se editează text
          if (e.key === 'ArrowUp') { e.preventDefault(); handleSelectSlide(Math.max(0, currentSlideIndex - 1)); }
          if (e.key === 'ArrowDown') { e.preventDefault(); handleSelectSlide(Math.min(slides.length - 1, currentSlideIndex + 1)); }
      }
      
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
          e.preventDefault();
          alert("Progresul a fost salvat automat!");
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, currentSlideIndex, slides.length]);
  
  // --- PDF EXPORT ---
  const [isExporting, setIsExporting] = React.useState(false);
  const pdfRenderContainerRef = React.useRef(null);
  
  const handleExportPdf = async () => {
    if (isExporting) return;
    setIsExporting(true);
    alert("Se generează PDF-ul... Acest proces poate dura câteva momente.");
    
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [800, 450] });
    const container = pdfRenderContainerRef.current;
    
    for (let i = 0; i < slides.length; i++) {
        const slide = slides[i];
        
        // Randare temporară a slide-ului în containerul ascuns
        const slideElement = React.createElement(EditorPanel, { slide, onUpdateSlide: () => {}, onUpdateShapePosition: () => {} });
        const root = ReactDOM.createRoot(container);
        await new Promise(resolve => root.render(slideElement, resolve));
        
        const canvas = await html2canvas(container.querySelector('.aspect-video'), { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, 800, 450);
        
        root.unmount(); // Curățare după fiecare slide
    }
    
    pdf.save('prezentare.pdf');
    setIsExporting(false);
  };

  const currentSlide = slides[currentSlideIndex];

  return React.createElement(ThemeContext.Provider, { value: activeTheme },
    React.createElement('div', { className: 'relative' },
      // Container ascuns pentru randarea PDF
      React.createElement('div', { ref: pdfRenderContainerRef, className: 'absolute -top-[9999px] -left-[9999px] opacity-0' }),
      React.createElement(
        'div', { className: "w-[95vw] h-[95vh] bg-gray-200 shadow-2xl rounded-lg flex flex-col overflow-hidden border border-gray-400" },
        isSlideshowVisible && React.createElement(Slideshow, { slides, startIndex: currentSlideIndex, onClose: handleCloseSlideshow }),
        React.createElement(
          'header', { className: "bg-gray-100 h-8 flex items-center justify-between pl-2 pr-1 border-b border-gray-300 flex-shrink-0" },
          React.createElement('div', { className: "flex items-center space-x-2" },
            React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-orange-600", viewBox: "0 0 20 20", fill: "currentColor" }, React.createElement('path', { d: "M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" })),
            React.createElement('span', { className: "text-xs font-medium text-gray-800" }, "Prezentare1.pptx - PowerPoint Simulator")
          ),
          React.createElement('div', { className: "flex items-center" },
            React.createElement('button', { className: "p-2 hover:bg-gray-300 rounded-sm" }, React.createElement(MinimizeIcon, { className: "h-3 w-3" })),
            React.createElement('button', { className: "p-2 hover:bg-gray-300 rounded-sm" }, React.createElement(MaximizeIcon, { className: "h-3 w-3" })),
            React.createElement('button', { className: "p-2 hover:bg-red-500 hover:text-white rounded-sm" }, React.createElement(CloseIcon, { className: "h-3 w-3" }))
          )
        ),
        React.createElement(Ribbon, {
          onStartSlideshow: handleStartSlideshow, onAddSlide: handleAddSlide, onChangeLayout: handleChangeLayout, onApplyImageFilter: handleApplyImageFilter,
          onAddShape: handleAddShape, onSetTheme: handleSetTheme, onSetBackground: handleSetBackground, onSetTransition: handleSetTransition, themes: THEMES,
          onUndo: handleUndo, onRedo: handleRedo, canUndo: canUndo, canRedo: canRedo, onExportPdf: handleExportPdf
        }),
        React.createElement(
          'div', { className: "flex-grow flex flex-col overflow-hidden" },
          React.createElement('div', { className: 'flex-grow flex flex-row overflow-hidden'},
            React.createElement(SlidePanel, {
              slides: slides, currentSlideIndex: currentSlideIndex, onSelectSlide: handleSelectSlide,
              onDeleteSlide: handleDeleteSlide, onDuplicateSlide: handleDuplicateSlide, onReorderSlides: handleReorderSlides, onAddSlide: handleAddSlide
            }),
            React.createElement(EditorPanel, {
              slide: currentSlide, onUpdateSlide: handleUpdateSlide, onUpdateShapePosition: handleUpdateShapePosition
            }),
            React.createElement(ResourcePanel, { resources: RESOURCES })
          ),
          React.createElement(NotesPanel, {
            notes: currentSlide?.notes || '',
            onUpdateNotes: handleUpdateNotes
          })
        )
      )
    )
  );
};

export default PowerPointSimulator;