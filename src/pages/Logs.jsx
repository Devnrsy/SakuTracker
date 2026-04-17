/* eslint-disable no-unused-vars */

import { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Swal from 'sweetalert2';
import Modals from '../components/layout/Modals';

const Logs = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(angka);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: records, error } = await supabase
        .from('jurnal_saku')
        .select('*')
        .order('created_at', { ascending: false });

      if (records) {
        setData(records);
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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Yakin dihapus?',
      text: 'Data yang sudah dihapus tidak bisa dikembalikan!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#468432',
      cancelButtonColor: '#DB1A1A',
      confirmButtonText: 'ya, Hapus!',
      cancelButtonText: 'Batal',
    });

    if (result.isConfirmed) {
      setIsLoading(true);

      try {
        await supabase.from('jurnal_saku').delete().eq('id', id);

        Swal.fire('Terhapus!', 'Catatan berhasil dihapus.', 'success');

        fetchData();
      } catch (error) {
        Swal.fire('Error!', 'Gagal menghapus catatan.', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEdit = (item) => {
    setEditData(item);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="p-5 pb-24 overflow-x-hidden">
        <h1 className="text-2xl font-bold mb-6">Riwayat Transaksi</h1>

        <div className="flex flex-col gap-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between overflow-hidden"
            >
              <div className="flex flex-col gap-1 max-w-[70%]">
                <p className="font-semibold break-words">{item.kategori}</p>
                <p className="text-sm text-gray-500 break-words">
                  {item.catatan}
                </p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={
                    item.jenis === 'Pemasukan'
                      ? 'text-green-500 font-bold text-lg'
                      : 'text-red-500 font-bold text-lg'
                  }
                >
                  {item.jenis === 'Pemasukan' ? '+' : '-'}{' '}
                  {formatRupiah(item.nominal)}
                </span>

                <div className="flex gap-3 text-gray-400">
                  <button
                    onClick={() => handleEdit(item)}
                    className="hover:text-blue-500 transition"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="hover:text-red-500 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-20 mb-4 text-gray-400">
              <div className="text-6xl mb-4">👻</div>
              <p className="font-medium text-lg">Belum ada riwayat catatan</p>
              <p className="text-sm">Mulai catat keuanganmu hari ini!</p>
            </div>
          )}
        </div>
      </div>

      <Modals
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false); // Tutup modal
          setEditData(null); // Kosongkan lagi memori editnya
        }}
        fetchData={fetchData}
        editData={editData} // Kunci Utama: Melempar data lama ke Modal!
      />
    </>
  );
};

export default Logs;
