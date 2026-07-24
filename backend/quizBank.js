/**
 * The 10-question cognitive assessment.
 *
 * IMPORTANT: this file lives only on the server. The public-facing route
 * (routes/quiz.js) strips `answer` before sending questions to the client,
 * so a participant cannot read the answer key from the network tab.
 *
 * Parts:
 *   1. simple_math   (3 questions)
 *   2. simple_word   (2 questions)
 *   3. complex_math  (3 questions)
 *   4. complex_word  (2 questions)
 */

const QUIZ_QUESTIONS = [
  // ---- Part 1: Simple mathematics (3) ----
  { id: 'sm1', part: 'simple_math', prompt: '14 + 27 = ?', choices: ['39', '41', '40', '42'], answer: '41' },
  { id: 'sm2', part: 'simple_math', prompt: '9 × 6 = ?', choices: ['54', '56', '52', '48'], answer: '54' },
  { id: 'sm3', part: 'simple_math', prompt: '81 ÷ 9 = ?', choices: ['8', '9', '7', '11'], answer: '9' },

  // ---- Part 2: Simple word problems (2) ----
  {
    id: 'sw1',
    part: 'simple_word',
    prompt: 'Maya has 3 bags with 5 apples each. How many apples does she have in total?',
    choices: ['15', '12', '8', '18'],
    answer: '15',
  },
  {
    id: 'sw2',
    part: 'simple_word',
    prompt: 'A movie starts at 3:15 PM and lasts 45 minutes. What time does it end?',
    choices: ['4:00 PM', '3:45 PM', '4:15 PM', '3:50 PM'],
    answer: '4:00 PM',
  },

  // ---- Part 3: Complex mathematics (3) ----
  { id: 'cm1', part: 'complex_math', prompt: 'Solve for x: 3x − 7 = 20', choices: ['9', '8', '7', '10'], answer: '9' },
  {
    id: 'cm2',
    part: 'complex_math',
    prompt: 'What is 15% of 240?',
    choices: ['36', '32', '40', '24'],
    answer: '36',
  },
  {
    id: 'cm3',
    part: 'complex_math',
    prompt: 'Simplify: (2^3) × (2^2)',
    choices: ['32', '16', '64', '8'],
    answer: '32',
  },

  // ---- Part 4: Complex word problems (2) ----
  {
    id: 'cw1',
    part: 'complex_word',
    prompt:
      'A train travels 240 miles in 4 hours at a constant speed. At that same speed, how long would it take to travel 360 miles?',
    choices: ['6 hours', '5 hours', '7 hours', '5.5 hours'],
    answer: '6 hours',
  },
  {
    id: 'cw2',
    part: 'complex_word',
    prompt:
      'A store marks up an item that costs $40 by 25%, then later applies a 20% discount to the marked-up price. What is the final price?',
    choices: ['$40.00', '$42.00', '$45.00', '$38.00'],
    answer: '$40.00',
  },
];

const PUBLIC_QUESTIONS = QUIZ_QUESTIONS.map(({ answer, ...rest }) => rest);

module.exports = { QUIZ_QUESTIONS, PUBLIC_QUESTIONS };
