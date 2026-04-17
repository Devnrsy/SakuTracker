import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modals from '../components/layout/Modals';

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data dari Supabase
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const { data: records, error } = await supabase
        .from('jurnal_saku')
        .select('*');

      if (records) {
        setData(records);
      }

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Ada masalah cuy', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Hitung total pemasukan
  const totalPemasukan = data
    .filter((item) => item.jenis === 'Pemasukan')
    .reduce((acc, item) => acc + Number(item.nominal), 0);

  // Hitung total pengeluaran
  const totalPengeluaran = data
    .filter((item) => item.jenis === 'Pengeluaran')
    .reduce((acc, item) => acc + Number(item.nominal), 0);

  // Hitung saldo
  const saldo = totalPemasukan - totalPengeluaran;

  //Persen Pengeluaran
  let persenPengeluaran = 0;
  if (totalPemasukan > 0) {
    persenPengeluaran = (totalPengeluaran / totalPemasukan) * 100;
  }

  if (persenPengeluaran > 100) {
    persenPengeluaran = 100;
  }

  // Format rupiah
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  if (isLoading) {
    return (
      <div className="p-5 pb-24 min-h-screen flex flex-col justify-center items-center bg-gray-50">
        <div className="animate-spin text-5xl mb-4">↻</div>
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-5 pb-24">
      <h1 className="text-2xl font-extrabold text-gray-800 mb-6">Halo, Bos!</h1>

      {/* Card Saldo */}
      <div className="bg-emerald-500 rounded-2xl shadow-md p-5 relative mb-6">
        <p className="text-emerald-100 text-sm font-medium">Sisa Saldo Saku</p>

        <h2 className="text-4xl font-black mt-1 text-white">
          {formatRupiah(saldo)}
        </h2>

        <div className="absolute -right-4 -bottom-3 opacity-40 text-8xl">
          💳
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl shadow-sm  border-gray-100 mb-6">
        <div className="flex justify-between items-and mb-3">
          <div>
            <h3 className="font-bold text-gray-800 ">Rasio Pengeluaran</h3>

            <p className="text-xs text-gray-800 mt-1">
              {persenPengeluaran >= 80
                ? 'Awas, Kamu boros!'
                : 'Keunganmu cukup sehat!'}
            </p>
          </div>
          <p
            className={`text-xl font-black ${persenPengeluaran >= 80 ? 'text-red-500' : 'text-yellow-500'}`}
          >
            {persenPengeluaran.toFixed(1)}%
          </p>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-3.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${persenPengeluaran >= 80 ? 'bg-red-500' : 'bg-yellow-400'}`}
            style={{ width: `${persenPengeluaran}%` }}
          ></div>
        </div>
      </div>

      {/* Statistik */}
      <div className="flex gap-4">
        {/* Pemasukan */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Uang Masuk</p>
          <h3 className="text-lg font-bold text-green-600">
            {formatRupiah(totalPemasukan)}
          </h3>
        </div>

        {/* Pengeluaran */}
        <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
          <p className="text-gray-500 text-sm">Uang Keluar</p>
          <h3 className="text-lg font-bold text-red-500">
            {formatRupiah(totalPengeluaran)}
          </h3>
        </div>
      </div>

      {/* Tombol */}
      <button
        className="w-full mt-6 bg-slate-800 text-white font-bold text-lg py-4 rounded-2xl shadow-lg hover:bg-slate-700 transition active:scale-95"
        onClick={() => setIsModalOpen(true)}
      >
        + Catatan Keuangan
      </button>

      {/* Modal */}
      <Modals
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchData={fetchData}
      />
    </div>
  );
};

export default Dashboard;
