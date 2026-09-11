import type { EducationEntry } from '@/types';

export const education: EducationEntry[] = [
  {
    institution: 'ICBT Campus',
    period: '2022 – 2026',
    credentials: [
      'BSc (Hons) Software Engineering — Second Upper',
      'Higher Diploma in Computing and Software Engineering',
    ],
    logo: '/images/education/icbt.png',
    completed: true,
  },
  {
    institution: 'Cardiff Metropolitan University',
    period: '2022 – 2026',
    credentials: ['BSc (Hons) Software Engineering (degree awarding body) — Second Upper'],
    logo: '/images/education/cardiff.png',
    completed: true,
  },
  {
    institution: 'Pearson',
    period: '2021',
    credentials: ['Diploma in English'],
    logo: '/images/education/pearson.png',
  },
  {
    institution: 'ESOFT Metro Campus',
    period: '2021',
    credentials: ['Diploma in English'],
    logo: '/images/education/esoft.png',
  },
  {
    institution: 'Sri Chandananda Buddhist College, Kandy',
    period: '2007 – 2021',
    credentials: ['G.C.E. (O/L) 2017', 'G.C.E. (A/L) 2021'],
    logo: '/images/education/scbck.png',
  },
];
