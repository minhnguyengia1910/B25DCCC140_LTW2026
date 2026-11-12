import { fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';
import questions from '../public/data/questions.json';

jest.mock('axios', () => ({
  get: jest.fn(),
  isCancel: jest.fn(() => false),
}));

const openApp = async (path = '/') => {
  render(<MemoryRouter initialEntries={[path]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><App /></MemoryRouter>);
  await waitForElementToBeRemoved(() => screen.queryByText('Đang tải câu hỏi...'));
};

beforeEach(() => {
  axios.get.mockResolvedValue({ data: questions });
});

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
