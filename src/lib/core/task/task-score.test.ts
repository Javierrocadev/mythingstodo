import { describe, it, expect } from 'vitest';
import { scoreTask, sortTasksByScore } from './task-score';
import type { TaskData } from './task.types';

function makeTask(overrides: Partial<TaskData> = {}): TaskData {
  return {
    id: '1',
    urgency: 'TODAY',
    emotionalType: 'NORMAL',
    deadline: null,
    status: 'TODO',
    ...overrides,
  };
}

describe('scoreTask', () => {
  const now = new Date('2026-07-03T12:00:00Z');

  it('devuelve 60 para TODAY + NORMAL sin deadline', () => {
    expect(scoreTask(makeTask({ urgency: 'TODAY' }), now)).toBe(60);
  });

  it('devuelve 100 para NOW + NORMAL sin deadline', () => {
    expect(scoreTask(makeTask({ urgency: 'NOW' }), now)).toBe(100);
  });

  it('devuelve 20 para MARGIN + NORMAL sin deadline', () => {
    expect(scoreTask(makeTask({ urgency: 'MARGIN' }), now)).toBe(20);
  });

  it('suma modificador emocional SATISFYING (+10)', () => {
    expect(scoreTask(makeTask({ urgency: 'TODAY', emotionalType: 'SATISFYING' }), now)).toBe(70);
  });

  it('suma modificador emocional BORING (-5)', () => {
    expect(scoreTask(makeTask({ urgency: 'TODAY', emotionalType: 'BORING' }), now)).toBe(55);
  });

  it('suma modificador emocional DRAINING (+5)', () => {
    expect(scoreTask(makeTask({ urgency: 'TODAY', emotionalType: 'DRAINING' }), now)).toBe(65);
  });

  it('suma puntaje de deadline cuando es hoy (Math.ceil redondea a 1 día)', () => {
    const task = makeTask({ urgency: 'TODAY', deadline: new Date('2026-07-03T23:59:00Z') });
    expect(scoreTask(task, now)).toBe(60 + 35);
  });

  it('reduce puntaje de deadline cuanto más lejano', () => {
    const task = makeTask({ urgency: 'TODAY', deadline: new Date('2026-07-05T23:59:00Z') });
    expect(scoreTask(task, now)).toBe(60 + 25);
  });

  it('nunca da deadlineScore negativo', () => {
    const task = makeTask({ deadline: new Date('2027-07-03T12:00:00Z') });
    const score = scoreTask(task, now);
    expect(score).toBe(60);
  });
});

describe('sortTasksByScore', () => {
  const now = new Date('2026-07-03T12:00:00Z');

  it('ordena de mayor a menor puntaje', () => {
    const tasks = [
      makeTask({ id: 'a', urgency: 'MARGIN' }),
      makeTask({ id: 'b', urgency: 'NOW' }),
      makeTask({ id: 'c', urgency: 'TODAY' }),
    ];
    const sorted = sortTasksByScore(tasks, now);
    expect(sorted.map((t) => t.id)).toEqual(['b', 'c', 'a']);
  });

  it('no muta el array original', () => {
    const tasks = [
      makeTask({ id: 'a', urgency: 'MARGIN' }),
      makeTask({ id: 'b', urgency: 'NOW' }),
    ];
    const original = [...tasks];
    sortTasksByScore(tasks, now);
    expect(tasks).toEqual(original);
  });
});
