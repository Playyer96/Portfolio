/**
 * MSW Server Setup for Tests
 *
 * Configures and exports the mock service worker server
 * This server intercepts network requests during tests
 */

import { setupServer } from 'msw/node';
import { handlers } from './msw-handlers';

/**
 * Mock Server Instance
 *
 * Use this in tests to start/stop the mock API server
 *
 * @example
 * ```tsx
 * import { server } from '../test-utils/server';
 *
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 */
export const server = setupServer(...handlers);
