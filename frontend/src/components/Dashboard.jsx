import React from 'react';

export const Dashboard = ({ analytics }) => {
  if (!analytics) return <div className="p-4 text-slate-500 font-medium">Computing metrics array...</div>;

  const pipelineStages = ['New Lead', 'Contacted', 'Site Visit Scheduled', 'Proposal Sent', 'Won', 'Lost'];

  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-5 bg-gradient-to-br from-black-700 to-black-800 rounded-xl border border-blue-600 shadow-xs">
          <p className="text-xs font-semibold text-black uppercase ">Total Operations</p>
          <p className="text-3xl font-black text-black mt-1">{analytics.totalLeads}</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-black-50 to-black-100 rounded-xl border border-green-600 shadow-xs">
          <p className="text-xs font-semibold text-black uppercase">Conversion Efficiency</p>
          <p className="text-3xl font-black text-black mt-1">{analytics.conversionRate}%</p>
        </div>
        <div className="p-5 bg-gradient-to-br from-black-50 to-black-100 rounded-xl border border-yellow-600 shadow-xs">
          <p className="text-xs font-semibold text-black uppercase ">Active Pipeline</p>
          <p className="text-3xl font-black text-black mt-1">
            {analytics.totalLeads - ((analytics.statusCounts['Won'] || 0) + (analytics.statusCounts['Lost'] || 0))}
          </p>
        </div>
        <div className="p-5 bg-gradient-to-br from-black-50 to-black-100 rounded-xl border border-black-600 shadow-xs">
          <p className="text-xs font-semibold text-black uppercase">Closed Deal Items</p>
          <p className="text-3xl font-black text-black mt-1">
            {(analytics.statusCounts['Won'] || 0) + (analytics.statusCounts['Lost'] || 0)}
          </p>
        </div>
      </div>

    {/* boxes */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Leads Broken Down by Stages</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {pipelineStages.map(stage => (
            <div key={stage} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
              <span className="block text-xs font-medium text-slate-500 truncate">{stage}</span>
              <span className="text-lg font-bold text-slate-800 mt-0.5 block">{analytics.statusCounts[stage] || 0}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};