import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Start the server before all tests
beforeAll(() => server.listen());

// Reset handlers after each test to avoid test interference
afterEach(() => server.resetHandlers());

// Close the server after all tests
afterAll(() => server.close());
