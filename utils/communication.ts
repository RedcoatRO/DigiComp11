
/**
 * Constructs an evaluation result object and sends it to the parent window.
 * This is used for grading and external communication.
 * @param {number} score - The score obtained by the user.
 * @param {number} maxScore - The maximum possible score.
 * @param {string} details - A string containing concatenated feedback.
 * @param {number} tasksCompleted - The number of completed tasks.
 * @param {number} totalTasks - The total number of tasks.
 */
export const sendEvaluationResult = (score, maxScore, details, tasksCompleted, totalTasks) => {
    const resultObject = {
        type: 'evaluationResult', // Mandatory type field
        score: score,
        maxScore: maxScore,
        details: details,
        tasksCompleted: tasksCompleted,
        totalTasks: totalTasks,
        extractedText: `Scor: ${score}/${maxScore}. Detalii: ${details}`,
        timestamp: new Date().toISOString()
    };

    // Send the object to the parent window
    if (window.parent) {
        window.parent.postMessage(resultObject, '*');
    }

    // Log the object to the console for debugging
    console.log('Trimit rezultat:', resultObject);
};
