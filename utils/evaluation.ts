
import { ActionType } from '../types';

// Define the objectives for the PowerPoint exercise. Each objective has a checker function.
const OBJECTIVES = [
    {
        id: 'title',
        description: 'Ai adăugat un titlu pe primul slide.',
        points: 15,
        checker: (slides, actions) => {
            const titleHtml = slides[0]?.content.title?.html;
            return titleHtml && !titleHtml.includes('Click pentru a adăuga titlu') && titleHtml.trim() !== '';
        }
    },
    {
        id: 'all_content',
        description: 'Ai adăugat conținut pe toate slide-urile (fără text implicit).',
        points: 15,
        checker: (slides, actions) => slides.every(slide => {
            return Object.values(slide.content).some(contentItem => {
                const item = contentItem as any;
                if (item?.html) return !item.html.includes('Click pentru') && !item.html.includes('Adăugați o descriere') && !item.html.includes('Titlu nou');
                if (item?.src) return item.src !== '';
                return false;
            });
        })
    },
    {
        id: 'two_layouts',
        description: 'Ai folosit cel puțin două layout-uri diferite.',
        points: 10,
        checker: (slides, actions) => new Set(slides.map(s => s.layout)).size >= 2
    },
    {
        id: 'add_image',
        description: 'Ai adăugat o imagine pe un slide.',
        points: 15,
        checker: (slides, actions) => slides.some(s => s.content.image?.src)
    },
    {
        id: 'add_audio',
        description: 'Ai adăugat un fișier audio pe un slide.',
        points: 10,
        checker: (slides, actions) => slides.some(s => s.content.audio?.src)
    },
    {
        id: 'apply_theme',
        description: 'Ai aplicat o temă de design.',
        points: 10,
        checker: (slides, actions) => actions.some(a => a.type === ActionType.APPLY_THEME && a.payload !== 'Luminos')
    },
    {
        id: 'change_background',
        description: 'Ai personalizat fundalul unui slide.',
        points: 10,
        checker: (slides, actions) => slides.some(s => s.background?.value)
    },
    {
        id: 'add_shape',
        description: 'Ai adăugat o formă geometrică.',
        // Points adjusted from 5 to 10 to make the total max score 100.
        points: 10,
        checker: (slides, actions) => slides.some(s => s.shapes.length > 0)
    },
    {
        id: 'use_slideshow',
        description: 'Ai vizualizat prezentarea în modul Slide Show.',
        points: 5,
        checker: (slides, actions) => actions.some(a => a.type === ActionType.START_SLIDESHOW)
    }
];

const MAX_SCORE = OBJECTIVES.reduce((sum, obj) => sum + obj.points, 0);

/**
 * Calculates the user's score based on the final state of the slides and the actions performed.
 * @param {Array} slides - The array of slide objects.
 * @param {Array} actions - The log of user actions.
 * @returns {object} An object containing the score, max score, feedback, and summary.
 */
export const calculateScore = (slides, actions) => {
    let score = 0;
    const feedback = [];
    let tasksCompleted = 0;

    OBJECTIVES.forEach(obj => {
        if (obj.checker(slides, actions)) {
            score += obj.points;
            tasksCompleted++;
            feedback.push({ text: obj.description, status: 'correct' });
        } else {
            feedback.push({ text: obj.description, status: 'incorrect' });
        }
    });
    
    let summary = "Exercițiul s-a încheiat. Data viitoare, încearcă să folosești mai eficient uneltele de creare.";
    if (score > MAX_SCORE * 0.8) {
        summary = "Felicitări! Ai finalizat exercițiul cu succes și ai demonstrat o bună înțelegere a funcționalităților.";
    } else if (score > MAX_SCORE * 0.5) {
        summary = "Progress bun! Ai reușit să completezi majoritatea obiectivelor. Mai exersează pentru a atinge perfecțiunea.";
    }

    return {
        score: Math.min(score, 100),
        maxScore: MAX_SCORE,
        summary,
        feedback,
        tasksCompleted,
        totalTasks: OBJECTIVES.length
    };
};