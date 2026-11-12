import { act, fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import questions from '../public/data/questions.json';

jest.mock('axios', () => ({
  get: jest.fn(),
  isCancel: jest.fn(() => false),
}));

let navigateInTest;
const NavigationProbe = () => {
  navigateInTest = useNavigate();
  return null;
};

const openApp = async (path = '/') => {
  render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><NavigationProbe /><App /></MemoryRouter>);
  await waitForElementToBeRemoved(() => screen.queryByText('Đang tải câu hỏi...'));
};

beforeEach(() => {
  localStorage.clear();
  axios.get.mockResolvedValue({ data: questions });
});

afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const advance = (milliseconds) => act(() => { jest.advanceTimersByTime(milliseconds); });

const startGame = async () => {
  await openApp();
  fireEvent.change(screen.getByLabelText('Tên người chơi'), { target: { value: ' An ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
  expect(screen.getByText('3')).toBeInTheDocument();
  advance(1000);
  expect(screen.getByText('2')).toBeInTheDocument();
  advance(1000);
  expect(screen.getByText('1')).toBeInTheDocument();
  advance(1000);
  expect(screen.getByText('Câu 1/15 · Dễ')).toBeInTheDocument();
  expect(screen.getByText('Còn 15 giây')).toBeInTheDocument();
  expect(screen.getAllByText('0', { selector: 'b' })).toHaveLength(2);
};

test('lọc, sắp xếp và tìm kiếm kết hợp; mở và ẩn đáp án', async () => {
  await openApp('/questions');
  expect(screen.getByText('Có 18 câu hỏi')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Dự bị (3)' }));
  fireEvent.change(screen.getByLabelText('Sắp xếp'), { target: { value: 'hard' } });
  const rows = screen.getAllByRole('row').slice(1);
  expect(rows.map((row) => within(row).getAllByRole('cell')[0].textContent)).toEqual(['18', '17', '16']);
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: '??' } });
  expect(screen.getByText('Có 1 câu hỏi')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: questions[16].question }));
  expect(screen.queryByText(/Đáp án đúng/)).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Xem đáp án' }));
  expect(screen.getByText('B. null hoặc undefined (Đáp án đúng)')).toHaveClass('correct');
  fireEvent.click(screen.getByRole('button', { name: 'Ẩn đáp án' }));
  expect(screen.queryByText(/Đáp án đúng/)).not.toBeInTheDocument();
});

test('tìm kiếm không phân biệt chữ hoa thường', async () => {
  await openApp('/questions');
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: 'REACT' } });
  expect(screen.getByText('Có 3 câu hỏi')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Tìm kiếm'), { target: { value: 'mảng' } });
  expect(screen.getByText('Có 2 câu hỏi')).toBeInTheDocument();
});

test('báo lỗi khi không tải được dữ liệu', async () => {
  axios.get.mockRejectedValue(new Error('Lỗi mạng'));
  await openApp();
  expect(screen.getByRole('alert')).toHaveTextContent('Không tải được câu hỏi');
});

test.each([['/questions/0', 'Không tìm thấy câu hỏi'], ['/abc', '404 - Không tìm thấy trang']])('trang không tồn tại %s', async (path, message) => {
  await openApp(path);
  expect(screen.getByRole('heading', { name: message })).toBeInTheDocument();
  expect(screen.getByRole('navigation')).toBeInTheDocument();
});

