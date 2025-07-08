
// Enums are replaced with plain JavaScript objects for browser compatibility.
export const ResourceType = {
  TEXT: 'text',
  IMAGE: 'image',
  AUDIO: 'audio',
};

export const SlideLayout = {
  TITLE: 'title',
  IMAGE_WITH_CAPTION: 'image_with_caption',
  MEDIA_WITH_TEXT: 'media_with_text',
};

// Interfaces have been removed as they are TypeScript-specific syntax
// and cause errors when the code is run directly in a browser without a build step.

// The type definitions below are for documentation and clarity.
// They are not used for type checking in the browser environment.

/*
export interface ShapeObject {
  id: string;
  type: 'rectangle' | 'circle';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

export interface Slide {
  id: string;
  layout: string;
  background: {
    type: 'color' | 'image';
    value: string;
  };
  content: {
    title?: { html: string };
    subtitle?: { html: string };
    caption?: { html: string };
    image?: { src: string; alt: string; filter: string };
    audio?: { src: string; autoplay: boolean };
  };
  shapes: ShapeObject[];
  notes: string;
  transition: string; // "fade", "slide", "push"
}

export interface Theme {
  name: string;
  styles: {
    app: {
      backgroundColor: string;
    };
    slide: {
      backgroundColor: string;
      color: string;
    };
    ribbon: {
      backgroundColor: string;
      color: string;
    }
  }
}
*/