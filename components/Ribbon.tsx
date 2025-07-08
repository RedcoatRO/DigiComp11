
import * as React from 'react';
import { SlideshowIcon, NewSlideIcon, LayoutIcon, BoldIcon, ItalicIcon, UnderlineIcon, LinkIcon, TextColorIcon, AlignCenterIcon, AlignLeftIcon, AlignRightIcon, ImageIcon, RectangleIcon, CircleIcon, UndoIcon, RedoIcon, ExportPdfIcon } from './Icons';
import { SlideLayout } from '../types';

const Ribbon = (props) => {
  const { 
    onStartSlideshow, onAddSlide, onChangeLayout, onApplyImageFilter, 
    onAddShape, onSetTheme, onSetBackground, themes, onSetTransition,
    onUndo, onRedo, canUndo, canRedo, onExportPdf
  } = props;
  
  const [activeTab, setActiveTab] = React.useState('Acasă');
  const [isLayoutDropdownOpen, setLayoutDropdownOpen] = React.useState(false);

  const tabs = ['Acasă', 'Inserare', 'Design', 'Tranziții', 'Animații', 'Slide Show', 'Revizuire', 'Vizualizare'];

  const layouts = {
    [SlideLayout.TITLE]: 'Titlu și Subtitlu',
    [SlideLayout.IMAGE_WITH_CAPTION]: 'Imagine cu Descriere',
    [SlideLayout.MEDIA_WITH_TEXT]: 'Media cu Text'
  };
  
  const fonts = ['Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia', 'Comic Sans MS'];
  const fontSizes = [
      { name: 'Mic (10px)', value: '1' },
      { name: 'Normal (13px)', value: '2' },
      { name: 'Mediu (16px)', value: '3' },
      { name: 'Mare (18px)', value: '4' },
      { name: 'Foarte mare (24px)', value: '5' },
      { name: 'Extra (32px)', value: '6' },
      { name: 'Gigant (48px)', value: '7' },
  ];
  
  const imageFilters = {
      'Fără filtru': 'none',
      'Alb-negru': 'grayscale(100%)',
      'Sepia': 'sepia(100%)',
  };

  const transitions = {
    'Fade': 'fade',
    'Slide': 'slide',
    'Push': 'push',
  };

  const renderActiveTabContent = () => {
    const command = (cmd, val = null) => () => document.execCommand(cmd, false, val);
    const commandWithVal = (cmd) => (e) => document.execCommand(cmd, false, e.target.value);
    
    const handleLink = () => {
      const url = prompt("Introduceți URL-ul:");
      if (url) {
        document.execCommand('createLink', false, url);
      }
    };
    
    const [bgColor, setBgColor] = React.useState('#ffffff');
    const [bgImageUrl, setBgImageUrl] = React.useState('');

    switch (activeTab) {
      case 'Acasă':
        return React.createElement(
          'div', { className: "flex items-center space-x-6 px-4 h-full overflow-x-auto" },
          React.createElement('div', {className: "flex flex-col space-y-2 border-r pr-4"},
            React.createElement('span', {className: "text-xs text-gray-500 text-center"}, "Acțiuni"),
            React.createElement('div', {className: "flex items-center space-x-1"},
                React.createElement('button', { onClick: onUndo, disabled: !canUndo, className: "p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed" }, React.createElement(UndoIcon, { className: "h-5 w-5" })),
                React.createElement('button', { onClick: onRedo, disabled: !canRedo, className: "p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed" }, React.createElement(RedoIcon, { className: "h-5 w-5" })),
                React.createElement('button', { onClick: onExportPdf, className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(ExportPdfIcon, { className: "h-5 w-5" })),
            )
          ),
          React.createElement('div', {className: "flex items-center h-full border-r pr-4"},
            React.createElement('button', { onClick: onAddSlide, className: "flex flex-col items-center text-gray-700 hover:bg-gray-200 p-2 rounded h-full justify-center w-20" },
              React.createElement(NewSlideIcon, { className: "h-6 w-6" }),
              React.createElement('span', { className: "text-xs mt-1" }, "Slide nou")
            ),
            React.createElement('div', { className: "relative h-full flex items-center" },
              React.createElement('button', { onClick: () => setLayoutDropdownOpen(prev => !prev), className: "flex flex-col items-center text-gray-700 hover:bg-gray-200 p-2 rounded h-full justify-center w-20" },
                React.createElement(LayoutIcon, { className: "h-6 w-6" }),
                React.createElement('span', { className: "text-xs mt-1" }, "Layout")
              ),
              isLayoutDropdownOpen && React.createElement('div', { className: "absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 shadow-lg rounded z-10" },
                Object.entries(layouts).map(([key, name]) => 
                  React.createElement('button', { 
                    key, 
                    onClick: () => { onChangeLayout(key); setLayoutDropdownOpen(false); }, 
                    className: "w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  }, name)
                )
              )
            )
          ),
          React.createElement('div', {className: "flex flex-col space-y-2 border-r pr-4"},
            React.createElement('div', {className: "flex items-center space-x-1"},
              React.createElement('select', { onChange: commandWithVal('fontName'), className: "text-sm border border-gray-300 rounded-sm px-1" },
                fonts.map(font => React.createElement('option', { key: font, value: font }, font))
              ),
              React.createElement('select', { onChange: commandWithVal('fontSize'), className: "text-sm border border-gray-300 rounded-sm px-1" },
                fontSizes.map(size => React.createElement('option', { key: size.value, value: size.value }, size.name))
              )
            ),
            React.createElement('div', {className: "flex items-center space-x-1"},
              React.createElement('button', { onClick: command('bold'), className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(BoldIcon, { className: "h-5 w-5" })),
              React.createElement('button', { onClick: command('italic'), className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(ItalicIcon, { className: "h-5 w-5" })),
              React.createElement('button', { onClick: command('underline'), className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(UnderlineIcon, { className: "h-5 w-5" })),
              React.createElement('div', { className: "relative w-6 h-6" },
                React.createElement(TextColorIcon, {className: "h-5 w-5 text-gray-700"}),
                React.createElement('input', { type: 'color', className: "absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer", onChange: commandWithVal('foreColor') })
              )
            )
          ),
          React.createElement('div', {className: "flex flex-col space-y-2 border-r pr-4"},
              React.createElement('span', {className: "text-xs text-gray-500 text-center"}, "Paragraf"),
              React.createElement('div', {className: "flex items-center space-x-1"},
                  React.createElement('button', { onClick: command('justifyLeft'), className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(AlignLeftIcon, { className: "h-5 w-5" })),
                  React.createElement('button', { onClick: command('justifyCenter'), className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(AlignCenterIcon, { className: "h-5 w-5" })),
                  React.createElement('button', { onClick: command('justifyRight'), className: "p-1 hover:bg-gray-200 rounded" }, React.createElement(AlignRightIcon, { className: "h-5 w-5" })),
              )
          ),
          React.createElement('div', {className: "flex flex-col space-y-2"},
              React.createElement('span', {className: "text-xs text-gray-500 text-center"}, "Imagine"),
              React.createElement('div', {className: "flex items-center space-x-1"},
                  Object.entries(imageFilters).map(([name, value]) =>
                    React.createElement('button', { key: name, onClick: () => onApplyImageFilter(value), className: "text-xs p-1.5 border border-gray-300 hover:bg-gray-200 rounded"}, name)
                  )
              )
          )
        );
      case 'Inserare':
        return React.createElement(
            'div', { className: 'flex items-center space-x-6 px-4 h-full' },
            React.createElement('button', { onClick: handleLink, className: 'flex flex-col items-center text-gray-700 hover:bg-gray-200 p-2 rounded' },
                React.createElement(LinkIcon, { className: 'h-6 w-6' }),
                React.createElement('span', { className: 'text-xs mt-1' }, 'Link')
            ),
            React.createElement('div', { className: 'flex flex-col space-y-2 border-l pl-4 ml-2' },
                React.createElement('span', {className: 'text-xs text-gray-500 text-center'}, 'Forme'),
                React.createElement('div', {className: 'flex items-center space-x-2'},
                    React.createElement('button', { onClick: () => onAddShape('rectangle'), className: 'p-2 hover:bg-gray-200 rounded' }, React.createElement(RectangleIcon, { className: 'h-6 w-6' })),
                    React.createElement('button', { onClick: () => onAddShape('circle'), className: 'p-2 hover:bg-gray-200 rounded' }, React.createElement(CircleIcon, { className: 'h-6 w-6' })),
                )
            )
        );
      case 'Design':
        return React.createElement(
            'div', { className: 'flex items-center space-x-6 px-4 h-full' },
            React.createElement('div', { className: 'flex flex-col space-y-2 border-r pr-4'},
                React.createElement('span', {className: 'text-xs text-gray-500 text-center'}, 'Teme'),
                React.createElement('div', {className: 'flex items-center space-x-2'},
                    Object.values(themes).map((theme: any) => 
                        React.createElement('button', {
                            key: theme.name,
                            onClick: () => onSetTheme(theme.name),
                            className: 'w-16 h-12 rounded border-2 hover:border-blue-500',
                            style: { backgroundColor: theme.styles.slide.backgroundColor, color: theme.styles.slide.color }
                        }, React.createElement('span', {className: "text-xs"}, theme.name))
                    )
                )
            ),
            React.createElement('div', { className: 'flex flex-col space-y-2 border-r pr-4'},
                React.createElement('span', {className: 'text-xs text-gray-500 text-center mb-1'}, 'Fundal Slide'),
                 React.createElement('div', {className: 'flex items-center space-x-2'},
                    React.createElement('input', { type: 'color', value: bgColor, onChange: (e) => setBgColor(e.target.value), className: 'h-8 w-8' }),
                    React.createElement('button', { onClick: () => onSetBackground({ type: 'color', value: bgColor }, false), className: 'text-xs p-1.5 border border-gray-300 hover:bg-gray-200 rounded' }, 'Aplică'),
                    React.createElement('button', { onClick: () => onSetBackground({ type: 'color', value: bgColor }, true), className: 'text-xs p-1.5 border border-gray-300 hover:bg-gray-200 rounded' }, 'Aplică Tuturor')
                )
            ),
            React.createElement('div', { className: 'flex flex-col space-y-2'},
                React.createElement('span', {className: 'text-xs text-gray-500 text-center mb-1'}, 'Imagine Fundal (URL)'),
                 React.createElement('div', {className: 'flex items-center space-x-2'},
                    React.createElement('input', { type: 'text', placeholder: "https://...", value: bgImageUrl, onChange: (e) => setBgImageUrl(e.target.value), className: 'text-xs border border-gray-300 rounded px-2 py-1 w-32' }),
                    React.createElement('button', { onClick: () => onSetBackground({ type: 'image', value: `url(${bgImageUrl})` }, false), className: 'text-xs p-1.5 border border-gray-300 hover:bg-gray-200 rounded' }, 'Aplică'),
                    React.createElement('button', { onClick: () => onSetBackground({ type: 'image', value: `url(${bgImageUrl})` }, true), className: 'text-xs p-1.5 border border-gray-300 hover:bg-gray-200 rounded' }, 'Aplică Tuturor')
                )
            )
        );
      case 'Tranziții':
        return React.createElement(
            'div', { className: 'flex items-center space-x-4 px-4 h-full' },
            React.createElement('span', { className: 'text-sm text-gray-600' }, 'Efecte de tranziție:'),
            Object.entries(transitions).map(([name, value]) => 
                React.createElement('button', {
                    key: value,
                    onClick: () => onSetTransition(value),
                    className: 'px-4 py-2 text-sm border rounded-md hover:bg-gray-200'
                }, name)
            )
        );
      case 'Slide Show':
        return React.createElement(
          'div', { className: "flex items-center space-x-4 px-4" },
          React.createElement('button', { onClick: onStartSlideshow, className: "flex flex-col items-center text-gray-700 hover:bg-gray-200 p-2 rounded" },
            React.createElement(SlideshowIcon, { className: "h-8 w-8" }),
            React.createElement('span', { className: "text-xs" }, "De la început")
          )
        );
      default:
        return React.createElement('div', { className: "px-4 text-sm text-gray-500"}, `Uneltele pentru "${activeTab}" nu sunt implementate.`);
    }
  };

  return React.createElement(
    'div', { className: "bg-gray-100 border-b border-gray-300" },
    React.createElement(
      'div', { className: "flex space-x-1 px-2 pt-1" },
      tabs.map(tab =>
        React.createElement(
          'button',
          {
            key: tab,
            onClick: () => setActiveTab(tab),
            className: `px-3 py-1 text-sm rounded-t-md ${activeTab === tab ? 'bg-white border-x border-t border-gray-300 text-orange-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
          },
          tab
        )
      )
    ),
    React.createElement(
      'div', { className: "h-24 flex items-center bg-white border-t border-gray-300" },
      renderActiveTabContent()
    )
  );
};

export default Ribbon;