import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Logs from './pages/Logs';
import Navbar from './components/layout/Navbar';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  //Hint 1
  const [pin, setPin] = useLocalStorage('pin', null);

  //Hint 2
  const [inputPin, setInputPin] = useState('');

  const handleKeypadClick = (angka) => {
    if (inputPin.length < 4) {
      setInputPin(inputPin + angka);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const hapusSatu = () => {
    setInputPin(inputPin.slice(0, -1));
  };

  //Hint 3

  if (pin === null) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white p-6 rounded shadow text-center">
          <h1>Buat PIN Keamanan</h1>
          <p className="text-sm text-gray-500 mb-4">Amankan PIN anda</p>

          <div className="text-3xl tracking-[0.5em] font-bold mb-8 text-emerald-600">
            {inputPin
              .padEnd(4, '_')
              .replace(/./g, (c) => (c === '_' ? '-' : '•'))}
          </div>

          <div className="grid grid-cols-3 gap-5 w-full max-w-sm">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleKeypadClick(num.toString())}
                className="bg-white text-2xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald-100 transition active:scale-95"
              >
                {num}
              </button>
            ))}
            <div></div>
            <button
              onClick={() => handleKeypadClick('0')}
              className="bg-white-100 text-xl font-bold py-4 rounded-full shadow-sm hover:bg-emerald- transition active:scale-95"
            >
              0
            </button>

            <button
              onClick={() => handleKeypadClick('0')}
              className="bg-red-100 text-red-500 text-xl font-bold py-4 rounded-full shadow-sm hover:bg-red-200 transition active:scale-95"
            >
              DEL
            </button>
          </div>

          <input
            type="password"
            maxLength={4}
            value={inputPin}
            onChange={(e) => setInputPin(e.target.value)}
            placeholder="••••"
            className="w-full p-3 mb-4 mt-5 text-center text-1xl tracking-[0.5em] bg-gray-50 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all duration-200"
          />
          <button
            onClick={() => {
              if (inputPin.length === 4) {
                setPin(inputPin);
              } else {
                alert('PIN harus terdiri dari 4 digit');
              }
            }}
            className="w-full p-3 rounded-xl bg-green-500 text-white font-semibold shadow-md transition-all duration-200 hover:bg-green-600 hover:shadow-lg active:scale-95 active:shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Simpan PIN
          </button>
        </div>
      </div>
    );
  }

  return (
    //ukuran mobile
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-100 bg-gray-50 min-h-screen position-relative shadow-2xl">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />}></Route>
            <Route path="/logs" element={<Logs />}></Route>
          </Routes>
          <Navbar />
        </Router>
      </div>
    </div>
  );
}

export default App;
