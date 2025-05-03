import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import { X, Plus, Trash2, AlertTriangle, Globe, Mail, Search, Shield } from 'lucide-react';
import { BlacklistRule } from '../../types/types';
import { updateUserSettings, updateBlacklistRules } from '../../services/settingsService';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  organizationDomain: string;
  setOrganizationDomain: (domain: string) => void;
  blacklistRules: BlacklistRule[];
  setBlacklistRules: (rules: BlacklistRule[]) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  open,
  onOpenChange,
  organizationDomain,
  setOrganizationDomain,
  blacklistRules,
  setBlacklistRules
}) => {
  const [newRule, setNewRule] = useState({
    type: 'domain' as const,
    value: '',
    severity: 'medium' as const,
    description: ''
  });
  
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (organizationDomain) {
      updateUserSettings(organizationDomain);
    }
  }, [organizationDomain]);

  useEffect(() => {
    updateBlacklistRules(blacklistRules);
  }, [blacklistRules]);

  const handleAddRule = () => {
    if (newRule.value && newRule.description) {
      const updatedRules = [
        ...blacklistRules,
        {
          id: Math.random().toString(36).substr(2, 9),
          ...newRule
        }
      ];
      setBlacklistRules(updatedRules);
      setNewRule({
        type: 'domain',
        value: '',
        severity: 'medium',
        description: ''
      });
    }
  };

  const handleRemoveRule = (id: string) => {
    const rule = blacklistRules.find(r => r.id === id);
    if (rule?.severity === 'high') {
      setRuleToDelete(id);
      setShowDeleteWarning(true);
    } else {
      const updatedRules = blacklistRules.filter(rule => rule.id !== id);
      setBlacklistRules(updatedRules);
    }
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      const updatedRules = blacklistRules.filter(rule => rule.id !== ruleToDelete);
      setBlacklistRules(updatedRules);
      setShowDeleteWarning(false);
      setRuleToDelete(null);
    }
  };

  const getRuleIcon = (type: string) => {
    switch (type) {
      case 'domain':
        return <Globe size={16} />;
      case 'email':
        return <Mail size={16} />;
      case 'keyword':
        return <Search size={16} />;
      default:
        return <Shield size={16} />;
    }
  };

  const getTypeDescription = () => {
    switch (newRule.type) {
      case 'domain':
        return "Block emails from specific domains";
      case 'email':
        return "Block specific email addresses";
      case 'keyword':
        return "Block emails containing specific words or phrases";
      default:
        return "";
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg overflow-y-auto">
          {showDeleteWarning ? (
            <div className="p-4">
              <div className="flex items-center mb-4 text-red-600">
                <AlertTriangle className="mr-2" size={24} />
                <h3 className="text-lg font-medium">Delete High-Priority Rule?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                You are about to delete a high-priority security rule. This could potentially expose your organization to security risks. Are you sure you want to proceed?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteWarning(false);
                    setRuleToDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  Delete Rule
                </button>
              </div>
            </div>
          ) : (
            <>
              <Dialog.Title className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="mr-2 text-blue-600" size={24} />
                Security Settings
              </Dialog.Title>

              <div className="space-y-6">
                {/* Organization Domain */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Domain
                  </label>
                  <p className="text-sm text-gray-500 mb-3">
                    Emails from outside this domain will be marked as external
                  </p>
                  <div className="flex items-center bg-white rounded-md border border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                    <span className="text-gray-500 pl-3">@</span>
                    <input
                      type="text"
                      value={organizationDomain}
                      onChange={(e) => setOrganizationDomain(e.target.value)}
                      className="flex-1 px-2 py-2 text-sm border-0 focus:ring-0"
                      placeholder="company.com"
                    />
                  </div>
                </div>

                {/* Blacklist Rules */}
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <AlertTriangle className="mr-2 text-yellow-600" size={20} />
                    Security Rules
                  </h3>
                  
                  {/* Existing Rules */}
                  <div className="space-y-3 mb-4">
                    {blacklistRules.map((rule) => (
                      <div
                        key={rule.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-start space-x-3">
                          <div className="mt-1 text-gray-500">
                            {getRuleIcon(rule.type)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{rule.value}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                rule.severity === 'high' ? 'bg-red-100 text-red-800' :
                                rule.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {rule.severity}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{rule.description}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveRule(rule.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Rule */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                    <h4 className="font-medium text-gray-700">Add New Rule</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Type
                        </label>
                        <div className="relative">
                          <select
                            value={newRule.type}
                            onChange={(e) => setNewRule({ ...newRule, type: e.target.value as any })}
                            className="w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm appearance-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="domain">Domain</option>
                            <option value="email">Email</option>
                            <option value="keyword">Keyword</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{getTypeDescription()}</p>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Severity
                        </label>
                        <div className="relative">
                          <select
                            value={newRule.severity}
                            onChange={(e) => setNewRule({ ...newRule, severity: e.target.value as any })}
                            className="w-full rounded-md border border-gray-300 pl-3 pr-8 py-2 text-sm appearance-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Value to Block
                      </label>
                      <input
                        type="text"
                        value={newRule.value}
                        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder={
                          newRule.type === 'domain' ? 'suspicious-domain.com' :
                          newRule.type === 'email' ? 'suspicious@domain.com' :
                          'suspicious keyword or phrase'
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={newRule.description}
                        onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder="Why is this being blocked?"
                      />
                    </div>

                    <button
                      onClick={handleAddRule}
                      disabled={!newRule.value || !newRule.description}
                      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={16} className="mr-2" />
                      Add Security Rule
                    </button>
                  </div>
                </div>
              </div>

              <Dialog.Close className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                <X size={20} />
              </Dialog.Close>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SettingsDialog;