import React from 'react';

export const LeadTable = ({ leads, onStatusUpdate, onDelete }) => {
  const statusArray = ['New Lead', 'Contacted', 'Site Visit Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  const dynamicStatusBadges = (currentStatus) => {
    switch (currentStatus) {
      case 'New Lead': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Contacted': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Site Visit Scheduled': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Proposal Sent': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Won': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Lost': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <th className="p-4">Lead Profile</th>
              <th className="p-4">Property </th>
              <th className="p-4">Source</th>
              <th className="p-4">Status Tag</th>
              <th className="p-4 text-right">Workflow Options</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">No valid entries align with query conditions</td>
              </tr>
            ) : (
              leads?.map(lead => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{lead.full_name}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lead.phone} | {lead.email}</div>
                    <div className="text-xs text-slate-400 mt-1">Logged: {new Date(lead.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-800">{lead.location}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lead.property_type} — <span className="font-bold text-slate-700">{lead.system_size} kW</span></div>
                  </td>
                  <td className="p-4">
                    <span className="inline-block bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-medium border border-slate-200">
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs px-2.5 py-1 rounded-full font-bold border ${dynamicStatusBadges(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-y-2 sm:space-y-0 sm:space-x-2 whitespace-nowrap">
                    <select 
                      value={lead.status} 
                      onChange={e => onStatusUpdate(lead.id, e.target.value)}
                      className="text-xs p-1.5 border border-slate-300 rounded bg-white font-semibold text-slate-700 outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {statusArray.map(stage => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                    <button 
                      onClick={() => { if(confirm('Erase this customer profile data?')) onDelete(lead.id); }}
                      className="text-xs text-rose-600 hover:bg-rose-50 font-semibold px-2.5 py-1.5 rounded border border-transparent hover:border-rose-100 transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};