
import * as React from 'react';

const ContextMenu = ({ x, y, items, onClose }) => {
  // Stilul este calculat pentru a poziționa meniul la coordonatele cursorului.
  const style = {
    top: `${y}px`,
    left: `${x}px`,
  };

  // Previne închiderea meniului la click pe un item.
  const handleItemClick = (e, action) => {
    e.stopPropagation();
    action();
    onClose();
  };

  return React.createElement(
    'div',
    {
      style: style,
      className: 'absolute z-20 w-48 bg-white border border-gray-300 rounded-md shadow-lg py-1'
    },
    items.map((item, index) =>
      React.createElement(
        'button',
        {
          key: index,
          onClick: (e) => handleItemClick(e, item.action),
          className: `w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${item.className || ''}`
        },
        item.label
      )
    )
  );
};

export default ContextMenu;
