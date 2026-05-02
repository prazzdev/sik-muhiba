import React from "react";
import { motion } from "framer-motion";
import { Printer, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const SKLPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state?.studentData;

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

  const handlePrint = () => window.print();

  // Helper untuk memfilter grades berdasarkan category
  const getGradesByCategory = (cat) =>
    data.student_grades?.filter((g) => g.subjects?.category === cat) || [];

  const average =
    data.student_grades?.length > 0
      ? (
          data.student_grades.reduce(
            (acc, curr) => acc + Number(curr.score),
            0,
          ) / data.student_grades.length
        ).toFixed(2)
      : "0.00";

  return (
    <div className="min-h-screen bg-slate-200 py-10 px-4 font-serif text-black leading-tight">
      {/* TOOLBAR */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-between print:hidden">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-700 font-bold"
        >
          <ArrowLeft size={18} /> Kembali
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold shadow-lg"
        >
          <Printer size={18} /> Cetak SKL
        </button>
      </div>

      {/* DOKUMEN A4 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white mx-auto w-full max-w-[210mm] min-h-[297mm] p-[15mm] shadow-2xl print:shadow-none print:p-0 text-[11pt]"
      >
        {/* KOP SEKOLAH (DISESUAIKAN DENGAN GAMBAR PNG) */}
        <div className="w-full mb-4">
          <img
            src="https://res.cloudinary.com/dvo44ziqd/image/upload/v1777627428/KOP_SEKOLAH_-_CROP_fwjxc3.png"
            alt="Kop Surat SMA Muhammadiyah 1 Banjarnegara"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* JUDUL & NOMOR */}
        <div className="text-center mb-4">
          <h2 className="text-md font-bold uppercase">
            Surat Keterangan Lulus
          </h2>
          <p className="text-sm">
            Nomor: {`0076/${data.sk_sequence}/KEP/III.4.AU/D/2026`}
          </p>
        </div>

        <div className="mb-4">
          <p className="text-justify">
            Yang bertanda tangan di bawah ini, Kepala SMA Muhammadiyah 1
            Banjarnegara Kabupaten Banjarnegara, Provinsi Jawa Tengah
            menerangkan bahwa:
          </p>
          <table className="w-full mt-2">
            <tbody>
              <tr>
                <td className="w-56 py-0.5">Satuan Pendidikan</td>
                <td>: SMA Muhammadiyah 1 Banjarnegara</td>
              </tr>
              <tr>
                <td className="w-56 py-0.5">Nomor Pokok Satuan Pendidikan</td>
                <td>: 20338495</td>
              </tr>
              <tr>
                <td className="py-0.5">Nama Lengkap</td>
                <td>
                  : <strong>{data.full_name}</strong>
                </td>
              </tr>
              <tr>
                <td className="py-0.5">Tempat, Tanggal Lahir</td>
                <td>
                  : {data.birth_place}, {data.birth_date}
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
          Dinyatakan LULUS dari Satuan Pendidikan berdasarkan kriteria kelulusan
          SMA Muhammadiyah 1 Banjarnegara Kabupaten Banjarnegara Tahun Ajaran
          2025/2026, dengan nilai sebagai berikut:
        </p>

        {/* TABEL NILAI */}
        <table className="w-full border-collapse border border-black text-sm">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-black px-2 py-1 w-10">No.</th>
              <th className="border border-black px-2 py-1 text-left">
                Mata Pelajaran
              </th>
              <th className="border border-black px-2 py-1 w-24">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {/* WAJIB */}
            <tr className="font-bold bg-slate-50">
              <td
                colSpan="3"
                className="border border-black px-2 py-0.5 tracking-tight"
              >
                Mata Pelajaran Wajib
              </td>
            </tr>
            {getGradesByCategory("wajib").map((g, i) => (
              <tr key={i}>
                <td className="border border-black text-center py-0.5">
                  {i + 1}.
                </td>
                <td className="border border-black px-2 py-0.5">
                  {g.subjects?.name}
                </td>
                <td className="border border-black text-center py-0.5 font-bold">
                  {g.score}
                </td>
              </tr>
            ))}

            {/* PILIHAN */}
            <tr className="font-bold bg-slate-50">
              <td
                colSpan="3"
                className="border border-black px-2 py-0.5 tracking-tight"
              >
                Mata Pelajaran Pilihan
              </td>
            </tr>
            {getGradesByCategory("pilihan").map((g, i) => (
              <tr key={i}>
                <td className="border border-black text-center py-0.5">
                  {i + 12}.
                </td>
                <td className="border border-black px-2 py-0.5">
                  {g.subjects?.name}
                </td>
                <td className="border border-black text-center py-0.5 font-bold">
                  {g.score}
                </td>
              </tr>
            ))}

            {/* MULOK */}
            <tr className="font-bold bg-slate-50">
              <td
                colSpan="3"
                className="border border-black px-2 py-0.5 tracking-tight"
              >
                Muatan Lokal
              </td>
            </tr>
            {getGradesByCategory("mulok").map((g, i) => (
              <tr key={i}>
                <td className="border border-black text-center py-0.5">
                  {i + 17}.
                </td>
                <td className="border border-black px-2 py-0.5">
                  {g.subjects?.name}
                </td>
                <td className="border border-black text-center py-0.5 font-bold">
                  {g.score}
                </td>
              </tr>
            ))}

            {/* RATA-RATA */}
            <tr className="font-bold">
              <td
                colSpan="2"
                className="border border-black text-center py-1 uppercase tracking-widest"
              >
                Rata-rata
              </td>
              <td className="border border-black text-center py-1 text-lg">
                {average}
              </td>
            </tr>
          </tbody>
        </table>

        <p className="my-4 text-justify">
          Surat Keterangan Lulus ini berlaku sementara sampai dengan
          diterbitkannya Ijazah Tahun Ajaran 2025/2026, untuk menjadikan maklum
          bagi yang berkepentingan.
        </p>

        {/* TTD SECTION */}
        <div className="mt-6 flex justify-end">
          <div className="flex items-start gap-10">
            {/* PAS FOTO */}
            <div className="w-[3cm] h-[4cm] border border-black flex items-center justify-center overflow-hidden self-end">
              {data.photo_url ? (
                <img
                  src={data.photo_url}
                  alt="Foto Siswa"
                  className="w-full h-full object-cover grayscales"
                />
              ) : (
                <p className="text-[8pt] text-center uppercase p-2">
                  Pas Foto 3x4
                </p>
              )}
            </div>

            {/* AREA TANDA TANGAN */}
            <div className="text-center min-w-[250px] relative">
              <p>Kab. Banjarnegara, 4 Mei 2026</p>
              <p>Kepala SMA Muh 1 BNA,</p>

              {/* Ruang TTD dengan Gambar Stempel & TTD */}
              <div className="h-28 relative flex items-center justify-center z-1000">
                <img
                  src="https://res.cloudinary.com/dvo44ziqd/image/upload/v1777627035/TTD_KS_STEMPEL_JADI_1_jwkjdi.png"
                  alt="Tanda Tangan dan Stempel"
                  className="absolute w-60 h-auto object-contain z-10 translate-x-[-20px]"
                />
              </div>

              {/* Bagian Nama & NIP - Menggunakan items-start untuk rata kiri internal */}
              <div className="flex flex-col items-start w-fit mx-auto relative z-20">
                <p className="font-bold underline uppercase text-base whitespace-nowrap">
                  Yusuf Satriyono, S.Pd.
                </p>
                <p className="text-sm">NIP. -</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @media print {
          body { background: white; margin: 0; padding: 0; color: black !important; }
          .print\\:hidden { display: none !important; }
          @page { size: F4; margin: 5mm; }
          * { color: black !important; border-color: black !important; }
        }
      `}</style>
    </div>
  );
};

export default SKLPage;
