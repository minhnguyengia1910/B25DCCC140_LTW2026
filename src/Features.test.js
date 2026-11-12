import { act, fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import questions from '../public/data/questions.json';

jest.mock('axios', () => ({ get: jest.fn(), isCancel: jest.fn(() => false) }));

const openApp = async (path = '/') => {
  const view = render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
  await waitForElementToBeRemoved(() => screen.queryByText('Đang tải câu hỏi...'));
  return view;
};

const advance = (milliseconds) => act(() => { jest.advanceTimersByTime(milliseconds); });
const choose = (id, option = questions.find((item) => item.id === id).answer) => {
  fireEvent.click(screen.getAllByRole('button')[option]);
};
const finishQuestion = (id, option) => {
  choose(id, option);
  advance(1500);
};
const startGame = async () => {
  await openApp();
  fireEvent.change(screen.getByLabelText('Tên người chơi'), { target: { value: 'An' } });
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
  advance(1000);
  advance(1000);
  advance(1000);
};

beforeEach(() => {
  localStorage.clear();
  axios.get.mockResolvedValue({ data: questions });
});
afterEach(() => jest.useRealTimers());

test('trợ giúp theo ví dụ Bài 3, tiêu đề tab và lưu đúng một lượt', async () => {
  jest.useFakeTimers();
  await startGame();
  advance(7000);
  fireEvent.click(screen.getByRole('button', { name: 'Dừng giờ' }));
  advance(10000);
  expect(screen.getByText('Còn 8 giây (đã dừng)')).toBeInTheDocument();
  finishQuestion(1);
  expect(screen.getByText('Còn 15 giây')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Dừng giờ' })).toBeDisabled();
  finishQuestion(2, 0);
  for (let id = 3; id <= 5; id++) finishQuestion(id);
  fireEvent.click(screen.getByRole('button', { name: 'Nhân đôi' }));
  expect(screen.getByRole('button', { name: 'Đang nhân đôi' })).toBeDisabled();
  advance(6000);
  choose(6);
  expect(screen.getByText('+380 điểm')).toBeInTheDocument();
  advance(1500);
  expect(document.title).toBe('Câu 7/15 – đúng 5 câu');
  choose(7);
  expect(screen.getByText('+250 điểm')).toBeInTheDocument();
  advance(1500);
  for (let id = 8; id <= 11; id++) finishQuestion(id);
  advance(5000);
  fireEvent.click(screen.getByRole('button', { name: 'Đổi câu hỏi' }));
  expect(screen.getByText('Câu 12/15 · Khó')).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: questions[17].question })).toBeInTheDocument();
  expect(screen.getByText('Còn 15 giây')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Đổi câu hỏi' })).toBeDisabled();
  advance(4000);
  choose(18);
  expect(screen.getByText('+260 điểm')).toBeInTheDocument();
  advance(1500);
  for (let id = 13; id <= 15; id++) finishQuestion(id);
  expect(screen.getByText('Câu 12 (đổi sang câu 18)')).toBeInTheDocument();
  const saved = JSON.parse(localStorage.getItem('ltw_chop_history'));
  expect(saved).toHaveLength(1);
  expect(saved[0]).toMatchObject({ name: 'An', correctCount: 14, stars: 3 });
  expect(saved[0].playedAt).toBeTruthy();
  expect(document.title).toBe('Nhanh như chớp');
  fireEvent.click(screen.getByRole('link', { name: 'Về trang chủ' }));
  expect(screen.getByText(`Kỷ lục: ${saved[0].score} điểm – An`)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
  advance(1000);
  advance(1000);
  advance(1000);
  expect(screen.getByRole('button', { name: 'Dừng giờ' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Đổi câu hỏi' })).toBeEnabled();
  expect(screen.getByRole('button', { name: 'Nhân đôi' })).toBeEnabled();
});

test('phím mũi tên đúng lưới, Enter chọn, rời trang gỡ sự kiện', async () => {
  jest.useFakeTimers();
  await startGame();
  fireEvent.keyDown(window, { key: 'ArrowLeft' });
  fireEvent.keyDown(window, { key: 'ArrowUp' });
  expect(screen.getByRole('button', { name: 'A. <tab>' })).toHaveClass('pointed');
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: 'B. <table>' })).toHaveClass('pointed');
  fireEvent.keyDown(window, { key: 'ArrowDown' });
  expect(screen.getByRole('button', { name: 'D. <tr>' })).toHaveClass('pointed');
  fireEvent.keyDown(window, { key: 'ArrowDown' });
  fireEvent.keyDown(window, { key: 'ArrowRight' });
  expect(screen.getByRole('button', { name: 'D. <tr>' })).toHaveClass('pointed');
  fireEvent.keyDown(window, { key: 'Enter' });
  expect(screen.getByRole('button', { name: 'D. <tr>' })).toHaveClass('wrong');
  advance(1500);
  expect(screen.getByRole('button', { name: 'A. margin' })).toHaveClass('pointed');
  fireEvent.click(screen.getByRole('link', { name: 'Trang chủ' }));
  expect(fireEvent.keyDown(window, { key: 'Enter' })).toBe(true);
  expect(document.title).toBe('Nhanh như chớp');
  expect(jest.getTimerCount()).toBe(0);
});

test.each(['wrong', 'timeout'])('nhân đôi khi %s vẫn 0 điểm', async (mode) => {
  jest.useFakeTimers();
  await startGame();
  fireEvent.click(screen.getByRole('button', { name: 'Nhân đôi' }));
  if (mode === 'timeout') advance(15000);
  else choose(1, 0);
  expect(screen.queryByText(/\+\d+ điểm/)).not.toBeInTheDocument();
  expect(screen.getAllByText('0', { selector: 'b' })).toHaveLength(2);
  advance(1500);
  expect(screen.getByRole('button', { name: 'Nhân đôi' })).toBeDisabled();
  choose(2);
  expect(screen.getByText('+200 điểm')).toBeInTheDocument();
});

test('thống kê, xóa từng lượt và giữ lịch sử sau khi tải lại', async () => {
  localStorage.setItem('ltw_chop_history', JSON.stringify([
    { id: 1, name: 'An', score: 2730, correctCount: 13, stars: 3, playedAt: '1' },
    { id: 2, name: 'Bình', score: 1200, correctCount: 8, stars: 1, playedAt: '2' },
    { id: 3, name: 'Chi', score: 1980, correctCount: 11, stars: 2, playedAt: '3' },
  ]));
  const view = await openApp('/history');
  expect(screen.getByText('Số lượt chơi: 3')).toBeInTheDocument();
  expect(screen.getByText('Điểm trung bình: 1970')).toBeInTheDocument();
  expect(screen.getByText('Tỉ lệ trả lời đúng: 71%')).toBeInTheDocument();
  const rows = screen.getAllByRole('row').slice(1);
  expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual(['An', 'Chi', 'Bình']);
  fireEvent.click(within(rows[2]).getByRole('button', { name: 'Xóa' }));
  view.unmount();
  await openApp('/history');
  expect(screen.getByText('Số lượt chơi: 2')).toBeInTheDocument();
  expect(screen.getByText('Điểm trung bình: 2355')).toBeInTheDocument();
  expect(screen.getByText('Tỉ lệ trả lời đúng: 80%')).toBeInTheDocument();
  expect(screen.queryByText('Bình')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Xóa lịch sử' }));
  expect(screen.getByText('Chưa có lượt chơi nào.')).toBeInTheDocument();
  expect(screen.getByText('Điểm trung bình: 0')).toBeInTheDocument();
  expect(screen.getByText('Tỉ lệ trả lời đúng: 0%')).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem('ltw_chop_history'))).toEqual([]);
});

test('bằng điểm thì lượt có nhiều câu đúng đứng trước', async () => {
  localStorage.setItem('ltw_chop_history', JSON.stringify([
    { id: 1, name: 'An', score: 1200, correctCount: 7, stars: 1, playedAt: '1' },
    { id: 2, name: 'Bình', score: 1200, correctCount: 9, stars: 2, playedAt: '2' },
  ]));
  await openApp('/history');
  expect(within(screen.getAllByRole('row')[1]).getAllByRole('cell')[0]).toHaveTextContent('Bình');
});
