import React, { useState } from 'react';

export const LeadForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '', phone: '', email: '', location: '', property_type: 'Residential', system_size: '', source: 'Website'
  });
  const [validationError, setvalidationError] = useState({});
  const [errorBanner, setErrorBanner] = useState('');

  const runFormValidations = () => {
    const errs = {};
    if (!formData.full_name.trim()) errs.full_name = 'name required';
    if (!/^\d{10}$/.test(formData.phone)) errs.phone = 'Requires a strict 10-digit mobile number';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Follow validation structure';
    if (!formData.location.trim()) errs.location = 'identifier missing';
    
    const parsedCapacity = parseFloat(formData.system_size);
    if (isNaN(parsedCapacity) || parsedCapacity < 1 || parsedCapacity > 100) {
      errs.system_size = 'Range must be within 1 - 100 kW boundaries';
    }

    setvalidationError(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (!runFormValidations()) return;

    try {
      const response = await fetch('http://localhost:5000/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Server error: ${response.status}`);
      }
      
      setFormData({ full_name: '', phone: '', email: '', location: '', property_type: 'Residential', system_size: '', source: 'Website' });
      setvalidationError({});
      setErrorBanner('');
      onSuccess();
    } catch (err) {
      setErrorBanner(err.message || 'Transmission exception handling remote persistence parameters');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Capture New Lead Record</h2>
      {errorBanner && <div className="mb-4 text-xs font-medium p-3 bg-red-50 text-red-600 rounded-md border border-red-100">{errorBanner}</div>}
      
      <form onSubmit={handleFormSubmission} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
          <input type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none transition-shadow" />
          {validationError.full_name && <span className="text-xs text-red-500 font-medium mt-1 block">{validationError.full_name}</span>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contact Number</label>
            <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
            {validationError.phone && <span className="text-xs text-red-500 font-medium mt-1 block">{validationError.phone}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email ID</label>
            <input type="text" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
            {validationError.email && <span className="text-xs text-red-500 font-medium mt-1 block">{validationError.email}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City Location</label>
            <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
            {validationError.location && <span className="text-xs text-red-500 font-medium mt-1 block">{validationError.location}</span>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">System Size (kW)</label>
            <input type="number" value={formData.system_size} onChange={e => setFormData({...formData, system_size: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md focus:ring-1 focus:ring-indigo-500 outline-none" />
            {validationError.system_size && <span className="text-xs text-red-500 font-medium mt-1 block">{validationError.system_size}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Property Type</label>
            <select value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md bg-white outline-none">
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Source</label>
            <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} className="w-full p-2 text-sm border border-slate-300 rounded-md bg-white outline-none">
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Walk-in">Walk-in</option>
              <option value="Social Media">Social Media</option>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-2.5 px-4 rounded-md shadow-xs transition duration-150 transform active:scale-98 mt-2">
          Commit System Entry
        </button>
      </form>
    </div>
  );
};