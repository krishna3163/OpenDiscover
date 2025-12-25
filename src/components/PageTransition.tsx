import React from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20
    },
    in: {
        opacity: 1,
        y: 0
    },
    out: {
        opacity: 0,
        y: -20
    }
};

const pageTransition = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.3
} as const;

export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            style={{ width: '100%' }}
        >
            {children}
        </motion.div>
    );
};
