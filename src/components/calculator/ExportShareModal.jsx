import React, { useState } from 'react';
import { X, Printer, Share2, Copy, Check, FileSpreadsheet, Code } from 'lucide-react';
import { formatCurrency, formatEnergy } from '../../utils/formatting';

export function ExportShareModal({
  isOpen,
  onClose,
  appliances,
  settings,
  totals,
  period,
  periodDays,
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Print Handler
  const handlePrint = () => {
    window.print();
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = [
      'Appliance Name',
      'Power (Watts)',
      'Quantity',
      'Daily Hours',
      'Daily kWh',
      'Period kWh',
      'Period Cost (INR)',
      'Status',
    ];

    const rows = appliances.map((app) => {
      const dailyKwh = (Number(app.watts) * Number(app.quantity) * Number(app.hoursPerDay)) / 1000;
      const pKwh = dailyKwh * Number(periodDays);
      const pCost = pKwh * Number(settings.electricityRate);
      return [
        `"${app.customName.replace(/"/g, '""')}"`,
        app.watts,
        app.quantity,
        app.hoursPerDay,
        dailyKwh.toFixed(3),
        pKwh.toFixed(3),
        pCost.toFixed(2),
        app.isEnabled ? 'Active' : 'Disabled',
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `axiscaculator-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export JSON Handler
  const handleExportJSON = () => {
    const data = {
      generator: 'axiscaculator (https://axiscaculator.com)',
      exportedAt: new Date().toISOString(),
      period,
      periodDays,
      settings,
      totals,
      appliances,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `axiscaculator-config-${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Text Summary for messaging / WhatsApp
  const handleCopySummary = () => {
    let summary = `⚡ Household Electricity Cost Report (axiscaculator)\n`;
    summary += `Period: ${period.toUpperCase()} (${periodDays} days) @ ₹${settings.electricityRate}/kWh\n`;
    summary += `Total Consumption: ${formatEnergy(
      period === 'daily'
        ? totals.dailyKwh
        : period === 'yearly'
        ? totals.yearlyKwh
        : totals.monthlyKwh
    )}\n`;
    summary += `Total Estimated Cost: ${formatCurrency(
      period === 'daily'
        ? totals.dailyCost
        : period === 'yearly'
        ? totals.yearlyCost
        : totals.monthlyCost
    )}\n\n`;
    summary += `Appliance Breakdown:\n`;

    appliances
      .filter((a) => a.isEnabled)
      .forEach((a, i) => {
        const dailyKwh = (a.watts * a.quantity * a.hoursPerDay) / 1000;
        const pCost = dailyKwh * periodDays * settings.electricityRate;
        summary += `${i + 1}. ${a.customName} (${a.watts}W × ${a.quantity} qty × ${a.hoursPerDay}h) → ${formatCurrency(pCost)}\n`;
      });

    summary += `\nCalculated at https://axiscaculator.com`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Export & Share Report</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Print / Save as PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">
                Print / Save PDF
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Clean printable report formatted for paper & PDF
              </div>
            </div>
          </button>

          {/* Copy Summary */}
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">
                {copied ? 'Copied to Clipboard!' : 'Copy Summary'}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Formatted text breakdown for WhatsApp or Email
              </div>
            </div>
          </button>

          {/* Export CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">
                Export to CSV
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Open in Microsoft Excel or Google Sheets
              </div>
            </div>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJSON}
            className="flex items-start gap-3 p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all text-left group"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-emerald-100 text-slate-700 group-hover:text-emerald-700 flex items-center justify-center shrink-0">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-800 group-hover:text-emerald-900">
                Export Raw JSON
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Full machine-readable backup configuration
              </div>
            </div>
          </button>
        </div>

        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
