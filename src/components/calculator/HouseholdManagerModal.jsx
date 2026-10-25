import React, { useState, useEffect } from 'react';
import { X, Save, FolderOpen, Edit3, Trash2, RotateCcw, AlertTriangle, Check } from 'lucide-react';
import {
  getSavedHouseholds,
  saveNamedHousehold,
  deleteNamedHousehold,
  renameNamedHousehold,
  resetHouseholdToDefault,
} from '../../utils/storage';

export function HouseholdManagerModal({
  isOpen,
  onClose,
  currentAppliances,
  currentSettings,
  onLoadHousehold,
  onResetHousehold,
}) {
  const [households, setHouseholds] = useState([]);
  const [newHouseholdName, setNewHouseholdName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const refreshList = () => {
    setHouseholds(getSavedHouseholds());
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setShowResetConfirm(false);
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveCurrent = (e) => {
    e.preventDefault();
    if (!newHouseholdName.trim()) return;

    saveNamedHousehold(newHouseholdName.trim(), currentAppliances, currentSettings);
    setNewHouseholdName('');
    refreshList();
    setStatusMessage('Configuration saved locally!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  const handleStartRename = (h) => {
    setEditingId(h.id);
    setEditName(h.name);
  };

  const handleSaveRename = (id) => {
    if (editName.trim()) {
      renameNamedHousehold(id, editName.trim());
      setEditingId(null);
      refreshList();
    }
  };

  const handleDelete = (id) => {
    deleteNamedHousehold(id);
    refreshList();
  };

  const handleReset = () => {
    const defaultConfig = resetHouseholdToDefault();
    onResetHousehold(defaultConfig);
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FolderOpen className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Manage Household Setups</h2>
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

        {statusMessage && (
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 text-xs px-3 py-2 rounded-lg font-medium border border-emerald-200">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Save Current Configuration Form */}
        <form onSubmit={handleSaveCurrent} className="space-y-2">
          <label htmlFor="household-name-input" className="block text-xs font-semibold text-slate-700">
            Save Current Calculator Setup:
          </label>
          <div className="flex gap-2">
            <input
              id="household-name-input"
              type="text"
              placeholder="e.g. Summer Setup, Office, 3BHK Flat..."
              value={newHouseholdName}
              onChange={(e) => setNewHouseholdName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!newHouseholdName.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
          <p className="text-[11px] text-slate-500">
            Stored locally in your current browser. No login required.
          </p>
        </form>

        {/* Saved Profiles List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
            Saved Households ({households.length})
          </h3>

          {households.length === 0 ? (
            <div className="text-center py-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-xs text-slate-500">
              No custom households saved yet. Save your current setup above to access it anytime!
            </div>
          ) : (
            <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
              {households.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-emerald-300 transition-all text-sm"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    {editingId === h.id ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="px-2 py-1 text-xs border rounded w-full"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRename(h.id)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Save Name"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <div className="font-semibold text-slate-800 truncate">{h.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {h.appliances?.length || 0} appliances • Rate ₹{h.settings?.electricityRate || 7}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadHousehold(h);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-md transition-colors"
                    >
                      Load
                    </button>
                    <button
                      type="button"
                      onClick={() => handleStartRename(h)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-md transition-colors"
                      title="Rename"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(h.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset to Default Safeguard */}
        <div className="pt-4 border-t border-slate-100">
          {!showResetConfirm ? (
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset calculator to factory default appliances
            </button>
          ) : (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-800">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Confirm Reset?</span>
              </div>
              <p className="text-xs text-rose-700">
                This will reset your current active appliances list to default presets. Any unsaved changes will be lost.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold transition-colors"
                >
                  Yes, Reset Everything
                </button>
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-3 py-1 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded text-xs font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
