
import * as React from 'react';

const Shape = ({ shape, onMouseDown }) => {
  // Stilul este calculat dinamic pe baza proprietăților formei.
  // `position: 'absolute'` este esențial pentru a permite plasarea liberă pe slide.
  const style = {
    position: 'absolute',
    left: `${shape.x}px`,
    top: `${shape.y}px`,
    width: `${shape.width}px`,
    height: `${shape.height}px`,
    backgroundColor: shape.color,
    borderRadius: shape.type === 'circle' ? '50%' : '4px',
    border: '2px solid rgba(0, 0, 0, 0.3)',
    cursor: 'grab',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const handleMouseDown = (e) => {
    onMouseDown(e, shape.id);
  };

  return React.createElement(
    'div',
    {
      style: style,
      onMouseDown: handleMouseDown,
      // Folosim onDoubleClick pentru o viitoare funcționalitate de editare a proprietăților formei
      onDoubleClick: (e) => {
        e.stopPropagation();
        alert(`Editare proprietăți pentru forma ${shape.type}`);
      }
    }
  );
};

export default Shape;
