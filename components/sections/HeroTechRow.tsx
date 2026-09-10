'use client';

import { motion } from 'framer-motion';
import { skillGroups } from '@/data/skills';
import { staggerContainer } from '@/lib/motion';
import { useAppReady } from '@/components/providers/AppShell';
import { SkillChip } from './SkillChip';

/** Flattened, deduplicated tech pills — reuses the same SkillChip used in the Skills section. Gated on the loading screen finishing, not on scroll, since it's above the fold. */
export function HeroTechRow({ startDelayS = 0 }: { startDelayS?: number }) {
  const ready = useAppReady();
  const skills = [...new Set(skillGroups.flatMap((group) => group.skills))];

  return (
    <motion.ul
      initial="hidden"
      animate={ready ? 'visible' : 'hidden'}
      variants={staggerContainer(0.04, startDelayS)}
      className="mt-2 flex flex-wrap gap-2"
    >
      {skills.map((skill) => (
        <SkillChip key={skill} skill={skill} />
      ))}
    </motion.ul>
  );
}
