import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  User,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";

const ResultSection = ({ data, onBack }) => {
  const [showGrades, setShowGrades] = useState(true);

  // Pengelompokan kategori mapel
  const kategoriMapel = [
    { title: "Mata Pelajaran Wajib", key: "wajib", color: "bg-blue-600" },
    { title: "Mata Pelajaran Pilihan", key: "pilihan", color: "bg-purple-600" },
    { title: "Muatan Lokal", key: "mulok", color: "bg-amber-600" },
  ];

  const getGradesByCategory = (cat) =>
    data.student_grades?.filter((g) => g.category === cat) || [];

  const allGrades = data.student_grades || [];
  const average =
    allGrades.length > 0
      ? (
          allGrades.reduce((acc, curr) => acc + curr.score, 0) /
          allGrades.length
        ).toFixed(2)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto space-y-6 pb-20"
    >
      {/* CARD BIODATA & STATUS */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* PAS FOTO 4x6 */}
          <div className="shrink-0">
            <div className="w-[120px] h-[180px] md:w-[140px] md:h-[210px] bg-slate-100 border-2 border-slate-200 rounded-xl overflow-hidden flex items-center justify-center relative">
              {data.photo_url ? (
                <img
                  src={data.photo_url}
                  alt="Foto"
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

          {/* BIODATA */}
          <div className="flex-1 flex flex-col md:flex-row justify-between w-full gap-6">
            <div className="text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight uppercase">
                  {data.full_name}
                </h2>
                <p className="text-blue-600 font-bold text-sm tracking-wide">
                  SMA Muhammadiyah 1 Banjarnegara
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 text-sm text-slate-500 font-medium">
                <p>
                  NISN: <span className="text-slate-900">{data.nisn}</span>
                </p>
                <p>
                  NOMOR UJIAN:{" "}
                  <span className="text-slate-900">{data.exam_number}</span>
                </p>
                <p>
                  TEMPAT, TGL LAHIR:{" "}
                  <span className="text-slate-900 uppercase">
                    {data.birth_place}, {data.birth_date}
                  </span>
                </p>
              </div>
            </div>

            {/* STATUS BADGE */}
            <div
              className={`px-6 py-6 rounded-2xl border-2 flex flex-col items-center justify-center min-w-[180px] h-fit ${
                data.is_graduated
                  ? "bg-green-50 border-green-200 text-green-700"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {data.is_graduated ? (
                <>
                  <CheckCircle2 size={40} className="mb-2" />
                  <span className="font-black text-xl tracking-tighter">
                    LULUS
                  </span>
                </>
              ) : (
                <>
                  <XCircle size={40} className="mb-2" />
                  <span className="font-black text-xl tracking-tighter">
                    TIDAK LULUS
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* TRANSKRIP NILAI DENGAN TOGGLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-800 text-xs uppercase tracking-widest">
              Transkrip Nilai Akademik
            </h3>
            <button
              onClick={() => setShowGrades(!showGrades)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-500 hover:text-primary transition-all shadow-sm"
            >
              {showGrades ? <EyeOff size={12} /> : <Eye size={12} />}
              {showGrades ? "Sembunyikan Nilai" : "Tampilkan Nilai"}
            </button>
          </div>
          <span className="hidden md:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
            SIK-MUHIBA OFFICIAL
          </span>
        </div>

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
                        <div className={`w-1 h-5 ${cat.color} rounded-full`} />
                        <h4 className="font-black text-slate-800 text-sm uppercase tracking-tighter">
                          {cat.title}
                        </h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1 border-t border-slate-50 pt-4">
                        {items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center py-2 border-b border-slate-50"
                          >
                            <span className="text-slate-600 text-sm font-medium uppercase">
                              {item.subject_name}
                            </span>
                            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-3 py-0.5 rounded text-sm">
                              {item.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* TOTAL RATA-RATA */}
                <div className="bg-slate-900 rounded-2xl p-6 flex justify-between items-center mt-6">
                  <p className="text-white font-bold text-xs uppercase tracking-[0.2em]">
                    Rata-Rata Nilai Akhir
                  </p>
                  <span className="text-3xl font-black text-yellow-400 tracking-tighter">
                    {average}
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-20 flex flex-col items-center justify-center text-slate-400 space-y-3"
              >
                <EyeOff size={48} strokeWidth={1} />
                <p className="text-sm font-medium uppercase tracking-widest">
                  Nilai sedang disembunyikan
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
            <button
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl border border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              <ArrowLeft size={16} /> Kembali
            </button>
            <button
              disabled
              className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-slate-200 active:scale-95 disabled:bg-slate-300 disabled:shadow-none"
            >
              <Printer size={16} /> Cetak SKL Resmi (PDF)
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ResultSection;
