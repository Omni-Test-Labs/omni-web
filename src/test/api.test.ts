import { describe, it, expect, beforeAll, vi } from 'vitest';
import { apiConfig } from '../config/api';

vi.mock('axios');

describe('ApiService', () => {
  beforeAll(() => {
    expect.extend({});
  });

  it('should have baseURL configured', () => {
    expect(apiConfig.prefix).toBeDefined();
    expect(apiConfig.prefix).toBe('http://localhost:8000');
  });
});
