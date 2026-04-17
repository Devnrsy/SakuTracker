/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

const Modals = ({ isOpen, onClose, fetchData, editData }) => {
  const [formData, setFormData] = useState({
    jenis: 'Pengeluaran',
    nominal: '',
    kategori: '',
    catatan: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setFormData({
        jenis: editData.jenis,
        nominal: editData.nominal,
        kategori: editData.kategori,
        catatan: editData.catatan,
      });
    }
  }, [editData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const cekNominal = parseInt(formData.nominal);
    if (!cekNominal || cekNominal <= 0) {
      Swal.fire ({
        title: 'Tunggu Dulu!',
        text: 'Nominal uang tidak boleh kosong 0 atau minus',
        icon: 'warning',
        confirmButtonColor: '#346739',
        
      })
    }

    try {
      if (editData) {
        await supabase
          .from('jurnal_saku')
          .update({
            jenis: formData.jenis,
            nominal: parseInt(formData.nominal),
            kategori: formData.kategori,
            catatan: formData.catatan,
          })
          .eq('id', editData.id);
      } else {
        await supabase.from('jurnal_saku').insert([
          {
            jenis: formData.jenis,
            nominal: parseInt(formData.nominal),
            kategori: formData.kategori,
            catatan: formData.catatan,
          },
        ]);
      }

      Swal.fire({
        title: 'Berhasil!',
        text: editData
          ? 'Data berhasil diubah!'
          : 'Data baru berhasil dicatat!',
        icon: 'success',
        timer: 1500, // Otomatis nutup sendiri dalam 1.5 detik
        timerProgressBar: true,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
      });

      fetchData();
      onClose();
    } catch (error) {
      Swal.fire('Error!', 'Gagal menyimpan data.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h2 className="text-xl font-bold mb-4">
          {editData ? 'Edit Catatan' : 'Catat Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-sm text-gray-500">Jenis</label>
            <select
              name="jenis"
              value={formData.jenis}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
            >
              <option value="Pengeluaran">😡Pengeluaran</option>
              <option value="Pemasukan">🤢Pemasukan</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-500">Nominal (Rp)</label>
            <input
              type="number"
              name="nominal"
              required
              value={formData.nominal}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Kategori</label>
            <input
              type="text"
              name="kategori"
              required
              value={formData.kategori}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
            />
          </div>

          <div>
            <label className="text-sm text-gray-500">Catatan</label>
            <input
              type="text"
              name="catatan"
              value={formData.catatan}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 outline-emerald-500"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold"
            >
              Batal
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-bold disabled:bg-gray-400"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modals;
