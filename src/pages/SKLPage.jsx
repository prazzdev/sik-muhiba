import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Printer, ArrowLeft, Stamp, PenLine } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const SKLPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.studentData;
  const componentRef = useRef(null); // Inisialisasi dengan null

  // State untuk memilih tipe tanda tangan
  const [withStamp, setWithStamp] = useState(true);

  // FUNGSI PRINT / SAVE PDF (Direct ke sistem print browser)
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // Menghubungkan ref ke fungsi print
    documentTitle: data
      ? `SKL_${data.nisn}_${data.full_name.replace(/\s+/g, "_")}`
      : "SKL",
  });

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg"
        >
          Kembali ke Portal
        </button>
      </div>
    );
  }

  const getGradesByCategory = (cat) =>
    data.student_grades?.filter((g) => g.subjects?.category === cat) || [];

  const average = data.average_score
    ? Number(data.average_score).toFixed(2).replace(".", ",")
    : "0,00";

  return (
    <div className="min-h-screen bg-slate-200 py-10 px-4 font-serif text-black leading-tight">
      {/* TOOLBAR - Tidak akan ikut tercetak */}
      <div className="max-w-[210mm] mx-auto mb-6 flex flex-wrap justify-between items-center gap-4 print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 font-bold hover:text-black transition-colors"
        >
          <ArrowLeft size={18} /> Kembali
        </button>

        <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl shadow-sm border border-slate-300">
          <button
            onClick={() => setWithStamp(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${withStamp ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <Stamp size={14} /> Dengan Stempel
          </button>
          <button
            onClick={() => setWithStamp(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${!withStamp ? "bg-blue-600 text-white shadow-md" : "text-slate-500 hover:bg-slate-100"}`}
          >
            <PenLine size={14} /> TTD Saja
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-all"
        >
          <Printer size={18} /> Cetak / Simpan PDF
        </button>
      </div>

      {/* DOKUMEN F4 - Area ini yang masuk ke PDF */}
      <div className="print-container">
        <div
          ref={componentRef}
          className="bg-white mx-auto w-full max-w-[210mm] min-h-[330mm] p-[15mm] shadow-2xl print:shadow-none print:p-0 text-[11pt] relative overflow-hidden text-black !leading-[1.1]"
        >
          {/* KOP SEKOLAH */}
          <div className="w-full mb-2 flex justify-center">
            <img
              src="https://res.cloudinary.com/dvo44ziqd/image/upload/v1777627428/KOP_SEKOLAH_-_CROP_fwjxc3.png"
              alt="Kop Surat SMA Muhammadiyah 1 Banjarnegara"
              className="w-[90%] h-auto object-contain"
            />
          </div>

          {/* JUDUL & NOMOR */}
          <div className="text-center mb-3">
            <h2 className="text-md uppercase">Surat Keterangan Lulus</h2>
            <p className="text-sm">
              Nomor: {`0076/${data.sk_sequence}/KEP/III.4.AU/D/2026`}
            </p>
          </div>

          <div className="mb-3">
            <p className="text-justify ">
              Yang bertanda tangan di bawah ini, Kepala SMA Muhammadiyah 1
              Banjarnegara Kabupaten Banjarnegara, Provinsi Jawa Tengah
              menerangkan bahwa:
            </p>
            <table className="w-full mt-2">
              <tbody>
                <tr>
                  <td className="w-60 py-0.5">Satuan Pendidikan</td>
                  <td>: SMA Muhammadiyah 1 Banjarnegara</td>
                </tr>
                <tr>
                  <td className="py-0.5">Nomor Pokok Satuan Pendidikan</td>
                  <td>: 20338495</td>
                </tr>
                <tr>
                  <td className="py-0.5">Nama Lengkap</td>
                  <td>: {data.full_name}</td>
                </tr>
                <tr>
                  <td className="py-0.5">Tempat, Tanggal Lahir</td>
                  <td>
                    : {data.birth_place},{" "}
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(data.birth_date))}
                  </td>
                </tr>
                <tr>
                  <td className="py-0.5">Nomor Induk Siswa Nasional</td>
                  <td>: {data.nisn}</td>
                </tr>
                <tr>
                  <td className="py-0.5">Nomor Ijazah</td>
                  <td>: -</td>
                </tr>
                <tr>
                  <td className="py-0.5">Tanggal Kelulusan</td>
                  <td>: 4 Mei 2026</td>
                </tr>
                <tr>
                  <td className="py-0.5">Kurikulum</td>
                  <td>: Kurikulum Merdeka</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mb-2 text-justify">
            Dinyatakan LULUS dari Satuan Pendidikan berdasarkan kriteria
            kelulusan SMA Muhammadiyah 1 Banjarnegara Kabupaten Banjarnegara
            Tahun Ajaran 2025/2026, dengan nilai sebagai berikut:
          </p>

          <table className="w-full border-collapse border border-black text-[10pt]">
            <thead>
              <tr className="bg-slate-50">
                <th className="border border-black px-2 py-1 w-10">No.</th>
                <th className="border border-black px-2 py-1 text-left">
                  Mata Pelajaran
                </th>
                <th className="border border-black px-2 py-1 w-24">Nilai</th>
              </tr>
            </thead>
            <tbody>
              <tr className="font-bold">
                <td
                  colSpan="3"
                  className="border border-black px-2 py-0.5 bg-slate-50"
                >
                  A. Mata Pelajaran Wajib
                </td>
              </tr>
              {getGradesByCategory("wajib").map((g, i) => (
                <tr key={i}>
                  <td className="border border-black text-center py-0.5">
                    {i + 1}.
                  </td>
                  <td className="border border-black px-2 py-0.5 uppercase">
                    {g.subjects?.name}
                  </td>
                  <td className="border border-black text-center py-0.5 font-bold">
                    {Number(g.score).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td
                  colSpan="3"
                  className="border border-black px-2 py-0.5 bg-slate-50"
                >
                  B. Mata Pelajaran Pilihan
                </td>
              </tr>
              {getGradesByCategory("pilihan").map((g, i) => (
                <tr key={i}>
                  <td className="border border-black text-center py-0.5">
                    {i + 12}.
                  </td>
                  <td className="border border-black px-2 py-0.5 uppercase">
                    {g.subjects?.name}
                  </td>
                  <td className="border border-black text-center py-0.5 font-bold">
                    {Number(g.score).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
              <tr className="font-bold">
                <td
                  colSpan="3"
                  className="border border-black px-2 py-0.5 bg-slate-50"
                >
                  C. Muatan Lokal
                </td>
              </tr>
              {getGradesByCategory("mulok").map((g, i) => (
                <tr key={i}>
                  <td className="border border-black text-center py-0.5">
                    {i + 17}.
                  </td>
                  <td className="border border-black px-2 py-0.5 uppercase">
                    {g.subjects?.name}
                  </td>
                  <td className="border border-black text-center py-0.5 font-bold">
                    {Number(g.score).toFixed(2).replace(".", ",")}
                  </td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-50 text-base">
                <td
                  colSpan="2"
                  className="border border-black text-center py-1 uppercase tracking-widest"
                >
                  Rata-rata
                </td>
                <td className="border border-black text-center py-1">
                  {average}
                </td>
              </tr>
            </tbody>
          </table>

          <p className="my-4 text-justify">
            Surat Keterangan Lulus ini berlaku sementara sampai dengan
            diterbitkannya Ijazah Tahun Ajaran 2025/2026, untuk menjadikan
            maklum bagi yang berkepentingan.
          </p>

          <div className="mt-8 flex justify-end">
            <div className="flex items-start gap-2">
              <div className="w-[3cm] h-[4cm] border border-black flex items-center justify-center overflow-hidden self-end">
                {data.photo_url ? (
                  <img
                    src={data.photo_url}
                    alt="Foto Siswa"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-[8pt] text-center uppercase p-2">
                    Pas Foto 3x4
                  </p>
                )}
              </div>
              <div className="text-center min-w-[280px] relative">
                <p>Kab. Banjarnegara, 4 Mei 2026</p>
                <p className="mb-2">Kepala SMA Muh 1 BNA,</p>
                <div className="h-28 relative flex items-center justify-center">
                  <img
                    src={
                      withStamp
                        ? "https://res.cloudinary.com/dvo44ziqd/image/upload/v1777627429/TTD_KS_STEMPEL_JADI_1_tgzobp.png"
                        : "https://res.cloudinary.com/dvo44ziqd/image/upload/v1777627428/TTD_PAK_YUSUF_1_nax0di.png"
                    }
                    alt="Tanda Tangan"
                    className={`absolute h-32 w-auto object-contain z-10 ${withStamp ? "translate-x-[-15px]" : ""}`}
                  />
                </div>
                <div className="flex flex-col items-start w-fit mx-auto relative z-20 mt-2 text-black">
                  <p className="font-bold text-base whitespace-nowrap">
                    Yusuf Satriyono, S.Pd.
                  </p>
                  <p className="text-sm">NIP. -</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: 210mm 330mm;
            margin: 10mm 15mm !important;
          }
          body { background: white !important; }
          .min-h-screen { background: white !important; padding: 0 !important; }
          .print\\:hidden { display: none !important; }
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        }
      `}</style>
    </div>
  );
};

export default SKLPage;
