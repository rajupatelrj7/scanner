import { Severity } from './types';

type SeverityStyle = {
  bg: string;
  text: string;
  border: string;
};

export const SEVERITY_STYLES: Record<Severity, SeverityStyle> = {
  Critical: {
    bg: 'bg-red-900/50',
    text: 'text-red-300',
    border: 'border-red-700',
  },
  High: {
    bg: 'bg-orange-900/50',
    text: 'text-orange-300',
    border: 'border-orange-700',
  },
  Medium: {
    bg: 'bg-yellow-900/50',
    text: 'text-yellow-300',
    border: 'border-yellow-700',
  },
  Low: {
    bg: 'bg-blue-900/50',
    text: 'text-blue-300',
    border: 'border-blue-700',
  },
  Informational: {
    bg: 'bg-gray-700/50',
    text: 'text-gray-300',
    border: 'border-gray-600',
  },
};
