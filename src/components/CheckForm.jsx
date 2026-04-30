import { useState } from "react";
import { Search, Loader2, Hash, Calendar } from "lucide-react";

const CheckForm = ({ onSearch, loading }) => {
  const [nisn, setNisn] = useState("");
  const [birthDate, setBirthDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nisn && birthDate) {
      onSearch(nisn, birthDate);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* INPUT NISN */}
        <div className="group">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block group-focus-within:text-primary transition-colors">
            Nomor Induk Siswa Nasional (NISN)
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Hash size={18} />
            </div>
            <input
              type="text"
              required
              placeholder="Contoh: 0012345678"
              value={nisn}
              onChange={(e) => setNisn(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold placeholder:text-slate-300 focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
            />
          </div>
        </div>

        {/* INPUT TANGGAL LAHIR */}
        <div className="group">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block group-focus-within:text-primary transition-colors">
            Tanggal Lahir
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
              <Calendar size={18} />
            </div>
            <input
              type="date"
              required
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:border-primary focus:ring-0 transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-brand-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(26,26,26,0.1)] active:scale-[0.98]"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Search size={18} />
        )}
        {loading ? "Memvalidasi..." : "Cek Status Kelulusan"}
      </button>
    </form>
  );
};

export default CheckForm;
