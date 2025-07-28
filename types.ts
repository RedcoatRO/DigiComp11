
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

// New types for Evaluation System
export const ActionType = {
    ADD_SLIDE: 'ADD_SLIDE',
    CHANGE_LAYOUT: 'CHANGE_LAYOUT',
    APPLY_THEME: 'APPLY_THEME',
    SET_BACKGROUND: 'SET_BACKGROUND',
    ADD_SHAPE: 'ADD_SHAPE',
    START_SLIDESHOW: 'START_SLIDESHOW',
    FORMAT_TEXT: 'FORMAT_TEXT',
    DROP_RESOURCE: 'DROP_RESOURCE',
    UPDATE_TEXT: 'UPDATE_TEXT',
    DELETE_SLIDE: 'DELETE_SLIDE',
};


// The type definitions below are for documentation and clarity.
// They are not used for type checking in the browser environment.

/*
export interface ActionLogEntry {
  type: string; // one of ActionType
  payload?: any;
  timestamp: number;
}

export interface EvaluationFeedback {
    text: string;
    status: 'correct' | 'incorrect';
}

export interface EvaluationResult {
    score: number;
    maxScore: number;
    summary: string;
    feedback: EvaluationFeedback[];
    tasksCompleted: number;
    totalTasks: number;
}

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