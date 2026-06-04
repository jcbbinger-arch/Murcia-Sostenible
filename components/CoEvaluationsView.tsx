import React, { useState } from 'react';
import { Scale, ChevronDown, ChevronUp, User } from 'lucide-react';
import { PeerReview, TeamMember } from '../types';

interface ProjectSummary {
  id: string;
  name: string;
  team: TeamMember[];
  coEvaluations?: PeerReview[];
  coEvaluationPoints?: number;
}

interface UserProfile {
  uid: string;
  displayName: string;
}

export const CoEvaluationsView: React.FC<{ projects: ProjectSummary[], users: UserProfile[] }> = ({ projects, users }) => {
    const [view, setView] = useState<'project' | 'alphabetical'>('project');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRow = (id: string) => {
        const newSet = new Set(expandedRows);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setExpandedRows(newSet);
    };

    const getDisplayName = (uid: string) => users.find(u => u.uid === uid)?.displayName || 'Desconocido';

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Coevaluaciones Diabólicas</h3>
                        <p className="text-sm text-slate-500 font-medium">Revisión de las evaluaciones confidenciales entre alumnos.</p>
                    </div>
                    <Scale className="text-slate-300 w-8 h-8" />
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setView('project')} className={`px-4 py-2 rounded-lg text-xs font-bold ${view === 'project' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Por Proyecto</button>
                    <button onClick={() => setView('alphabetical')} className={`px-4 py-2 rounded-lg text-xs font-bold ${view === 'alphabetical' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>Alfabético (Alumnos)</button>
                </div>
            </div>

            {view === 'project' ? (
                <div className="p-8">
                    {projects.map(project => (
                        <div key={project.id} className="mb-8 p-6 bg-slate-50 rounded-2xl">
                            <h4 className="text-lg font-bold text-slate-900 mb-4">{project.name}</h4>
                            {project.team.map(member => {
                                const reviewsReceived = (project.coEvaluations || []).filter(rev => rev.targetId === member.id);
                                const avgScore = reviewsReceived.length > 0
                                    ? reviewsReceived.reduce((acc, rev) => acc + (rev.items.participation.score + rev.items.responsibility.score + rev.items.collaboration.score + rev.items.contribution.score), 0) / reviewsReceived.length
                                    : 0;

                                return (
                                    <div key={member.id} className="mb-4 bg-white p-4 rounded-xl shadow-sm">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">{member.name}</span>
                                            <span className={`font-black ${avgScore > 0 ? 'text-emerald-500' : avgScore < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                                                {avgScore > 0 ? '+' : ''}{avgScore.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs text-slate-500">
                                            <button onClick={() => toggleRow(`${project.id}-${member.id}`)} className="flex items-center text-emerald-600 font-bold">
                                                {expandedRows.has(`${project.id}-${member.id}`) ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                                                Ver evaluaciones
                                            </button>
                                            {expandedRows.has(`${project.id}-${member.id}`) && (
                                                <div className="mt-2 space-y-2">
                                                    {reviewsReceived.map((rev, i) => {
                                                        const evaluatorName = getDisplayName(rev.evaluatorId);
                                                        const score = (rev.items.participation.score + rev.items.responsibility.score + rev.items.collaboration.score + rev.items.contribution.score);
                                                        return (
                                                            <div key={i} className="p-2 bg-slate-50 rounded text-[10px]">
                                                                <p className="font-bold">Por {evaluatorName}: {score.toFixed(2)}</p>
                                                                <p className="italic text-slate-600">"{rev.items.participation.justification} | {rev.items.responsibility.justification} | {rev.items.collaboration.justification} | {rev.items.contribution.justification}"</p>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-8">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-slate-400 text-[10px] uppercase">
                                <th className="p-2">Apellido, Nombre</th>
                                <th className="p-2">Proyecto</th>
                                <th className="p-2">Media</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.filter(u => projects.some(p => p.team.some(m => m.id === u.uid))).sort((a,b) => a.displayName.localeCompare(b.displayName)).map(user => {
                                const userReviews = projects.flatMap(p => (p.coEvaluations || []).filter(rev => rev.targetId === user.uid));
                                const avgScore = userReviews.length > 0 
                                    ? userReviews.reduce((acc, rev) => acc + (rev.items.participation.score + rev.items.responsibility.score + rev.items.collaboration.score + rev.items.contribution.score), 0) / userReviews.length
                                    : 0;
                                const projectName = projects.find(p => p.team.some(m => m.id === user.uid))?.name || 'N/A';
                                return (
                                    <tr key={user.uid} className="border-t border-slate-50">
                                        <td className="p-2 font-bold text-sm">{user.displayName}</td>
                                        <td className="p-2 text-xs text-slate-500">{projectName}</td>
                                        <td className={`p-2 font-black ${avgScore > 0 ? 'text-emerald-500' : avgScore < 0 ? 'text-red-500' : 'text-slate-500'}`}>{avgScore.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};
