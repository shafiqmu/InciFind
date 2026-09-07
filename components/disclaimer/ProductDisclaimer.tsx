export default function ProductDisclaimer() {
  return (
    <section className="mt-[60px] p-6 flex gap-[14px] bg-clay-bg border border-[#f3cfcb] rounded-[20px]">
      <div className="w-8 h-8 grid place-items-center shrink-0 bg-clay text-white rounded-full font-black">
        !
      </div>
      <div>
        <h3 className="mb-[5px] text-[#a13c36] text-sm font-bold">Disclaimer</h3>
        <p className="text-[#785d5a] text-[13px] leading-[1.65]">
          Info di InciFind cuma buat edukasi, bukan pengganti saran dokter kulit.
          Reaksi kulit tiap orang bisa beda. Formula produk bisa berubah, jadi selalu
          cek daftar bahan di kemasan terbaru.
        </p>
      </div>
    </section>
  );
}
