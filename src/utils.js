import { BONUS_PER_SECOND, POINTS, STARS } from './data';

export const calcPoints = (question, timeLeft) => POINTS[question.level] + timeLeft * BONUS_PER_SECOND;

export const calcTotal = (answers) => answers.reduce((total, answer) => total + answer.points, 0);

export const getStars = (correctCount) => STARS.find((item) => correctCount >= item.min);
