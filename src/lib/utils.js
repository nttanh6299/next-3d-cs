import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';
import config from '../../tailwind.config';

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': Object.keys(config.theme.extend.fontSize).map((key) => `text-${key}`),
    },
  },
});

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
