
import * as React from 'react';
import { FileTextIcon, ImageIcon, MusicIcon } from './Icons';

// A map to associate icon names from the constants file with the actual React components.
// This is the correct place for this view-related logic.
const ICONS = {
    FileTextIcon: React.createElement(FileTextIcon, { className: "h-6 w-6 text-blue-500" }),
    ImageIcon: React.createElement(ImageIcon, { className: "h-6 w-6 text-green-500" }),
    MusicIcon: React.createElement(MusicIcon, { className: "h-6 w-6 text-purple-500" })
};

const ResourceItem = ({ resource }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(resource));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return React.createElement(
    'div',
    {
      draggable: true,
      onDragStart: handleDragStart,
      className: "flex items-center space-x-3 p-3 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg cursor-grab active:cursor-grabbing shadow-sm transition-all duration-150"
    },
    // Use the map to look up the correct icon component based on the string name
    ICONS[resource.iconName],
    React.createElement('span', { className: "text-sm font-medium text-gray-800" }, resource.name)
  );
};


const ResourcePanel = ({ resources }) => {
  return React.createElement(
    'div',
    { className: "w-64 bg-gray-50 border-l border-gray-300 p-4 flex flex-col space-y-4" },
    React.createElement('h3', { className: "text-lg font-semibold text-gray-800 border-b pb-2" }, "Resurse Disponibile"),
    React.createElement(
      'div',
      { className: "flex flex-col space-y-3" },
      resources.map(res => React.createElement(ResourceItem, { key: res.id, resource: res }))
    ),
    React.createElement(
      'div',
      { className: "mt-auto p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-xs text-yellow-800" },
      React.createElement('p', null, React.createElement('strong', null, "Instrucțiuni:"), " Trageți și plasați resursele de mai sus în zonele corespunzătoare de pe slide-uri.")
    )
  );
};

export default ResourcePanel;
