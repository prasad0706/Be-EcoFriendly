import React, { useMemo } from 'react';
import { Leaf, RefreshCcw, Recycle, Zap, Droplets, Package, Trash2, Clock, CheckCircle2 } from 'lucide-react';

const Toggle = ({ label, value, onChange }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 transition-all hover:bg-gray-100">
    <span className="text-xs font-bold text-gray-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
        value ? 'bg-primary' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          value ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);

const EcoImpactForm = ({ data, onChange }) => {
  // Extract values from nested data structure
  const { ecoDetails = {}, lifeCycleAnalysis = {} } = data.features || {};
  const { sustainabilityAnswers = {}, lifecycleAnswers = {}, materialComposition = {} } = ecoDetails;

  // Sync calculation logic
  const scores = useMemo(() => {
    let sustainabilityScore = 0;
    
    // Each Yes = +5 points
    const standardYesKeys = [
      'recycledMaterials', 'biodegradable', 'naturalMaterials', 'ecoCertified',
      'waterEfficient', 'lowCarbonProduction', 'recyclablePackaging', 'minimalPackaging'
    ];
    
    standardYesKeys.forEach(key => {
      if (sustainabilityAnswers[key]) sustainabilityScore += 5;
    });

    // Special scores
    if (lifecycleAnswers.reusable) sustainabilityScore += 8;
    if (lifecycleAnswers.repairable) sustainabilityScore += 8;
    if (lifecycleAnswers.compostable) sustainabilityScore += 8;
    if (sustainabilityAnswers.renewableEnergy) sustainabilityScore += 10;
    if (sustainabilityAnswers.plasticFreePackaging) sustainabilityScore += 10;
    
    // Sustainable material % × 0.3
    sustainabilityScore += (materialComposition.sustainablePercentage || 0) * 0.3;

    // Cap at 60
    const finalSustainabilityScore = Math.min(60, sustainabilityScore);

    // Life Cycle Savings Score (Higher Savings = Higher Score)
    const totalCO2Saved = lifeCycleAnalysis.totalCO2Saved || 0;
    let lifecycleScore = 0;
    if (totalCO2Saved >= 40) lifecycleScore = 40;
    else if (totalCO2Saved >= 30) lifecycleScore = 30;
    else if (totalCO2Saved >= 20) lifecycleScore = 20;
    else if (totalCO2Saved >= 10) lifecycleScore = 10;
    else lifecycleScore = 0;

    const totalEcoScore = Math.min(100, Math.round(finalSustainabilityScore + lifecycleScore));

    return {
      sustainability: finalSustainabilityScore,
      lifecycle: lifecycleScore,
      total: totalEcoScore,
      totalCO2Saved
    };
  }, [ecoDetails, lifeCycleAnalysis]);

  // Update parent when scores change (only if they actually changed to avoid infinite loops)
  React.useEffect(() => {
    if (data.features?.ecoScore !== scores.total || data.ecoScore !== scores.total) {
      onChange({
        ...data,
        ecoScore: scores.total,
        features: {
          ...data.features,
          ecoScore: scores.total,
          lifeCycleAnalysis: {
            ...lifeCycleAnalysis,
            totalCO2Saved: scores.totalCO2Saved
          }
        }
      });
    }
  }, [scores]);

  const updateSustainability = (key, val) => {
    onChange({
      ...data,
      features: {
        ...data.features,
        ecoDetails: {
          ...ecoDetails,
          sustainabilityAnswers: { ...sustainabilityAnswers, [key]: val }
        }
      }
    });
  };

  const updateLifecycle = (key, val) => {
    onChange({
      ...data,
      features: {
        ...data.features,
        ecoDetails: {
          ...ecoDetails,
          lifecycleAnswers: { ...lifecycleAnswers, [key]: val }
        }
      }
    });
  };

  const updateLCA = (key, val) => {
    const rawVal = parseFloat(val) || 0;
    const newLCA = { ...lifeCycleAnalysis, [key]: rawVal };
    const newTotal = Number((newLCA.rawMaterials + newLCA.manufacturing + newLCA.transportation + newLCA.usage + newLCA.disposal).toFixed(2));
    
    onChange({
      ...data,
      features: {
        ...data.features,
        lifeCycleAnalysis: { ...newLCA, totalCO2Saved: newTotal }
      }
    });
  };

  return (
    <div className="space-y-8 mt-8 border-t border-gray-100 pt-8">
      {/* Header Badge */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-primary rounded-2xl text-white shadow-lg">
            <Leaf className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">Eco Impact Assessment</h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Sustainability Intelligence Engine</p>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Calculated Eco Score</p>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-primary tracking-tighter">{scores.total}</span>
              <span className="text-lg font-bold text-gray-300">/ 100</span>
            </div>
          </div>
          <div className="w-32 h-3 bg-gray-100 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-500 shadow-[0_0_15px_rgba(47,185,115,0.5)]" 
               style={{ width: `${scores.total}%` }} 
             />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section 1 & 2 */}
        <div className="space-y-8">
          <div className="card-premium p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Recycle className="h-4 w-4 text-primary" />
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Material Sustainability</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <Toggle label="Recycled Materials?" value={sustainabilityAnswers.recycledMaterials} onChange={(v) => updateSustainability('recycledMaterials', v)} />
              <Toggle label="Biodegradable?" value={sustainabilityAnswers.biodegradable} onChange={(v) => updateSustainability('biodegradable', v)} />
              <Toggle label="Natural Material Based?" value={sustainabilityAnswers.naturalMaterials} onChange={(v) => updateSustainability('naturalMaterials', v)} />
              <Toggle label="Eco Certified?" value={sustainabilityAnswers.ecoCertified} onChange={(v) => updateSustainability('ecoCertified', v)} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">% Sustainable Material Used</label>
              <input
                type="number" min="0" max="100"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                value={ecoDetails.materialComposition?.sustainablePercentage || 0}
                onChange={(e) => onChange({
                  ...data,
                  features: {
                    ...data.features,
                    ecoDetails: {
                      ...ecoDetails,
                      materialComposition: { sustainablePercentage: parseInt(e.target.value) || 0 }
                    }
                  }
                })}
              />
            </div>
          </div>

          <div className="card-premium p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Zap className="h-4 w-4 text-yellow-500" />
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Manufacturing Impact</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Toggle label="Renewable Energy Used?" value={sustainabilityAnswers.renewableEnergy} onChange={(v) => updateSustainability('renewableEnergy', v)} />
              <Toggle label="Water-Efficient Manufacturing?" value={sustainabilityAnswers.waterEfficient} onChange={(v) => updateSustainability('waterEfficient', v)} />
              <Toggle label="Low Carbon Production?" value={sustainabilityAnswers.lowCarbonProduction} onChange={(v) => updateSustainability('lowCarbonProduction', v)} />
            </div>
          </div>
        </div>

        {/* Section 3 & 4 */}
        <div className="space-y-8">
          <div className="card-premium p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Package className="h-4 w-4 text-orange-500" />
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Packaging</h4>
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Toggle label="Plastic-Free Packaging?" value={sustainabilityAnswers.plasticFreePackaging} onChange={(v) => updateSustainability('plasticFreePackaging', v)} />
              <Toggle label="Recyclable Packaging?" value={sustainabilityAnswers.recyclablePackaging} onChange={(v) => updateSustainability('recyclablePackaging', v)} />
              <Toggle label="Minimal Packaging?" value={sustainabilityAnswers.minimalPackaging} onChange={(v) => updateSustainability('minimalPackaging', v)} />
            </div>
          </div>

          <div className="card-premium p-6 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <RefreshCcw className="h-4 w-4 text-blue-500" />
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Product Lifecycle</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <Toggle label="Reusable?" value={lifecycleAnswers.reusable} onChange={(v) => updateLifecycle('reusable', v)} />
              <Toggle label="Repairable?" value={lifecycleAnswers.repairable} onChange={(v) => updateLifecycle('repairable', v)} />
              <Toggle label="Compostable?" value={lifecycleAnswers.compostable} onChange={(v) => updateLifecycle('compostable', v)} />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Expected Lifespan (Years)</label>
              <input
                type="number" min="0" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-primary outline-none font-bold"
                value={lifecycleAnswers.lifespan || 0}
                onChange={(e) => updateLifecycle('lifespan', parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: LCA */}
      <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Droplets className="w-32 h-32" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Leaf className="h-5 w-5 text-primary" />
            <h4 className="text-lg font-black uppercase tracking-tighter">Life Cycle Savings (CO2 Saved)</h4>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {[
              { label: 'CO2 Saved (Materials)', key: 'rawMaterials' },
              { label: 'CO2 Saved (Production)', key: 'manufacturing' },
              { label: 'CO2 Saved (Logistics)', key: 'transportation' },
              { label: 'CO2 Saved (Usage)', key: 'usage' },
              { label: 'CO2 Saved (End-of-life)', key: 'disposal' }
            ].map(field => (
              <div key={field.key}>
                <label className="block text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">{field.label}</label>
                <input
                  type="number" step="0.01" min="0"
                  className="w-full bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white font-bold focus:bg-white/20 outline-none transition-all"
                  value={lifeCycleAnalysis[field.key] || 0}
                  onChange={(e) => updateLCA(field.key, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                 <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Aggregate Climate Impact</p>
                <p className="text-xl font-black">Total CO2 Saved</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-4xl font-black text-primary tracking-tighter">{scores.totalCO2Saved}</span>
              <span className="ml-2 text-sm font-bold text-white/40">kg Saved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcoImpactForm;
