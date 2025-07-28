
import * as React from 'react';

const EvaluationModal = ({ result }) => {
    if (!result) return null;

    const { score, maxScore, summary, feedback } = result;

    const CorrectIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-green-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" })
    );

    const IncorrectIcon = () => React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 text-red-500", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
    );

    return React.createElement(
        'div',
        { className: "fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" },
        React.createElement(
            'div',
            { className: "bg-white rounded-lg shadow-2xl w-full max-w-lg mx-auto transform transition-all animate-fade-in" },
            React.createElement(
                'div',
                { className: 'text-center p-6 border-b border-gray-200' },
                React.createElement('h2', { className: 'text-2xl font-bold text-gray-800' }, 'Rezultatul Evaluării')
            ),
            React.createElement(
                'div',
                { className: 'py-8 text-center bg-gray-50' },
                React.createElement('span', { className: 'text-sm font-semibold text-gray-500 uppercase tracking-wider' }, 'SCOR FINAL'),
                React.createElement('div', { className: 'text-7xl font-bold text-gray-800 my-2' }, `${score} / ${maxScore}`)
            ),
            React.createElement(
                'div',
                { className: 'p-6 text-center' },
                React.createElement('p', { className: 'text-gray-600' }, summary)
            ),
            React.createElement(
                'div',
                { className: 'p-6 border-t border-gray-200 max-h-60 overflow-y-auto' },
                React.createElement(
                    'ul',
                    { className: 'space-y-3' },
                    feedback.map((item, index) =>
                        React.createElement(
                            'li',
                            { key: index, className: 'flex items-start space-x-3' },
                            React.createElement('div', { className: 'flex-shrink-0' }, item.status === 'correct' ? React.createElement(CorrectIcon, null) : React.createElement(IncorrectIcon, null)),
                            React.createElement(
                                'div',
                                { className: 'flex-1' },
                                React.createElement('span', { className: `font-semibold ${item.status === 'correct' ? 'text-green-600' : 'text-red-600'}`}, item.status === 'correct' ? '[CORECT]' : '[INCORECT]'),
                                React.createElement('span', { className: 'ml-2 text-gray-700' }, item.text)
                            )
                        )
                    )
                )
            )
        )
    );
};

export default EvaluationModal;