test.each(['/play', '/result'])('chặn mở trực tiếp %s', async (path) => {
  await openApp(path);
  expect(await screen.findByLabelText('Tên người chơi')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Tên người chơi'), { target: { value: '   ' } });
  expect(screen.getByRole('button', { name: 'Bắt đầu' })).toBeDisabled();
});

test('chơi đủ 15 câu theo ví dụ trong đề được 2730 điểm và 3 sao', async () => {
  jest.useFakeTimers();
  await startGame();
  advance(2000);
  fireEvent.click(screen.getByRole('button', { name: 'B. <table>' }));
  expect(screen.getByText('+180 điểm')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'B. <table>' })).toHaveClass('correct');
  expect(screen.getAllByRole('button').every((button) => button.disabled)).toBe(true);
  advance(1000);
  expect(screen.getByText('Còn 13 giây')).toBeInTheDocument();
  advance(499);
  expect(screen.getByText('Câu 1/15 · Dễ')).toBeInTheDocument();
  advance(1);
  expect(screen.getByText('Câu 2/15 · Dễ')).toBeInTheDocument();
  expect(screen.getByText('Còn 15 giây')).toBeInTheDocument();
  expect(screen.getByText('180', { selector: 'b' })).toBeInTheDocument();
  expect(screen.getByText('1', { selector: 'b' })).toBeInTheDocument();
  advance(1000);
  fireEvent.click(screen.getByRole('button', { name: 'A. margin' }));
  expect(screen.getByRole('button', { name: 'A. margin' })).toHaveClass('wrong');
  expect(screen.getByRole('button', { name: 'B. padding' })).toHaveClass('correct');
  expect(screen.getByText('180', { selector: 'b' })).toBeInTheDocument();
  expect(screen.queryByText('+180 điểm')).not.toBeInTheDocument();
  advance(1500);
  advance(10000);
  expect(screen.getByText('Còn 5 giây')).toBeInTheDocument();
  expect(screen.getByRole('progressbar')).toHaveStyle({ backgroundColor: '#c0392b' });
  advance(5000);
  expect(screen.getByRole('button', { name: 'C. alt' })).toHaveClass('correct');
  expect(screen.getAllByRole('button').every((button) => button.disabled)).toBe(true);
  advance(1500);
  for (const question of questions.filter((q) => !q.reserve && q.id >= 4)) {
    advance(5000);
    fireEvent.click(screen.getAllByRole('button')[question.answer]);
    advance(1500);
  }
  expect(screen.getByRole('heading', { name: 'Xuất sắc! Bạn nhanh như chớp' })).toBeInTheDocument();
  expect(screen.getByText('2730')).toBeInTheDocument();
  expect(screen.getByText('Số câu trả lời đúng: 13/15')).toBeInTheDocument();
  expect(screen.getByText('★★★')).toBeInTheDocument();
  const rows = screen.getAllByRole('row');
  expect(rows).toHaveLength(16);
  expect(within(rows[2]).getAllByRole('cell')[1]).toHaveTextContent('A');
  expect(within(rows[3]).getAllByRole('cell')[1]).toHaveTextContent('—');
  expect(rows[2]).toHaveClass('wrong');
  expect(rows[3]).toHaveClass('wrong');

  act(() => navigateInTest(-1));
  expect(screen.getByLabelText('Tên người chơi')).toBeInTheDocument();
  expect(screen.queryByText('Chuẩn bị!')).not.toBeInTheDocument();
  act(() => navigateInTest(1));
  expect(screen.getByText('2730')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Chơi lại' }));
  expect(screen.getByText('3')).toBeInTheDocument();
  advance(1000);
  advance(1000);
  advance(1000);
  expect(screen.getByText('Câu 1/15 · Dễ')).toBeInTheDocument();
  expect(screen.getAllByText('0', { selector: 'b' })).toHaveLength(2);
});

test.each(['countdown', 'answering', 'revealed'])('rời trang lúc %s dọn toàn bộ timer', async (status) => {
  jest.useFakeTimers();
  const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  if (status !== 'countdown') {
    await startGame();
    if (status === 'revealed') fireEvent.click(screen.getByRole('button', { name: 'B. <table>' }));
  } else {
    await openApp();
    fireEvent.change(screen.getByLabelText('Tên người chơi'), { target: { value: 'An' } });
    fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu' }));
  }
  fireEvent.click(screen.getByRole('link', { name: 'Trang chủ' }));
  advance(30000);
  expect(screen.getByLabelText('Tên người chơi')).toBeInTheDocument();
  expect(jest.getTimerCount()).toBe(0);
  expect(consoleError).not.toHaveBeenCalled();
});
