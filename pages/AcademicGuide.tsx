
import React, { useState } from 'react';
import { BookOpen, Target, GraduationCap, Globe } from 'lucide-react';

export const AcademicGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ra' | 'ods'>('ra');

  const GENERAL_RAS = [
    {
      code: "RA1",
      title: "Analizar y caracterizar las empresas del sector según su estructura organizativa y la naturaleza de sus productos o servicios.",
      criteria: [
        "a) Se han identificado los modelos empresariales más representativos del sector.",
        "b) Se ha descrito la estructura organizativa típica de estas empresas.",
        "c) Se han definido las funciones y características de los principales departamentos.",
        "d) Se ha especificado el rol y las responsabilidades de cada área funcional.",
        "e) Se ha evaluado el volumen de negocio en función de las demandas y necesidades del cliente.",
        "f) Se ha diseñado una estrategia adecuada para responder a dichas demandas.",
        "g) Se ha valorado la dotación necesaria de recursos humanos y materiales.",
        "h) Se ha implementado un sistema de seguimiento de resultados acorde con la estrategia definida.",
        "i) Se ha establecido la relación entre los productos/servicios ofrecidos y su posible aporte a los Objetivos de Desarrollo Sostenible (ODS)."
      ]
    },
    {
      code: "RA2",
      title: "Proponer soluciones viables a las necesidades del sector, considerando costes y desarrollando un proyecto básico.",
      criteria: [
        "a) Se han detectado y priorizado las necesidades del sector.",
        "b) Se han generado, en equipo, propuestas de solución.",
        "c) Se ha recopilado información relevante sobre las soluciones planteadas.",
        "d) Se han incorporado elementos innovadores con potencial de aplicación práctica.",
        "e) Se ha realizado un análisis de viabilidad técnica de las propuestas.",
        "f) Se han definido las partes esenciales que componen el proyecto.",
        "g) Se ha estimado la dotación de recursos humanos y materiales requeridos.",
        "h) Se ha elaborado un presupuesto económico detallado.",
        "i) Se ha redactado la documentación técnica necesaria para el diseño del proyecto.",
        "j) Se han considerado los aspectos de calidad inherentes al proyecto.",
        "k) Se ha presentado públicamente el contenido más relevante del proyecto propuesto."
      ]
    },
    {
      code: "RA3",
      title: "Planificar la ejecución de las actividades derivadas de la solución propuesta, definiendo un plan de intervención y su documentación asociada.",
      criteria: [
        "a) Se ha establecido una cronología detallada para cada actividad.",
        "b) Se han asignado los recursos y la logística necesarios para cada fase.",
        "c) Se han identificado los permisos o autorizaciones obligatorios, en caso de requerirse.",
        "d) Se han detectado las actividades con riesgos potenciales durante su ejecución.",
        "e) Se ha integrado el plan de prevención de riesgos laborales y se han previsto los equipos de protección necesarios.",
        "f) Se han asignado recursos humanos y materiales específicos a cada tarea.",
        "g) Se han contemplado posibles contingencias o imprevistos.",
        "h) Se ha diseñado medidas correctivas para hacer frente a dichos imprevistos.",
        "i) Se ha elaborado toda la documentación técnica y administrativa requerida."
      ]
    },
    {
      code: "RA4",
      title: "Supervisar la ejecución de las actividades, asegurando el cumplimiento del plan establecido.",
      criteria: [
        "a) Se ha definido un procedimiento claro para el seguimiento de las actividades.",
        "b) Se ha verificado que los resultados obtenidos cumplen con los estándares de calidad esperados.",
        "c) Se han detectado desviaciones respecto al plan inicial o a los resultados previstos.",
        "d) Se ha comunicado oportunamente cualquier desviación relevante a los responsables.",
        "e) Se han implementado y documentado las acciones correctivas necesarias.",
        "f) Se ha generado la documentación final para la evaluación integral de las actividades y del proyecto global."
      ]
    },
    {
      code: "RA5",
      title: "Comunicar información de forma clara, ordenada y estructurada, tanto interna como externamente.",
      criteria: [
        "a) Se ha mantenido una actitud metódica y organizada en la transmisión de la información.",
        "b) Se ha facilitado comunicación verbal efectiva, tanto en horizontal (entre pares) como en vertical (con superiores o subordinados).",
        "c) Se ha utilizado herramientas informáticas para la comunicación interna en el equipo.",
        "d) Se ha adquirido familiaridad con la terminología técnica del sector en otros idiomas de uso internacional."
      ]
    }
  ];

  const SPECIFIC_RAS = [
    {
      module: "PRODUCTOS CULINARIOS (Código 0048)",
      items: [
        {
          code: "RA1",
          title: "Organiza los procesos productivos y de servicio en cocina, interpretando información oral o escrita.",
          criteria: ["a) Se han identificado y caracterizado los distintos ámbitos de producción y servicio en cocina."]
        },
        {
          code: "RA3",
          title: "Elabora productos culinarios a partir de un conjunto de materias primas, evaluando alternativas creativas y funcionales.",
          criteria: [
            "b) Se ha valorado el aprovechamiento integral de los recursos disponibles (materias primas, tiempos, técnicas).",
            "c) Se han diseñando elaboraciones que combinan los ingredientes de manera lógica, equilibrada y creativa."
          ]
        }
      ]
    },
    {
      module: "POSTRES EN RESTAURACIÓN (Código 0028)",
      items: [
        {
          code: "RA7",
          title: "Presenta postres emplatados a partir de elaboraciones de pastelería y repostería, integrando criterios estéticos y funcionales.",
          criteria: [
            "c) Se han aplicado técnicas de presentación y decoración acordes a las características del producto final y al contexto de servicio, garantizando equilibrio visual, textural y conceptual."
          ]
        }
      ]
    },
    {
      module: "OFERTAS GASTRONÓMICAS (Código 0045)",
      items: [
        {
          code: "RA4",
          title: "Calcula el coste global de la oferta gastronómica, analizando y ponderando todas las variables que lo componen.",
          criteria: [
            "d) Se han calculado y valorado los costes asociados a cada elaboración de cocina y/o pastelería/repostería, incluyendo materias primas, mano de obra, desperdicios, energía y otros gastos indirectos, con el fin de garantizar la viabilidad económica de la oferta."
          ]
        }
      ]
    }
  ];

  // ODS DATA - Manual list for better reliability than external images
  const ODS_DATA = [
    { id: 1, color: "bg-[#e5243b]", title: "Fin de la Pobreza", desc: "Poner fin a la pobreza en todas sus formas en todo el mundo." },
    { id: 2, color: "bg-[#dda63a]", title: "Hambre Cero", desc: "Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición." },
    { id: 3, color: "bg-[#4c9f38]", title: "Salud y Bienestar", desc: "Garantizar una vida sana y promover el bienestar para todos en todas las edades." },
    { id: 4, color: "bg-[#c5192d]", title: "Educación de Calidad", desc: "Garantizar una educación inclusiva, equitativa y de calidad." },
    { id: 5, color: "bg-[#ff3a21]", title: "Igualdad de Género", desc: "Lograr la igualdad entre los géneros y empoderar a todas las mujeres y niñas." },
    { id: 6, color: "bg-[#26bde2]", title: "Agua Limpia y Saneamiento", desc: "Garantizar la disponibilidad de agua y su gestión sostenible." },
    { id: 7, color: "bg-[#fcc30b]", title: "Energía Asequible", desc: "Garantizar el acceso a una energía asequible, segura, sostenible y moderna." },
    { id: 8, color: "bg-[#a21942]", title: "Trabajo Decente", desc: "Promover el crecimiento económico sostenido, inclusivo y sostenible." },
    { id: 9, color: "bg-[#fd6925]", title: "Industria e Innovación", desc: "Construir infraestructuras resilientes, promover la industrialización inclusiva." },
    { id: 10, color: "bg-[#dd1367]", title: "Reducción de las Desigualdades", desc: "Reducir la desigualdad en y entre los países." },
    { id: 11, color: "bg-[#fd9d24]", title: "Ciudades Sostenibles", desc: "Lograr que las ciudades sean más inclusivas, seguras, resilientes y sostenibles." },
    { id: 12, color: "bg-[#bf8b2e]", title: "Producción y Consumo", desc: "Garantizar modalidades de consumo y producción sostenibles." },
    { id: 13, color: "bg-[#3f7e44]", title: "Acción por el Clima", desc: "Adoptar medidas urgentes para combatir el cambio climático y sus efectos." },
    { id: 14, color: "bg-[#0a97d9]", title: "Vida Submarina", desc: "Conservar y utilizar en forma sostenible los océanos y mares." },
    { id: 15, color: "bg-[#56c02b]", title: "Vida de Ecosistemas", desc: "Gestionar sosteniblemente los bosques y luchar contra la desertificación." },
    { id: 16, color: "bg-[#00689d]", title: "Paz y Justicia", desc: "Promover sociedades justas, pacíficas e inclusivas." },
    { id: 17, color: "bg-[#19486a]", title: "Alianzas", desc: "Revitalizar la Alianza Mundial para el Desarrollo Sostenible." },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <GraduationCap className="text-blue-600" size={32} />
            Guía Académica y Normativa
        </h2>
        <p className="text-gray-600 mt-2">
            Referencia oficial de los Resultados de Aprendizaje (RA) y la Agenda 2030 (ODS) que guían este proyecto.
        </p>
      </div>

      <div className="flex border-b border-gray-200 mb-8 no-print">
        <button
            onClick={() => setActiveTab('ra')}
            className={`px-8 py-4 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'ra' ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            <BookOpen size={18} /> Resultados de Aprendizaje (RA)
        </button>
        <button
            onClick={() => setActiveTab('ods')}
            className={`px-8 py-4 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === 'ods' ? 'border-green-600 text-green-600 bg-green-50' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
            <Globe size={18} /> Agenda 2030 (ODS)
        </button>
      </div>

      {activeTab === 'ra' && (
        <div className="space-y-12">
            <section>
                <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r-lg">
                    <h3 className="text-2xl font-bold text-blue-900 mb-2">RAs Generales del Proyecto</h3>
                    <p className="text-sm text-blue-800 italic">
                        Fuente: BOLETÍN OFICIAL DEL ESTADO. Núm. 129, Martes 28 de mayo de 2024.
                    </p>
                </div>
                
                <div className="grid gap-6">
                    {GENERAL_RAS.map((ra) => (
                        <div key={ra.code} className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 text-blue-800 font-black px-3 py-1 rounded text-lg shrink-0">
                                    {ra.code}
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-4">{ra.title}</h4>
                                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Criterios de evaluación:</p>
                                        <ul className="space-y-2">
                                            {ra.criteria.map((crit, idx) => (
                                                <li key={idx} className="text-sm text-gray-700 leading-relaxed">
                                                    {crit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <div className="bg-orange-50 border-l-4 border-orange-500 p-6 mb-8 rounded-r-lg">
                    <h3 className="text-2xl font-bold text-orange-900 mb-2">RAs Específicos por Módulo</h3>
                    <p className="text-sm text-orange-800">
                        Criterios aplicados desde Productos Culinarios, Postres y Ofertas Gastronómicas.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {SPECIFIC_RAS.map((mod, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col h-full">
                            <h4 className="font-bold text-gray-800 border-b pb-2 mb-4 h-12 flex items-center">
                                {mod.module}
                            </h4>
                            <div className="space-y-6">
                                {mod.items.map((item) => (
                                    <div key={item.code}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded">
                                                {item.code}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 mb-2">{item.title}</p>
                                        <ul className="list-disc pl-4 space-y-1">
                                            {item.criteria.map((c, i) => (
                                                <li key={i} className="text-xs text-gray-600">{c}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
      )}

      {activeTab === 'ods' && (
        <div>
            <div className="bg-green-50 border-l-4 border-green-600 p-6 mb-8 rounded-r-lg">
                <h3 className="text-2xl font-bold text-green-900 mb-2">Agenda 2030: Objetivos de Desarrollo Sostenible</h3>
                <p className="text-sm text-green-800">
                    Tu proyecto debe alinearse con estos objetivos globales. Identifica en tus fichas técnicas y memoria qué ODS estás impactando.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {ODS_DATA.map((ods) => (
                    <div key={ods.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all flex flex-col overflow-hidden h-full">
                         <div className={`${ods.color} p-4 text-white flex justify-between items-center`}>
                            <span className="font-black text-2xl opacity-90">{ods.id}</span>
                            <Target size={24} className="opacity-80" />
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                            <h4 className="font-bold text-gray-900 text-lg mb-3 leading-tight">{ods.title}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed">{ods.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-8 bg-white p-6 rounded-xl border border-gray-200 text-center">
                <Target size={48} className="mx-auto text-green-600 mb-4" />
                <h4 className="text-lg font-bold text-gray-800 mb-2">¿Cómo aplicar los ODS a mi restaurante?</h4>
                <p className="text-gray-600 text-sm max-w-2xl mx-auto mb-4">
                    <strong>ODS 12 (Consumo Responsable):</strong> Usa productos de Km0 y minimiza desperdicios.<br/>
                    <strong>ODS 3 (Salud y Bienestar):</strong> Diseña menús equilibrados nutricionalmente.<br/>
                    <strong>ODS 8 (Trabajo Decente):</strong> Planifica condiciones laborales justas en tu análisis de RRHH.
                </p>
                <a href="https://ods.uam.es/agenda-2030-y-ods/" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-xs">
                    Ver fuente oficial (UAM)
                </a>
            </div>
        </div>
      )}
    </div>
  );
};
