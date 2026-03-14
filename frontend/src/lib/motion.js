export const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
};

export const pageTransition = {
  duration: 0.3,
  ease: [0.25, 0.1, 0.25, 1],
};

export const listContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export const listItem = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } },
};
