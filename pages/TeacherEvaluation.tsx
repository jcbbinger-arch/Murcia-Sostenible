
import React from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { Scale, Users, Star, MessageSquare, AlertCircle, TrendingUp, TrendingDown, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export const TeacherEvaluation: React.FC = () => {
  const { state } = useProject();
  const { profile, realProfile } = useAuth();

  const isAdmin = realProfile?.role === 'admin' || realProfile?.role === 'assistant';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Acceso Restringido</h2>
        <p className="text-gray-600 mt-2">Esta sección es exclusiva para el profesorado.</p>
      </div>
    );
  }

  const members = state.team;
  const reviews = state.coEvaluations;

  // Calculate stats for each member
  const memberStats = members.map(member => {
    const receivedReviews = reviews.filter(r => r.targetId === member.id);
    
    // Calculate total score for each review (sum of items)
    const reviewScores = receivedReviews.map(r => 
      r.items.participation.score + 
      r.items.responsibility.score + 
      r.items.collaboration.score + 
      r.items.contribution.score
    );

    const averageScore = reviewScores.length > 0
      ? reviewScores.reduce((acc, curr) => acc + curr, 0) / reviewScores.length
      : 0;
    
    return {
      ...member,
      receivedReviews: receivedReviews.map((r, i) => ({ ...r, totalScore: reviewScores[i] })),
      averageScore
    };
  });

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Scale size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Panel de Evaluación Docente</h1>
            <p className="text-slate-500">Revisión de la Coevaluación Diabólica y contribución individual.</p>
          </div>
        </div>
      </header>

      <div className="grid gap-8">
        {memberStats.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                    <Users size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{member.name}</h3>
                    <p className="text-sm text-slate-500 uppercase tracking-wider font-bold">
                      {member.isCoordinator ? 'Coordinador' : 'Miembro del Equipo'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Nota Media Compañeros</p>
                    <div className="flex items-center gap-2 justify-center">
                      <span className={`text-3xl font-black ${
                        member.averageScore >= 8 ? 'text-emerald-600' : 
                        member.averageScore >= 5 ? 'text-blue-600' : 'text-red-600'
                      }`}>
                        {member.averageScore.toFixed(1)}
                      </span>
                      <Star size={20} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Impacto Sugerido</p>
                    <div className="flex items-center gap-2 justify-center">
                      {member.averageScore >= 8 ? (
                        <div className="flex items-center gap-1 text-emerald-600 font-bold">
                          <TrendingUp size={20} />
                          <span>+1.0</span>
                        </div>
                      ) : member.averageScore <= 4 ? (
                        <div className="flex items-center gap-1 text-red-600 font-bold">
                          <TrendingDown size={20} />
                          <span>-1.0</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-bold">Neutral</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-4">
                  <MessageSquare size={16} className="text-emerald-600" />
                  Valoraciones Detalladas ({member.receivedReviews.length})
                </h4>

                {member.receivedReviews.length > 0 ? (
                  <div className="grid gap-4">
                    {member.receivedReviews.map((review, rIdx) => {
                      const evaluator = members.find(m => m.id === review.evaluatorId);
                      return (
                        <div key={rIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-slate-400 uppercase">
                              Evaluador: {evaluator?.name || 'Desconocido'}
                            </span>
                            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-lg border border-slate-200 text-xs font-bold">
                              <Star size={12} className="text-yellow-400 fill-yellow-400" />
                              {review.totalScore.toFixed(2)}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-slate-700 text-sm italic leading-relaxed">
                              <strong>Participación:</strong> {review.items.participation.justification || 'Sin comentarios'}
                            </p>
                            <p className="text-slate-700 text-sm italic leading-relaxed">
                              <strong>Responsabilidad:</strong> {review.items.responsibility.justification || 'Sin comentarios'}
                            </p>
                            <p className="text-slate-700 text-sm italic leading-relaxed">
                              <strong>Colaboración:</strong> {review.items.collaboration.justification || 'Sin comentarios'}
                            </p>
                            <p className="text-slate-700 text-sm italic leading-relaxed">
                              <strong>Contribución:</strong> {review.items.contribution.justification || 'Sin comentarios'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 text-sm">No hay valoraciones registradas para este miembro.</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="bg-slate-900 p-4 flex justify-between items-center">
                <p className="text-xs text-slate-400 italic">
                    * El profesor debe validar estas notas basándose en la justificación y la observación directa.
                </p>
                <div className="flex gap-2">
                    <button className="px-4 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors">
                        Aplicar Ajuste
                    </button>
                    <button className="px-4 py-1.5 bg-slate-700 text-white text-xs font-bold rounded-lg hover:bg-slate-600 transition-colors">
                        Descartar
                    </button>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 p-8 bg-emerald-50 rounded-[2rem] border border-emerald-100">
        <h3 className="text-lg font-bold text-emerald-900 mb-4 flex items-center gap-2">
            <GraduationCap size={24} />
            Guía de Calificación para el Profesor
        </h3>
        <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-emerald-800 mb-2">Puntuación 8-10</p>
                <p className="text-emerald-600">Considerar otorgar el punto adicional completo (+1.0) por excelencia en la participación.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-blue-800 mb-2">Puntuación 5-7</p>
                <p className="text-blue-600">Participación estándar. Mantener la nota de equipo sin ajustes significativos.</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="font-bold text-red-800 mb-2">Puntuación 0-4</p>
                <p className="text-red-600">Participación deficiente. Considerar penalización en la nota individual (-0.5 a -1.0).</p>
            </div>
        </div>
      </div>
    </div>
  );
};
