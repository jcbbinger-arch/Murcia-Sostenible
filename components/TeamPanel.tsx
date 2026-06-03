import React from 'react';
import { TeamMember } from '../types';
import { User } from 'lucide-react';

export const TeamPanel: React.FC<{ members: TeamMember[] }> = ({ members }) => {
  return (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm mb-12">
      <h3 className="text-xl font-black text-slate-900 tracking-tight mb-6 flex items-center gap-2">
        <User size={20} className="text-emerald-600" />
        Miembros del Equipo
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {members.map(member => (
          <div key={member.id} className="flex flex-col items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center font-black text-emerald-800 text-lg mb-2">
              {member.name.charAt(0)}
            </div>
            <span className="font-bold text-slate-900 text-sm text-center">{member.name}</span>
            {member.isCoordinator && (
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 uppercase tracking-wide">
                Coordinador
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
