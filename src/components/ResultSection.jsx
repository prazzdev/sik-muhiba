import { useState, useEffect } from "react"; // Tambahkan useEffect
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { supabase } from "../lib/supabase"; // Import supabase untuk cek settings
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

const ResultSection = ({ data, onBack }) => {
  const [showGrades, setShowGrades] = useState(true);
  const [isPrintEnabled, setIsPrintEnabled] = useState(false); // State untuk status fitur cetak
  const navigate = useNavigate();

  // Ambil setting dari database saat komponen mount
  useEffect(() => {
    const fetchSettings = async () => {
      const { data: settings } = await supabase
        .from("site_settings")
        .select("is_active")
        .eq("key", "skl_print_feature")
        .single();

      if (settings) {
        setIsPrintEnabled(settings.is_active);
      }
    };
    fetchSettings();
  }, []);

  const formatBirthDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const kategoriMapel = [
    { title: "Mata Pelajaran Wajib", key: "wajib", color: "bg-blue-600" },
    { title: "Mata Pelajaran Pilihan", key: "pilihan", color: "bg-purple-600" },
    { title: "Muatan Lokal", key: "mulok", color: "bg-amber-600" },
  ];

  const handlePrintSKL = () => {
    // Cek status fitur cetak
    if (isPrintEnabled) {
      navigate("/print-skl", { state: { studentData: data } });
    } else {
      Swal.fire({
        title: "Akses Belum Dibuka",
        text: "Mohon maaf, Surat Keterangan Lulus (SKL) belum dapat diunduh saat ini. Silakan cek kembali secara berkala.",
        icon: "info",
        confirmButtonText: "Mengerti",
        confirmButtonColor: "#1e293b",
        customClass: {
          popup: "rounded-[2rem]",
          confirmButton:
            "rounded-xl px-10 py-3 text-xs uppercase tracking-widest font-black",
        },
      });
    }
  };

  const getGradesByCategory = (cat) =>
    data.student_grades?.filter((g) => g.subjects?.category === cat) || [];

  const average = data.average_score
    ? Number(data.average_score).toFixed(2).replace(".", ",")
    : "0,00";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6 pb-20 px-4 md:px-0"
    >
      {/* CARD BIODATA & STATUS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="shrink-0">
            <div className="w-[120px] h-[180px] md:w-[140px] md:h-[210px] bg-slate-100 border-2 border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner">
              {data.photo_url ? (
                <img
                  src={data.photo_url}
                  alt="Foto Siswa"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center text-slate-300">
                  <User size={48} strokeWidth={1} />
                  <span className="text-[10px] font-bold mt-2 uppercase">
                    4 x 6
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-6">
            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight uppercase tracking-tighter">
                  {data.full_name}
                </h2>
                <p className="text-blue-600 font-bold text-sm tracking-wide">
                  SMA Muhammadiyah 1 Banjarnegara
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-slate-500 font-medium">
                <p>
                  NISN:{" "}
                  <span className="text-slate-900 font-bold">{data.nisn}</span>
                </p>
                <p>
                  TEMPAT, TGL LAHIR:
                  <span className="text-slate-900 font-bold uppercase ml-1">
                    {data.birth_place || "-"},{" "}
                    {formatBirthDate(data.birth_date)}
                  </span>
                </p>
                <p>
                  KELAS:{" "}
                  <span className="text-slate-900 font-bold">
                    {data.class_name}
                  </span>
                </p>
              </div>
            </div>

            <div
              className={`px-6 py-6 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[180px] h-fit self-center md:self-start ${
                data.is_graduated
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {data.is_graduated ? (
                <>
                  <CheckCircle2 size={40} className="mb-2 text-green-500" />
                  <span className="font-black text-xl tracking-tighter uppercase">
                    LULUS
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={40} className="mb-2 text-red-500" />
                  <span className="font-black text-xl tracking-tighter uppercase">
                    TIDAK LULUS
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSKRIP NILAI */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 md:p-8 space-y-10">
          <AnimatePresence mode="wait">
            {showGrades ? (
              <motion.div
                key="visible"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                {kategoriMapel.map((cat) => {
                  const items = getGradesByCategory(cat.key);
                  if (items.length === 0) return null;
                  return (
                    <div key={cat.key} className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-1.5 h-5 ${cat.color} rounded-full`}
                        />
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-tighter">
                          {cat.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 border-t border-slate-50 pt-4">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2.5 border-b border-slate-50 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                          >
                            <span className="text-slate-600 text-sm font-medium uppercase tracking-tight">
                              {item.subjects?.name}
                            </span>
                            <span className="font-mono font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-md text-sm">
                              {Number(item.score).toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center mt-6 shadow-xl border border-slate-800">
                  <div className="flex flex-col">
                    <p className="text-white font-bold text-xs uppercase tracking-[0.2em]">
                      Rata-Rata Nilai Akhir
                    </p>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">
                      Berbasis seluruh mata pelajaran
                    </span>
                  </div>
                  <span className="text-4xl font-black text-yellow-400 tracking-tighter">
                    {average}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-4"
              >
                <div className="p-5 bg-slate-50 rounded-full">
                  <EyeOff
                    size={48}
                    strokeWidth={1}
                    className="text-slate-300"
                  />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-500">
                    Nilai sedang disembunyikan
                  </p>
                  <p className="text-xs text-slate-400 mt-1 font-medium">
                    Klik tombol "Tampilkan Nilai" untuk melihat detail
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all"
            >
              <ArrowLeft size={16} /> Kembali ke Pencarian
            </button>
            <button
              onClick={handlePrintSKL}
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 transition-all"
            >
              <Printer size={16} /> Cetak SKL Resmi (PDF)
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        SMA MUHAMMADIYAH 1 BANJARNEGARA © 2026
      </p>
    </motion.div>
  );
};

export default ResultSection;
