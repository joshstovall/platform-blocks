import type { KnobMark } from '../types';
import { clamp } from './math';

export const normalizeMarks = (marks: KnobMark[] = [], min: number, max: number) => {
  if (!marks.length) return [] as KnobMark[];
  return marks
    .map((mark) => ({
      ...mark,
      value: clamp(mark.value, min, max),
    }))
    .sort((a, b) => a.value - b.value);
};

export const pickClosestMark = (value: number, marks: KnobMark[]) => {
  if (!marks.length) return value;
  let closest = marks[0].value;
  let diff = Math.abs(value - closest);
  for (let i = 1; i < marks.length; i += 1) {
    const markValue = marks[i].value;
    const nextDiff = Math.abs(value - markValue);
    if (nextDiff < diff) {
      closest = markValue;
      diff = nextDiff;
    }
  }
  return closest;
};

export const findClosestMarkEntry = (value: number, marks: KnobMark[]) => {
  if (!marks.length) return null;
  let closest = marks[0];
  let diff = Math.abs(value - closest.value);
  for (let i = 1; i < marks.length; i += 1) {
    const mark = marks[i];
    const nextDiff = Math.abs(value - mark.value);
    if (nextDiff < diff) {
      closest = mark;
      diff = nextDiff;
    }
  }
  return closest;
};
