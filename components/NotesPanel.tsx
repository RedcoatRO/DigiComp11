
import * as React from 'react';

const NotesPanel = ({ notes, onUpdateNotes }) => {
  // Stare locală pentru a controla valoarea din textarea.
  // Acest lucru previne re-randarea întregii aplicații la fiecare tastă apăsată.
  const [localNotes, setLocalNotes] = React.useState(notes);

  // Sincronizează starea locală atunci când slide-ul se schimbă.
  // Acest useEffect rulează de fiecare dată când prop-ul 'notes' (venit de la slide-ul curent) se modifică.
  React.useEffect(() => {
    setLocalNotes(notes);
  }, [notes]);

  const handleNotesChange = (e) => {
    setLocalNotes(e.target.value);
  };

  // Actualizează starea globală doar când utilizatorul termină de editat (la pierderea focusului).
  // Acesta este un model eficient pentru a reduce numărul de actualizări ale stării globale.
  const handleBlur = () => {
    if (localNotes !== notes) {
      onUpdateNotes(localNotes);
    }
  };

  return React.createElement(
    'div',
    {
      className: 'h-32 flex-shrink-0 bg-gray-100 border-t border-gray-300 flex flex-col',
      style: { resize: 'vertical', overflow: 'auto', minHeight: '5rem' } // Permite redimensionarea verticală
    },
    React.createElement(
      'label',
      {
        htmlFor: 'notes-textarea',
        className: 'text-xs font-semibold text-gray-600 px-3 py-1 bg-gray-200 border-b border-gray-300'
      },
      'Notițe pentru prezentator (vizibile doar pentru dvs.)'
    ),
    React.createElement('textarea', {
      id: 'notes-textarea',
      value: localNotes,
      onChange: handleNotesChange,
      onBlur: handleBlur,
      placeholder: 'Adăugați notițele aici...',
      className: 'w-full h-full p-3 text-sm bg-white focus:outline-none resize-none'
    })
  );
};

export default NotesPanel;
