import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { APPLIANCES } from '../../data/appliances';
import { BrandLogo } from '../common/BrandLogo';
import { InstallAppButton } from '../common/InstallAppButton';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20 no-print content-visibility-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <BrandLogo className="w-9 h-9" iconClassName="w-4 h-4" />
              <span className="text-xl font-bold tracking-tight text-white">
                axis<span className="text-emerald-400">caculator</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An independent, privacy-first electricity calculator providing transparent, accurate energy consumption and cost estimates for Indian households and appliances.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Zero server tracking. All household data stored 100% locally in your browser.</span>
            </div>
            <div className="pt-2">
              <InstallAppButton />
            </div>
          </div>

          {/* 15 Appliance Calculators - Column 1 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Cooling & Kitchen
            </h3>
            <ul className="space-y-2 text-sm">
              {APPLIANCES.slice(0, 8).map((app) => (
                <li key={app.slug}>
                  <Link
                    to={`/electricity-cost/${app.slug}`}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {app.name} Cost
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 15 Appliance Calculators - Column 2 */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Utility & Heating
            </h3>
            <ul className="space-y-2 text-sm">
              {APPLIANCES.slice(8).map((app) => (
                <li key={app.slug}>
                  <Link
                    to={`/electricity-cost/${app.slug}`}
                    className="text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    {app.name} Cost
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/appliance-cost-calculator"
                  className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium pt-1"
                >
                  View All 15 Appliances →
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Legal */}
          <div>
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Guides & Legal
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/compare-electricity-cost" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Compare & Savings Tool
                </Link>
              </li>
              <li>
                <Link to="/how-electricity-cost-is-calculated" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  How Electricity is Calculated
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  About & Methodology
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Privacy Policy (No Tracking)
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  Terms & Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Calculation Disclaimer & Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 space-y-3">
          <p className="leading-relaxed">
            <strong className="text-slate-400">Calculation Disclosure:</strong> axiscaculator calculates base electrical energy charges using the formula:{' '}
            <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">Energy (kWh) = Watts × Qty × Hours ÷ 1000</code>. Results are estimates. Actual electricity utility bills may include fixed meter charges, slab tariffs, fuel adjustment charges (FAC/FPPCA), electricity duties, and GST where applicable. Device duty cycles (e.g. refrigerator compressor cycles, air conditioner thermostat throttling) will cause actual consumption to vary.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div>
              © {new Date().getFullYear()} axiscaculator. Built for educational energy transparency.
            </div>
            <div className="flex items-center gap-4">
              <Link to="/privacy-policy" className="hover:text-slate-400">Privacy</Link>
              <span>•</span>
              <Link to="/terms" className="hover:text-slate-400">Terms</Link>
              <span>•</span>
              <Link to="/how-electricity-cost-is-calculated" className="hover:text-slate-400">Methodology</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
