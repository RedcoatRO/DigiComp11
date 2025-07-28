
import * as React from 'react';
import PowerPointSimulator from './components/PowerPointSimulator';

const App = () => {
  return React.createElement(
    'main',
    {
      className: "h-screen w-screen bg-cover bg-center overflow-hidden",
      style: { backgroundImage: "url('https://picsum.photos/seed/windows11/1920/1080')" }
    },
    React.createElement(
      'div',
      { className: "flex items-center justify-center h-full w-full bg-black/10 backdrop-blur-sm" },
      React.createElement(PowerPointSimulator, null)
    ),
    React.createElement(
      'div',
      { className: "absolute bottom-0 left-0 right-0 h-12 bg-gray-100/80 backdrop-blur-lg flex items-center justify-between px-4" },
      /* Simulated Taskbar */
      React.createElement(
        'div',
        { className: "flex items-center" },
        React.createElement(
          'div',
          { className: "w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center" },
          React.createElement(
            'svg',
            { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-white", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
            React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h7" })
          )
        )
      ),
      /* Container for dynamic items from the simulator */
      React.createElement('div', { id: 'taskbar-items-container', className: 'flex-grow flex justify-end items-center space-x-4' })
    )
  );
};

export default App;