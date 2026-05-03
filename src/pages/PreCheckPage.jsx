import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Loader2,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Sesuaikan path config supabase Anda

const PreCheckPage = () => {
  const [nisn, setNisn] = useState("");
  const [birthDate, setBirthDate] = useState(""); // Input tanggal lahir baru
  const [status, setStatus] = useState("idle"); // idle | loading | found | not_found
  const [studentData, setStudentData] = useState({ name: "", birthDate: "" });
  const navigate = useNavigate();

  // Fungsi helper format tanggal untuk tampilan hasil
  const formatBirthDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    if (!nisn || !birthDate) return;

    setStatus("loading");

    try {
      const { data, error } = await supabase
        .from("students")
        .select("full_name, birth_date")
        .eq("nisn", nisn)
        .eq("birth_date", birthDate) // Validasi ganda dengan tanggal lahir
        .single();

      if (error || !data) {
        setStatus("not_found");
      } else {
        setStudentData({
          name: data.full_name,
          birthDate: data.birth_date,
        });
        setStatus("found");
      }
    } catch (err) {
      setStatus("not_found");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 p-8 md:p-12 border border-slate-100"
      >
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest mb-8 transition-colors"
        >
          <ArrowLeft size={14} /> Kembali
        </button>

        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
            Cek Validasi Data
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Masukkan NISN dan Tanggal Lahir Anda untuk memastikan data sudah
            terdaftar.
          </p>
        </div>

        <form onSubmit={handleCheck} className="space-y-4">
          {/* INPUT NISN */}
          <div className="relative">
            <input
              type="text"
              value={nisn}
              onChange={(e) => {
                setNisn(e.target.value);
                setStatus("idle");
              }}
              placeholder="Masukkan NISN"
              className="w-full pl-12 pr-6 py-5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900 placeholder:text-slate-400 transition-all"
            />
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>

          {/* INPUT TANGGAL LAHIR */}
          <div className="relative">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => {
                setBirthDate(e.target.value);
                setStatus("idle");
              }}
              className="w-full pl-12 pr-6 py-5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-slate-900 font-bold text-slate-900 transition-all"
            />
            <Calendar
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={20}
            />
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !nisn || !birthDate}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-slate-900/20 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {status === "loading" ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              "Periksa Sekarang"
            )}
          </button>
        </form>

        {/* HASIL CEK */}
        <div className="mt-10">
          {status === "found" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-100 rounded-3xl p-6 flex flex-col items-center text-center space-y-3"
            >
              <CheckCircle2 size={40} className="text-green-500" />
              <div className="space-y-1">
                <p className="text-green-800 font-black text-sm uppercase">
                  Data Ditemukan!
                </p>
                <p className="text-slate-900 font-bold text-lg leading-tight uppercase">
                  {studentData.name}
                </p>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                  Lahir: {formatBirthDate(studentData.birthDate)}
                </p>
                <p className="text-green-600/70 text-xs font-medium pt-2 italic">
                  Data Anda sudah sesuai. Silakan akses kembali pada hari
                  pengumuman.
                </p>
              </div>
            </motion.div>
          )}

          {status === "not_found" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 rounded-3xl p-6 flex flex-col items-center text-center space-y-3"
            >
              <XCircle size={40} className="text-red-500" />
              <div>
                <p className="text-red-800 font-black text-sm uppercase">
                  Data Tidak Cocok
                </p>
                <p className="text-slate-600 text-xs font-medium mt-1">
                  Kombinasi NISN dan Tanggal Lahir tidak ditemukan. Hubungi IT
                  Support sekolah jika ada kesalahan.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PreCheckPage;
