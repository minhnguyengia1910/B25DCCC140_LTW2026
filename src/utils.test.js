import { calcPoints, calcTotal, getStars } from './utils';
import questions from '../public/data/questions.json';

test('điểm mức độ và điểm tốc độ theo đề', () => {
  expect(calcPoints(questions[0], 13)).toBe(180);
  expect(calcPoints(questions[10], 3)).toBe(180);
  const answers = questions.filter((q) => !q.reserve).map((q) => ({ points: calcPoints(q, 10) }));
  expect(calcTotal(answers)).toBe(3000);
});

test('xếp sao tại các mốc 5, 9, 13 câu đúng', () => {
  expect([0, 4, 5, 8, 9, 12, 13, 15].map((count) => getStars(count).stars))
    .toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
});
