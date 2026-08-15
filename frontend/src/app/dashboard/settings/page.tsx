'use client';

import { useState } from 'react';
import { Settings, Save, ShieldAlert, KeyRound, CheckCircle2 } from 'lucide-react';

export default function SettingsPage() {
  const [success, setSuccess] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Alex Kim',
    email: 'alex@fincorp.io',
    organization: 'FinCorp Inc.',
  });
  
  const [apiSettings, setApiSettings] = useState({
    endpoint: 'https://api.fininsight.io/v1',
    key: '••••••••••••••••••••••••••••••••',
  });

  const handleSave = () => {
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const sections = [
    {
      title: 'Account Settings',
      description: 'Manage your profile details and business settings.',
      icon: Settings,
      fields: [
        { 
          label: 'Name', 
          value: profile.name, 
          onChange: (v: string) => setProfile(prev => ({ ...prev, name: v })) 
        },
        { 
          label: 'Email Address', 
          value: profile.email, 
          onChange: (v: string) => setProfile(prev => ({ ...prev, email: v })),
          type: 'email'
        },
        { 
          label: 'Organization', 
          value: profile.organization, 
          onChange: (v: string) => setProfile(prev => ({ ...prev, organization: v })) 
        },
      ],
    },
    {
      title: 'API & Integrations',
      description: 'Configure endpoint connections for your FastAPI analytical server.',
      icon: KeyRound,
      fields: [
        { 
          label: 'FastAPI Service Endpoint', 
          value: apiSettings.endpoint, 
          onChange: (v: string) => setApiSettings(prev => ({ ...prev, endpoint: v })) 
        },
        { 
          label: 'Bearer Token (API Key)', 
          value: apiSettings.key, 
          onChange: (v: string) => setApiSettings(prev => ({ ...prev, key: v })),
          type: 'password'
        },
      ],
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto px-8 py-8 bg-[#f8fafc]">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div>
          <h2 className="text-lg font-bold text-[#0d1117]">Settings</h2>
          <p className="text-xs text-[#6b7280] mt-0.5">Control organization profiles, parameters, and AI connection credentials</p>
        </div>

        {/* Success Alert Notification */}
        {success && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 animate-fade-in shadow-2xs">
            <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
            <span className="text-xs font-bold text-emerald-800">
              Settings updated successfully! Local configuration re-initialized.
            </span>
          </div>
        )}

        {/* Settings Box Panels */}
        <div className="space-y-6">
          {sections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div key={idx} className="bg-white border border-[#e2e5ed] rounded-xl overflow-hidden shadow-3xs">
                {/* Section Header */}
                <div className="px-5 py-4 border-b border-[#e2e5ed] bg-[#f8fafc] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#4b5563]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#0d1117] tracking-tight">{sec.title}</h3>
                    <p className="text-[10px] text-[#6b7280] mt-0.5">{sec.description}</p>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="divide-y divide-[#f0f2f7]">
                  {sec.fields.map((f, fIdx) => (
                    <div key={fIdx} className="px-5 py-4 flex items-center justify-between flex-wrap gap-4 sm:flex-nowrap">
                      <span className="text-xs font-semibold text-[#4b5563] w-48">{f.label}</span>
                      <input
                        type={f.type || 'text'}
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        className="text-xs text-[#0d1117] bg-[#f8fafc] border border-[#e2e5ed] rounded-lg px-3 py-2 outline-none focus:border-[#1a4fcc] focus:bg-white w-full sm:w-80 text-left transition-all"
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1a4fcc] text-white text-xs font-bold rounded-lg hover:bg-[#1642b0] shadow-sm transition-all cursor-pointer select-none"
          >
            <Save size={14} />
            <span>Save Changes</span>
          </button>
        </div>

      </div>
    </div>
  );
}
