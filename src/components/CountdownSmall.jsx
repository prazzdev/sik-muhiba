import { useState, useEffect } from "react";

const CountdownSmall = ({ targetDate, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;
      if (distance < 0) {
        clearInterval(timer);
        onFinish();
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, onFinish]);

  return (
    <div className="flex gap-2 justify-center lg:justify-start">
      {[
        { v: timeLeft.days, l: "Hari" },
        { v: timeLeft.hours, l: "Jam" },
        { v: timeLeft.minutes, l: "Menit" },
        { v: timeLeft.seconds, l: "Detik" },
      ].map((t, i) => (
        <div
          key={i}
          className="flex flex-col items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-3 py-1 min-w-[60px]"
        >
          <span className="text-lg font-black text-white leading-none">
            {t.v}
          </span>
          <span className="text-[10px] font-medium text-white/60 uppercase">
            {t.l}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CountdownSmall;
