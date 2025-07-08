
import * as React from 'react';
import { SlideLayout } from '../types';
import { ThemeContext } from './PowerPointSimulator';

const Slideshow = ({ slides, startIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(startIndex);
  // Stochează indexul anterior pentru a determina direcția tranziției
  const [prevIndex, setPrevIndex] = React.useState(null);
  const audioRef = React.useRef(null);
  const theme = React.useContext(ThemeContext);
  const isTransitioning = React.useRef(false);

  // Funcție pentru a gestiona schimbarea slide-ului, prevenind click-urile rapide
  const changeSlide = (newIndex) => {
    if (isTransitioning.current || newIndex === currentIndex) return;
    isTransitioning.current = true;
    setPrevIndex(currentIndex);
    setCurrentIndex(newIndex);
    // Debounce: Așteaptă terminarea animației CSS
    setTimeout(() => {
      isTransitioning.current = false;
      setPrevIndex(null); // Resetează indexul anterior după tranziție
    }, 500);
  };
  
  // Handlerele pentru evenimente
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        changeSlide(Math.min(currentIndex + 1, slides.length - 1));
      } else if (e.key === 'ArrowLeft') {
        changeSlide(Math.max(currentIndex - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    
    // Sincronizează ieșirea din fullscreen cu închiderea componentei
    const handleFullscreenChange = () => {
        if (!document.fullscreenElement) {
            onClose();
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, [slides.length, onClose, currentIndex]);

  // Gestionarea audio
  React.useEffect(() => {
    const currentSlide = slides[currentIndex];
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (currentSlide.content.audio?.src) {
      const audio = new Audio(currentSlide.content.audio.src);
      audioRef.current = audio;
      audio.play().catch(e => console.error("Audio play failed:", e));
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  }, [currentIndex, slides]);
  
  // Funcția principală de randare a unui slide
  const renderSlideContent = (slide) => {
    const slideStyle = {
        backgroundColor: slide.background?.value && slide.background.type === 'color' ? slide.background.value : theme.styles.slide.backgroundColor,
        backgroundImage: slide.background?.value && slide.background.type === 'image' ? slide.background.value : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: theme.styles.slide.color,
    };
    
    switch (slide.layout) {
      case SlideLayout.TITLE:
        return React.createElement('div', { className: "w-full h-full flex flex-col justify-center items-center text-center p-16", style: slideStyle },
          React.createElement('h1', { className: "text-7xl font-bold drop-shadow-lg", dangerouslySetInnerHTML: { __html: slide.content.title?.html } }),
          React.createElement('p', { className: "text-4xl mt-6 drop-shadow-md", dangerouslySetInnerHTML: { __html: slide.content.subtitle?.html } })
        );
      case SlideLayout.IMAGE_WITH_CAPTION:
        return React.createElement('div', { className: "w-full h-full flex flex-col justify-center items-center p-8", style: slideStyle },
          React.createElement('div', { className: "flex-grow w-full flex items-center justify-center" },
            slide.content.image?.src && React.createElement('img', { src: slide.content.image.src, alt: slide.content.image.alt, className: "max-w-full max-h-full object-contain drop-shadow-2xl", style: { filter: slide.content.image.filter || 'none' } })
          ),
          React.createElement('p', { className: "text-2xl mt-4 bg-black/50 p-2 rounded", dangerouslySetInnerHTML: { __html: slide.content.caption?.html } })
        );
      case SlideLayout.MEDIA_WITH_TEXT:
        return React.createElement('div', { className: "w-full h-full flex flex-col justify-center items-center p-8", style: slideStyle },
          React.createElement('h2', { className: "text-5xl font-bold drop-shadow-lg mb-4", dangerouslySetInnerHTML: { __html: slide.content.title?.html } }),
          React.createElement('div', { className: "flex-grow w-full flex items-center justify-center" },
            slide.content.image?.src && React.createElement('img', { src: slide.content.image.src, alt: slide.content.image.alt, className: "max-w-full max-h-[80vh] object-contain drop-shadow-2xl", style: { filter: slide.content.image.filter || 'none' } })
          )
        );
      default:
        return null;
    }
  };
  
  // Logica pentru a determina clasele de animație
  const getAnimationClasses = (slide, slideIndex) => {
      const transitionType = slide.transition || 'fade';
      const isCurrent = slideIndex === currentIndex;
      const isPrev = slideIndex === prevIndex;
      const isForward = prevIndex !== null && currentIndex > prevIndex;
      
      if (!isCurrent && !isPrev) return 'hidden';

      if (transitionType === 'fade') {
          return isCurrent ? 'animate-fade-in' : 'hidden';
      }

      if (transitionType === 'slide') {
          if (isCurrent) return isForward ? 'animate-slide-in-from-right' : 'animate-slide-in-from-left';
          if (isPrev) return isForward ? 'animate-slide-out-to-left' : 'animate-slide-out-to-right';
      }
      
      // Pentru 'push', nu folosim clase individuale, ci un container
      if (transitionType === 'push') {
          return 'push-slide';
      }

      return 'hidden'; // Fallback
  };

  const transitionType = slides[currentIndex].transition;
  
  // Container special pentru tranziția 'push'
  if (transitionType === 'push' && prevIndex !== null) {
      const isForward = currentIndex > prevIndex;
      const transformStyle = {
          transform: isForward ? `translateX(-50%)` : `translateX(0%)`
      };
      // Asigură ordinea corectă a slide-urilor în container
      const slideOrder = isForward ? [slides[prevIndex], slides[currentIndex]] : [slides[currentIndex], slides[prevIndex]];

      return React.createElement('div', { className: "fixed inset-0 bg-black z-50 overflow-hidden" },
        React.createElement('div', { className: 'push-transition-container', style: transformStyle },
            slideOrder.map((slide, i) => React.createElement('div', { key: slide.id + i, className: 'push-slide h-full w-full' }, renderSlideContent(slide)))
        ),
        React.createElement('button', { onClick: onClose, className: "absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10" }, "×"),
        React.createElement('div', { className: "absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg z-10" }, `${currentIndex + 1} / ${slides.length}`)
      );
  }

  // Randare pentru tranzițiile 'fade' și 'slide'
  return React.createElement('div', { className: "fixed inset-0 bg-black z-50" },
    React.createElement('button', { onClick: onClose, className: "absolute top-4 right-4 text-white text-3xl font-bold hover:text-gray-300 z-10" }, "×"),
    slides.map((slide, index) => 
        React.createElement('div', { 
            key: slide.id, 
            className: `absolute inset-0 ${getAnimationClasses(slide, index)}`
        }, renderSlideContent(slide))
    ),
    React.createElement('div', { className: "absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-lg" },
      `${currentIndex + 1} / ${slides.length}`
    )
  );
};

export default Slideshow;
