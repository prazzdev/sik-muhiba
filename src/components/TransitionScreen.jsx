import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const TransitionScreen = ({ onComplete }) => {
  const messages = ["Alhamdu\nlillah", "Kamu Dinyatakan", "LULUS"];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const displayDuration = index === 2 ? 4000 : 2000;

    if (index < messages.length) {
      const timer = setTimeout(() => {
        setIndex(index + 1);
      }, displayDuration);
      return () => clearTimeout(timer);
    } else {
      const finalTimer = setTimeout(() => onComplete(), 500);
      return () => clearTimeout(finalTimer);
    }
  }, [index, onComplete, messages.length]);

  return (
    <div className="flex items-center justify-center min-h-[400px] text-center px-4 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.5, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: "backOut" }}
          className="flex flex-col items-center"
        >
          <h2
            className={`text-5xl md:text-8xl font-[1000] uppercase tracking-[-0.05em] leading-none transition-colors duration-500 ${
              index === 2
                ? "bg-green-600 text-white px-8 py-6 rounded-3xl shadow-[0_30px_60px_rgba(22,163,74,0.4)]"
                : "text-primary"
            }`}
          >
            {messages[index]}
          </h2>

          {index === 2 && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mt-8 text-green-600 font-black uppercase tracking-[0.4em] text-xs md:text-sm"
            >
              SMA Muhammadiyah 1 Banjarnegara
            </motion.p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TransitionScreen;
