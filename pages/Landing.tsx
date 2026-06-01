
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChefHat, 
  BookOpen, 
  Calculator, 
  Users, 
  ArrowRight, 
  MapPin, 
  FileText, 
  GraduationCap,
  Target
} from 'lucide-react';

export const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      
      {/* 1. HERO SECTION */}
      <header className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/90 to-gray-900/90 z-10"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>
        
        <div className="relative z-20 max-w-7xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 mb-8 backdrop-blur-md">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-green-300 text-xs font-bold tracking-wider uppercase">Herramienta Educativa Oficial</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Murcia <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-200">Sostenible</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Tu gestor integral para el <strong>Trabajo de Fin de Grado</strong>. Diseña, gestiona y valida tu proyecto de restauración sostenible desde la idea hasta el escandallo final.
          </p>
          
          <Link 
            to="/dashboard" 
            className="group relative inline-flex items-center gap-3 bg-green-500 text-white px-10 py-5 rounded-full font-bold text-lg transition-all hover:bg-green-400 hover:scale-105 shadow-2xl hover:shadow-green-500/20"
          >
            Comenzar mi Proyecto
            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
          
          <p className="mt-6 text-sm text-gray-500">
            Optimizada para alumnos de Hostelería y Turismo de la Región de Murcia.
          </p>
        </div>
      </header>

      {/* 2. EXPLICACIÓN DEL FLUJO (CÓMO FUNCIONA) */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Un flujo de trabajo profesional</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              La aplicación te guía a través de las 6 fases críticas de la creación de un restaurante, asegurando que no olvides ningún detalle para tu Memoria Final.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Paso 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Users size={100} />
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6 font-bold text-xl">1</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Equipo y Sincronización</h3>
              <p className="text-gray-600">
                Crea tu proyecto y obtén un <strong>Código de Equipo</strong>. Tus compañeros solo necesitan ese código para unirse y trabajar todos a la vez.
              </p>
            </div>

            {/* Paso 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Target size={100} />
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 font-bold text-xl">2</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tarea 2: Análisis y Concepto</h3>
              <p className="text-gray-600">
                Realiza investigaciones de mercado asignadas individualmente y definid en grupo el nombre, eslogan y valores de vuestra marca.
              </p>
            </div>

            {/* Paso 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <ChefHat size={100} />
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-6 font-bold text-xl">3</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Diseño de Carta</h3>
              <p className="text-gray-600">
                Crea fichas técnicas detalladas con ingredientes Km0. Incluye fotos, alérgenos y justificación de sostenibilidad.
              </p>
            </div>

            {/* Paso 4 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <FileText size={100} />
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-600 mb-6 font-bold text-xl">4</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Prototipado</h3>
              <p className="text-gray-600">
                Sube enlaces a tu diseño digital (Canva) y fotos de tu maqueta física de la carta. Todo centralizado.
              </p>
            </div>

            {/* Paso 5 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Calculator size={100} />
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600 mb-6 font-bold text-xl">5</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Finanzas y Escandallos</h3>
              <p className="text-gray-600">
                Calculadora integrada de costes. Determina el Food Cost, Margen Bruto y justifica tu PVP de forma automática.
              </p>
            </div>

            {/* Paso 6 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-green-200 transition-colors relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BookOpen size={100} />
              </div>
              <div className="w-12 h-12 bg-gray-900 text-white rounded-xl flex items-center justify-center mb-6 font-bold text-xl">6</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Memoria Final PDF</h3>
              <p className="text-gray-600">
                ¡Magia! Pulsa un botón y la app compilará todo tu trabajo en un documento estructurado listo para entregar e imprimir.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CARACTERÍSTICAS TÉCNICAS */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Herramientas al servicio de tu proyecto</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Base de Datos Regional</h4>
                  <p className="text-gray-600 text-sm">Información precargada sobre productos e ingredientes de las 10 comarcas de Murcia.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Guía Académica y Normativa</h4>
                  <p className="text-gray-600 text-sm">Acceso directo a los Resultados de Aprendizaje (RA) y ODS para asegurar que tu proyecto cumple con los criterios de evaluación.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Trabajo Colaborativo Real</h4>
                  <p className="text-gray-600 text-sm">Se acabó el enviarse archivos. Todos los miembros del equipo ven los cambios de los demás al instante gracias a la base de datos en la nube.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8 border border-gray-200 rotate-2 hover:rotate-0 transition-transform duration-500">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center gap-2 mb-4 border-b pb-2">
                    <div className="w-3 h-3 rounded-full bg-red-400"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                    <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    <span className="text-xs text-gray-400 ml-2">Vista Previa: Escandallo</span>
                </div>
                <div className="space-y-3 font-mono text-xs">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Plato:</span>
                        <span className="font-bold">Arroz con Conejo y Caracoles</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Coste MP:</span>
                        <span className="text-red-500">3.45€</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">PVP Sugerido:</span>
                        <span className="text-blue-600 font-bold">14.50€</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{width: '24%'}}></div>
                    </div>
                    <div className="text-center text-green-600 text-[10px] pt-1">Food Cost: 24% (Óptimo)</div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALL TO ACTION */}
      <section className="bg-gray-900 text-white py-20 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para empezar tu proyecto?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Inicia sesión con tu cuenta de Google para empezar. Tus datos se guardarán de forma segura en la nube.
          </p>
          
          <div className="flex flex-col items-center gap-8">
            <Link 
                to="/dashboard" 
                className="inline-block bg-white text-gray-900 px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
            >
                Acceder al Panel de Control
            </Link>

            <div className="flex flex-col items-center">
                <p className="text-[10px] font-bold text-purple-300 uppercase tracking-widest mb-2">Created By</p>
                <div className="bg-[#0f172a] rounded-xl p-3 flex items-center gap-3 shadow-lg border border-gray-700">
                    <div className="bg-white p-0.5 rounded-full w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                        <img src="https://lh3.googleusercontent.com/d/1DkCOqFGdw3PZbyNUnTQNgeaAGjBfv1_e" alt="JCB Logo" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex-col flex overflow-hidden text-left">
                        <span className="text-white font-bold text-sm leading-tight">Juan Codina</span>
                        <span className="text-gray-400 text-[10px] truncate">Original Design & Dev</span>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
