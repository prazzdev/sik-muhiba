import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase";
import CheckForm from "../components/CheckForm";
import ResultSection from "../components/ResultSection";
import { Clock, ShieldAlert, Info, ArrowLeft, Fingerprint } from "lucide-react";
import { Link } from "react-router-dom";

// KOMPONEN COUNTDOWN LENGKAP
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

const CheckPage = () => {
  const [studentData, setStudentData] = useState(null);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [targetDate, setTargetDate] = useState(null);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error: configError } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "announcement_date")
        .single();

      if (data && !configError) {
        setTargetDate(data.value);
        if (new Date().getTime() >= new Date(data.value).getTime()) {
          setIsTimeUp(true);
        }
      }
    };
    fetchConfig();
  }, []);

  const handleSearchLogic = async (nisn, birthDate) => {
    setLoading(true);
    setError("");
    try {
      const { data, error: fetchError } = await supabase
        .from("students")
        .select("*, student_grades(*)")
        .eq("nisn", nisn)
        .eq("birth_date", birthDate)
        .single();

      if (fetchError || !data) {
        setError(
          "Data tidak ditemukan. Pastikan NISN dan Tanggal Lahir sesuai.",
        );
        setStudentData(null);
      } else {
        setStudentData(data);
      }
    } catch (err) {
      setError("Gagal menghubungkan ke server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-sans">
      {/* LEFT PANEL: Branding & Info - DIPAKSA 100VH PADA MOBILE */}
      <div className="w-full h-screen lg:h-auto lg:w-[400px] bg-primary p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden shrink-0">
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-secondary/20 rounded-full blur-[100px]" />

        <div className="relative z-10">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-secondary mb-12 transition-colors group text-sm font-bold"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-all"
            />
            Beranda
          </Link>

          <div className="flex items-center gap-4 mb-8">
            <img
              src="https://www.smamuh1bara.sch.id/images/muhiba-logo.webp"
              alt="Logo Muhiba"
              className="w-10 h-10 object-contain"
            />
            <div>
              <h1 className="text-2xl font-black tracking-tighter leading-none uppercase">
                Muhiba
              </h1>
              <p className="text-[10px] font-bold tracking-[0.2em] opacity-60 uppercase mt-1">
                Portal Kelulusan
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-[1000] leading-tight tracking-tighter uppercase">
              {studentData ? "Hasil Pengumuman" : "Cek Kelulusan Siswa 2026"}
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Silakan masukkan NISN dan Tanggal Lahir sesuai dengan data Dapodik
              SMA Muhammadiyah 1 Banjarnegara.
            </p>

            {/* PETUNJUK SCROLL KHUSUS MOBILE */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="lg:hidden flex flex-col gap-2 pt-4"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="w-5 h-8 border-2 border-secondary/50 rounded-full flex justify-center p-1"
                >
                  <div className="w-1 h-1 bg-secondary rounded-full" />
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary animate-pulse">
                  Scroll Down to Check
                </span>
              </div>
            </motion.div>

            {!isTimeUp && targetDate && (
              <div className="pt-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-3">
                  Waktu Tersisa:
                </p>
                <CountdownSmall
                  targetDate={targetDate}
                  onFinish={() => setIsTimeUp(true)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="relative z-10 mt-12 pt-8 border-t border-white/10">
          <div className="flex items-center gap-3 text-white/50">
            <Info size={16} />
            <p className="text-[10px] font-medium leading-relaxed">
              Mengalami kendala? Hubungi IT Support Sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Form/Result - DIPAKSA 100VH PADA MOBILE */}
      <main className="w-full min-h-screen lg:h-auto flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative bg-[#F8FAFC] overflow-y-auto">
        <div className="w-full max-w-xl py-8">
          <AnimatePresence mode="wait">
            {!isTimeUp ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto border-2 border-primary/10">
                  <Clock size={40} className="text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-primary uppercase italic tracking-tighter">
                  Akses Belum Dibuka
                </h3>
                <p className="text-slate-500 mt-2 font-medium">
                  Halaman ini akan otomatis diperbarui saat waktu pengumuman
                  tiba.
                </p>
              </motion.div>
            ) : !studentData ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                  <Fingerprint size={120} />
                </div>
                <div className="mb-10 relative z-10 text-center lg:text-left">
                  <h3 className="text-3xl font-[1000] text-primary uppercase tracking-tight">
                    Masuk ke Sistem
                  </h3>
                  <p className="text-slate-400 text-sm font-medium mt-1">
                    Gunakan kredensial resmi Anda.
                  </p>
                </div>
                <div className="relative z-10">
                  <CheckForm onSearch={handleSearchLogic} loading={loading} />
                </div>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-8 p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-700 text-xs font-bold shadow-sm"
                  >
                    <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full"
              >
                <ResultSection
                  data={studentData}
                  onBack={() => setStudentData(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default CheckPage;
