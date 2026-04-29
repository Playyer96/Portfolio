/**
 * MSW (Mock Service Worker) Handlers
 *
 * Intercepts API requests during tests and returns mock data
 */

import { http, HttpResponse } from 'msw';
import { mockApiResponses } from './mocks';

const API_URL = process.env.REACT_APP_API_URL || 'https://portfolio-backend-lilac.vercel.app/api';

/**
 * API Request Handlers
 *
 * These handlers intercept network requests during tests
 * and return mock data instead of making real API calls
 */
export const handlers = [
  // GET /api/technologies
  http.get(`${API_URL}/technologies`, () => {
    return HttpResponse.json(mockApiResponses.technologies);
  }),

  // GET /api/projects
  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.json(mockApiResponses.projects);
  }),

  // GET /api/experiences
  http.get(`${API_URL}/experiences`, () => {
    return HttpResponse.json(mockApiResponses.experiences);
  }),

  // GET /api/about
  http.get(`${API_URL}/about`, () => {
    return HttpResponse.json(mockApiResponses.about);
  }),
];

/**
 * Error Handlers (for testing error states)
 */
export const errorHandlers = [
  http.get(`${API_URL}/technologies`, () => {
    return HttpResponse.error();
  }),

  http.get(`${API_URL}/projects`, () => {
    return HttpResponse.error();
  }),

  http.get(`${API_URL}/experiences`, () => {
    return HttpResponse.error();
  }),

  http.get(`${API_URL}/about`, () => {
    return HttpResponse.error();
  }),
];
