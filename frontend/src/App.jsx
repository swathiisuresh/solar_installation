import React, { useState, useEffect, useCallback } from 'react';
import { Dashboard } from './components/Dashboard';
import { LeadForm } from './components/LeadForm';
import { LeadTable } from './components/LeadTable';

export const App = () => {
  const [leads, setLeads] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Structural Tracking Controls for Filtering Matrix
  const [statusFilter, setStatusFilter] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const syncApplicationData = useCallback(async () => {
    try {
      const urlQueryBuilder = new URLSearchParams();
      if (statusFilter) urlQueryBuilder.append('status', statusFilter);
      if (locationSearch) urlQueryBuilder.append('searchLocation', locationSearch);
      if (startDate) urlQueryBuilder.append('startDate', startDate);
      if (endDate) urlQueryBuilder.append('endDate', endDate);

      const leadsResponse = await fetch(`http://localhost:5000/api/leads?${urlQueryBuilder.toString()}`);
      if (!leadsResponse.ok) {
        console.error(`Leads API error: ${leadsResponse.status}`);
        setLeads([]);
      } else {
        const leadsData = await leadsResponse.json();
        setLeads(Array.isArray(leadsData) ? leadsData : []);
      }

      const analyticsResponse = await fetch('http://localhost:5000/api/analytics');
      if (!analyticsResponse.ok) {
        console.error(`Analytics API error: ${analyticsResponse.status}`);
        setAnalytics(null);
      } else {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData);
      }
    } catch (err) {
      console.error('Data link synchronization failure:', err);
      setLeads([]);
      setAnalytics(null);
    }
  }, [statusFilter, locationSearch, startDate, endDate]);

  useEffect(() => {
    syncApplicationData();
  }, [syncApplicationData]);

  const handlePipelineShift = async (id, updatedStatus) => {
    try {
      await fetch(`http://localhost:5000/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: updatedStatus })
      });
      syncApplicationData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemovalExecution = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/leads/${id}`, { method: 'DELETE' });
      syncApplicationData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">Golden Ray Renewable Energy LLP</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard analytics={analytics} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1">
            <LeadForm onSuccess={syncApplicationData} />
          </div>

          <div className="lg:col-span-2 space-y-4">

            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Live Filter Matrix</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <input 
                  type="text" placeholder="Filter location..." value={locationSearch} 
                  onChange={e => setLocationSearch(e.target.value)} 
                  className="p-2 text-sm border border-slate-300 rounded-md outline-none focus:ring-1 focus:ring-indigo-500" 
                />
                
                <select 
                  value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                  className="p-2 text-sm border border-slate-300 rounded-md bg-white text-slate-600 outline-none"
                >
                  <option value="">All Pipelines</option>
                  <option value="New Lead">New Lead</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>

                <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-1.5 text-xs border border-slate-300 rounded-md text-slate-600 outline-none" />
                <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-1.5 text-xs border border-slate-300 rounded-md text-slate-600 outline-none" />
              </div>
            </div>

            <LeadTable leads={leads} onStatusUpdate={handlePipelineShift} onDelete={handleRemovalExecution} />
          </div>
        </div>
      </main>
    </div>
  );
};
export default App;