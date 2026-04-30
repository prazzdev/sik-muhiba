import { useState, useEffect } from "react";

const Countdown = ({ targetDate, onFinish }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    finished: false,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft((prev) => ({ ...prev, finished: true }));
        if (onFinish) onFinish();
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
          finished: false,
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (timeLeft.finished) return null;

  return (
    <div className="flex gap-4 justify-center py-8">
      {[
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds },
      ].map((item, index) => (
        <div
          key={index}
          className="glass-card p-4 min-w-[80px] text-center border-secondary/50"
        >
          <div className="text-3xl font-bold text-white">{item.value}</div>
          <div className="text-xs uppercase tracking-wider text-secondary">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
