import { useState } from 'react';
import { motion } from 'motion/react';
import { User, GraduationCap, Mail, Lock, School } from 'lucide-react';

import logo from "../../assets/logo_mathverse.png";
import dragonCharacter from "../../assets/draco.png";

import { useUser } from '../utils/userContext';
import { iniciarSesion, registrarEstudiante } from '../../services/estudianteService';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'student' | 'teacher'>('student');

  // Datos del formulario
  const [name, setName] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [school, setSchool] = useState('');
  const [edad, setEdad] = useState('');
  const [grado, setGrado] = useState('');
  const [error, setError] = useState('');

const { register, setLoggedStudent } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    // ================= LOGIN =================
    if (isLogin) {

  if (userType === "student") {
    const estudiante = await iniciarSesion(email, password);

    // Guardar el estudiante en el contexto de la aplicación
    setLoggedStudent(estudiante);

    alert(`🎉 ¡Bienvenido ${estudiante.nombre}!`);

    return;
}

  // Login docente (temporal)
  setError("El inicio de sesión de docentes lo conectaremos más adelante.");
  return;
}

    // REGISTRO 
    if (!name || !apellido || !email || !password || !edad || !grado || !school) {
      setError("Por favor completa todos los campos.");
      return;
    }

    if (userType === "student") {
      await registrarEstudiante({
        nombre: name,
        apellido,
        correo: email,
        password,
        edad: Number(edad),
        grado,
        avatar: "avatar1.png",
      });

      alert("🎉 ¡Estudiante registrado correctamente!");

    } else {
      await register(name, email, password, userType, school);

      alert("Docente registrado correctamente.");
    }

    // Limpiar formulario
    setName("");
    setApellido("");
    setEmail("");
    setPassword("");
    setSchool("");
    setEdad("");
    setGrado("");

    // Volver al formulario de login
    setIsLogin(true);

  } catch (err: any) {
    setError(err.message || "Ocurrió un error.");
  }
};

    return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-yellow-300 flex items-center justify-center p-4">
      <div className="max-w-md w-full">

        {/* LOGO */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-center mb-8"
        >
          <img src={logo} alt="Mathverse Adventure" className="w-24 h-24 mx-auto mb-4" />

          <h1 className="text-4xl font-black text-white drop-shadow-lg mb-2">
            MATHVERSE ADVENTURE
          </h1>

          <p className="text-white text-lg font-bold drop-shadow">
            ¡Aprende matemáticas con Draco! 🐉
          </p>
        </motion.div>

        {/* DRAGÓN */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex justify-center mb-6"
        >
          <img src={dragonCharacter} alt="Draco" className="w-32 h-32" />
        </motion.div>

        {/* TARJETA */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl border-b-8 border-purple-400 p-8"
        >

          {/* Tipo de usuario */}
          <div className="grid grid-cols-2 gap-4 mb-6">

            <button
              type="button"
              onClick={() => setUserType('student')}
              className={`py-4 rounded-2xl font-bold transition-all ${
                userType === 'student'
                  ? 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <User className="w-6 h-6 mx-auto mb-2" />
              Estudiante
            </button>

            <button
              type="button"
              onClick={() => setUserType('teacher')}
              className={`py-4 rounded-2xl font-bold transition-all ${
                userType === 'teacher'
                  ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <GraduationCap className="w-6 h-6 mx-auto mb-2" />
              Docente
            </button>

          </div>

          {/* Login / Registro */}
          <div className="flex mb-6 bg-gray-100 rounded-2xl p-1">

            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                isLogin
                  ? 'bg-white shadow-md text-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Iniciar Sesión
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                !isLogin
                  ? 'bg-white shadow-md text-gray-800'
                  : 'text-gray-500'
              }`}
            >
              Registrarse
            </button>

          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nombre */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Nombre
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                    placeholder="Tu nombre"
                  />
                </div>
              </div>
            )}

            {/* Apellido */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Apellido
                </label>

                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <input
                    type="text"
                    value={apellido}
                    onChange={(e) => setApellido(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                    placeholder="Tu apellido"
                  />
                </div>
              </div>
            )}

            {/* Correo */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Correo Electrónico
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            {/* Edad */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Edad
                </label>

                <select
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                  
                >
                  <option value="">Selecciona tu edad</option>
                  <option value="9">9 años</option>
                  <option value="10">10 años</option>
                  <option value="11">11 años</option>
                  <option value="12">12 años</option>
              </select>
            </div>
            )}

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Contraseña
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Colegio */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Colegio / Institución
                </label>

                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

                  <select
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                  >
                    <option value="">Selecciona tu institución</option>
                    <option value="IED Divino Salvador">IED Divino Salvador</option>
                  </select>
                </div>
              </div>
            )}

            {/* Grado */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Grado Escolar
                </label>

                <select
                  value={grado}
                  onChange={(e) => setGrado(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none font-semibold"
                >
                  <option value="">Selecciona tu grado</option>
                  <option value="5°">5° Primaria</option>
                </select>
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl font-semibold text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Botón */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-black text-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              {isLogin ? '¡Entrar a la Aventura!' : '¡Crear Cuenta!'}
            </motion.button>

          </form>

          {/* Demo */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <p className="text-xs font-bold text-blue-800 mb-2">
              💡 Demo - Crear nueva cuenta o usar:
            </p>

            <p className="text-xs text-blue-700">
              <strong>Estudiante:</strong> student@demo.com / demo123
              <br />
              <strong>Docente:</strong> teacher@demo.com / demo123
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
