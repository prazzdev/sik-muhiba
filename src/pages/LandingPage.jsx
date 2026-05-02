import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Zap,
  GraduationCap,
  Asterisk,
  Globe,
  Clock,
  Plus,
  CheckCircle,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const CountdownKinetic = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!targetDate) return;
    const timer = setInterval(() => {
      const distance = new Date(targetDate).getTime() - new Date().getTime();
      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
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
  }, [targetDate]);

  return (
    <div className="flex flex-wrap gap-6 md:gap-8 text-primary">
      {[
        { v: timeLeft.days, l: "D" },
        { v: timeLeft.hours, l: "H" },
        { v: timeLeft.minutes, l: "M" },
        { v: timeLeft.seconds, l: "S" },
      ].map((t, i) => (
        <div key={i} className="flex items-baseline gap-1 group">
          <span className="text-4xl md:text-6xl font-[1000] tracking-tighter leading-none">
            {t.v.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] font-black opacity-30">{t.l}</span>
        </div>
      ))}
    </div>
  );
};

const LandingPage = () => {
  const [targetDate, setTargetDate] = useState(null);
  const [photosRow1, setPhotosRow1] = useState([]);
  const [photosRow2, setPhotosRow2] = useState([]);

  useEffect(() => {
    const fetchConfig = async () => {
      const { data, error } = await supabase
        .from("site_settings")
        .select("value")
        .eq("key", "announcement_date")
        .single();
      if (data && !error) setTargetDate(data.value);
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    const fetchStudentPhotos = async () => {
      // Baris 1: SELURUH SISWA (Semua Kelas), Abjad A-Z
      const { data: allRow1 } = await supabase
        .from("students")
        .select("photo_url, full_name")
        .not("photo_url", "is", null)
        .order("full_name", { ascending: true });

      // Baris 2: SELURUH SISWA (Semua Kelas), Abjad Z-A
      const { data: allRow2 } = await supabase
        .from("students")
        .select("photo_url, full_name")
        .not("photo_url", "is", null)
        .order("full_name", { ascending: false });

      if (allRow1) setPhotosRow1(allRow1);
      if (allRow2) setPhotosRow2(allRow2);
    };

    fetchStudentPhotos();
  }, []);

  return (
    <div className="min-h-screen relative bg-canvas px-6 md:px-12 pb-24 text-primary font-sans">
      {/* NAVIGATION */}
      <nav className="fixed top-0 left-0 w-full z-50 px-4 md:px-12 h-24 flex items-center justify-between pointer-events-none">
        <img
          src="https://www.smamuh1bara.sch.id/images/muhiba-logo.webp"
          className="w-10 h-10 md:w-12 md:h-12 pointer-events-auto object-contain"
          alt="Logo Muhiba"
        />
        <Link to="/cek" className="pointer-events-auto">
          <button className="bg-primary text-canvas px-5 md:px-8 py-2.5 md:py-3 rounded-full font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-brand-yellow hover:text-primary transition-all border-2 border-primary whitespace-nowrap">
            CEK KELULUSAN
          </button>
        </Link>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-40 md:pt-48">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Title (Left) */}
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs font-black tracking-[0.5em] mb-8 flex items-center gap-4 opacity-60 uppercase"
            >
              <Asterisk
                size={16}
                className="animate-spin-slow text-brand-blue"
              />
              {/* Official_Graduation_Portal*/}
              Sistem Informasi Kelulusan
            </motion.p>
            {/* <h1 className="text-huge mb-16 md:mb-20 !leading-[0.9] tracking-[-0.05em]">
              FUTURE <br />
              <span className="text-brand-blue inline-block my-2">IS</span>{" "}
              <br />
              <span className="inline-block relative">
                CALLING
                <motion.div
                  className="absolute -right-16 md:-right-20 top-2 text-brand-yellow"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Plus size={56} strokeWidth={4} />
                </motion.div>
              </span>
            </h1>*/}
            <h1 className="text-[22vw] md:text-[12vw] mb-12 md:mb-20 !leading-[0.8] md:!leading-[0.8] tracking-[-0.07em] md:tracking-[0.02em] uppercase font-[1000]">
              FUTURE <br />
              <span className="text-brand-blue inline-block my-0 md:my-2">
                IS
              </span>{" "}
              <br />
              <span className="inline-block relative">
                CALLING
                <motion.div
                  className="absolute -right-4 min-md:-right-32 -top-10 min-md:top-2 md:top-4 text-brand-yellow"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Plus
                    className="w-[40px] h-[40px] md:w-[56px] md:h-[56px]"
                    strokeWidth={4}
                  />
                </motion.div>
              </span>
            </h1>
          </div>

          {/* Top Right Panel (Countdown + Bio) */}
          <div className="lg:col-span-5 flex flex-col gap-10 lg:pl-12">
            {/* Dynamic Countdown Box */}
            <div className="bg-white border-2 border-primary p-8 rounded-[2.5rem] shadow-[8px_8px_0px_0px_rgba(26,26,26,1)]">
              <h2 className="text-[10px] font-black tracking-[0.4em] opacity-40 mb-6 uppercase italic flex items-center gap-2">
                <Clock size={12} /> HITUNG MUNDUR PENGUMUMAN
              </h2>
              {targetDate ? (
                <CountdownKinetic targetDate={targetDate} />
              ) : (
                <div className="h-12 flex items-center font-black opacity-10 italic uppercase">
                  Sync_Clock...
                </div>
              )}
            </div>

            {/* Editorial Bio */}
            <div className="border-l-4 border-primary pl-8">
              <p className="text-xl font-bold leading-tight mb-8 italic text-primary/80">
                SMA Muhammadiyah 1 Banjarnegara bukan sekadar sekolah, ini
                adalah landasan pacu bagi pemilik mimpi-mimpi besar.
              </p>
              <Link
                to="/cek"
                className="group inline-flex items-center gap-4 bg-primary text-canvas px-8 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-brand-yellow hover:text-primary transition-all shadow-[4px_4px_0px_0px_#F4A024]"
              >
                CEK STATUS KELULUSAN{" "}
                <ArrowRight
                  size={20}
                  className="group-hover:translate-x-2 transition-transform"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIAL IMAGE SECTION */}
      <section className="my-24 relative h-[50vh] md:h-[65vh] overflow-hidden rounded-[3rem] border-2 border-primary bg-primary">
        <img
          src="https://cdn.edfal.net/s/36/images/1773676626.jpg"
          className="w-full h-full object-cover grayscales opacity-60 hover:grayscale-0 transition-all duration-1000"
          alt="Kampus Muhiba Banjarnegara"
        />
        <div className="absolute bottom-6 min-md:bottom-10 left-4 min-md:left-10">
          <span className="bg-canvas text-primary px-6 py-4 rounded-full font-black text-[10px] uppercase tracking-widest border border-primary leading-relaxed inline-block text-center max-w-[280px] md:max-w-none">
            LOC: GEDTUTA OF MUHIBA ~ OUR BELOVED HOME
          </span>
        </div>
      </section>

      {/* KINETIC DUAL-ROW AUTO-SLIDE GALLERY - FULL COLOR */}
      <section className="mb-40 relative group px-4 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-[10px] md:text-xs font-black tracking-[0.3em] md:tracking-[0.5em] opacity-40 uppercase flex items-center gap-2">
              <Asterisk
                size={14}
                className="animate-spin-slow text-brand-blue"
              />{" "}
              Student_Archive_2026
            </h2>
            <p className="text-2xl md:text-3xl font-[1000] tracking-tighter uppercase italic leading-none">
              Class Memories.
            </p>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-3 md:gap-4 self-end md:self-auto">
            <button
              onClick={() => {
                const row1 = document.getElementById("marquee-row-1");
                const row2 = document.getElementById("marquee-row-2");
                [row1, row2].forEach((el) => {
                  if (!el) return;
                  el.parentElement.scrollBy({ left: -400, behavior: "smooth" });
                });
              }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/10 flex items-center justify-center hover:bg-brand-yellow hover:border-primary transition-all active:scale-90 backdrop-blur-sm shadow-sm"
            >
              <ArrowRight
                size={20}
                className="rotate-180 opacity-40 group-hover:opacity-100 text-primary"
              />
            </button>
            <button
              onClick={() => {
                const row1 = document.getElementById("marquee-row-1");
                const row2 = document.getElementById("marquee-row-2");
                [row1, row2].forEach((el) => {
                  if (!el) return;
                  el.parentElement.scrollBy({ left: 400, behavior: "smooth" });
                });
              }}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-primary/10 flex items-center justify-center hover:bg-brand-yellow hover:border-primary transition-all active:scale-90 backdrop-blur-sm shadow-sm"
            >
              <ArrowRight
                size={20}
                className="opacity-40 group-hover:opacity-100 text-primary"
              />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Baris 1: Bergerak ke Kiri */}
          <div className="overflow-x-scroll no-scrollbar flex cursor-grab active:cursor-grabbing select-none">
            <div
              id="marquee-row-1"
              className="flex whitespace-nowrap gap-6 animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]"
            >
              {photosRow1.length > 0 ? (
                [...photosRow1, ...photosRow1].map((student, i) => (
                  <div
                    key={i}
                    className="inline-block w-64 md:w-80 aspect-[3/4] shrink-0 rounded-[3rem] border-2 border-primary overflow-hidden bg-white transition-all duration-700 shadow-[10px_10px_0px_0px_rgba(26,26,26,0.05)] hover:shadow-none hover:scale-[1.02]"
                  >
                    <img
                      src={
                        student.photo_url ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${student.full_name}`
                      }
                      className="w-full h-full object-cover pointer-events-none"
                      alt={student.full_name}
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center px-10 font-black opacity-10 italic uppercase">
                  Loading_Archive_Row_1...
                </div>
              )}
            </div>
          </div>

          {/* Baris 2: Bergerak ke Kanan (Reverse) */}
          <div className="overflow-x-scroll no-scrollbar flex md:ml-12 cursor-grab active:cursor-grabbing select-none">
            <div
              id="marquee-row-2"
              className="flex whitespace-nowrap gap-6 animate-marquee-reverse hover:[animation-play-state:paused] active:[animation-play-state:paused]"
            >
              {photosRow2.length > 0 ? (
                [...photosRow2, ...photosRow2].map((student, i) => (
                  <div
                    key={i}
                    className="inline-block w-64 md:w-80 aspect-[3/4] shrink-0 rounded-[3rem] border-2 border-primary overflow-hidden bg-white transition-all duration-700 shadow-[10px_10px_0px_0px_rgba(26,26,26,0.05)] hover:shadow-none hover:scale-[1.02]"
                  >
                    <img
                      src={
                        student.photo_url ||
                        `https://api.dicebear.com/7.x/initials/svg?seed=${student.full_name}`
                      }
                      className="w-full h-full object-cover pointer-events-none"
                      alt={student.full_name}
                      loading="lazy"
                    />
                  </div>
                ))
              ) : (
                <div className="h-40 flex items-center px-10 font-black opacity-10 italic uppercase">
                  Loading_Archive_Row_2...
                </div>
              )}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-reverse {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            animation: marquee 200s linear infinite;
          }
          .animate-marquee-reverse {
            animation: marquee-reverse 210s linear infinite;
          }
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
            scroll-behavior: smooth;
          }
        `}</style>
      </section>

      {/* THE BRUTAL FOOTER */}
      <footer className="border-t-4 border-primary pt-12 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <h4 className="text-huge text-slate-200 pointer-events-none opacity-40 uppercase">
            MUHIBA.
          </h4>
          <div className="flex flex-col md:text-right gap-2">
            <p className="text-xs font-black tracking-widest opacity-30">
              DEVELOPED BY
            </p>
            <p className="text-sm font-bold text-gray-600 uppercase tracking-tighter">
              LOKANALA DIGIBARA
            </p>
            <a
              href="https://prazz.id"
              target="_blank"
              className="text-sm font-bold text-gray-600 uppercase tracking-tighter"
            >
              PRAZZ.ID
            </a>
            {/* <div className="flex md:justify-end gap-4 mt-4">
              <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-brand-yellow transition-all cursor-pointer">
                <Globe size={18} />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center hover:bg-brand-yellow transition-all cursor-pointer">
                <Zap size={18} />
              </div>
            </div>*/}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-t border-primary/10 pt-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30 italic italic">
            Crafted for the Class of 2026
          </p>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">
            ©2026 ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>

      {/* ANIMATION STYLES */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
