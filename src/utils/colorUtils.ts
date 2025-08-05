import type { ColorRule } from '@/store/usePolygonStore';

const DEFAULT_COLOR = '#808080'; // Gray

export function getColorFromRules(value: number | null, rules: ColorRule[]): string {
  if (value === null || rules.length === 0) {
    return DEFAULT_COLOR;
  }

  // Separate rules by condition
  const gtRules = rules.filter(r => r.condition === 'gt').sort((a, b) => b.value - a.value); // descending
  const ltRules = rules.filter(r => r.condition === 'lt').sort((a, b) => a.value - b.value); // ascending
  const eqRules = rules.filter(r => r.condition === 'eq');

  // Check for exact equality first
  for (const rule of eqRules) {
    if (value === rule.value) return rule.color;
  }

  // Check greater than rules
  for (const rule of gtRules) {
    if (value > rule.value) return rule.color;
  }
  
  // Check less than rules
  for (const rule of ltRules) {
      if (value < rule.value) return rule.color;
  }

  return DEFAULT_COLOR;
}