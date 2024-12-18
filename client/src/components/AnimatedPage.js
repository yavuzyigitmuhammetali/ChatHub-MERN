import React from 'react';
import { motion } from 'framer-motion';

const AnimatedPage = ({ children }) => {
    const animations = {
        initial: { opacity: 0, y: 50 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -50 }
    };

    return (
        
        <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={animations}
    transition={{ duration: 0.5 }}
    style={{ minHeight: '100vh' }}
>
    {children}
</motion.div>

    );
};

export default AnimatedPage;