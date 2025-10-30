"use client"

import React, { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { CheckCircle2, XCircle, Loader2, Upload, Database } from 'lucide-react';

interface Log {
  message: string;
  type: 'info' | 'error' | 'success';
  time: string;
}

interface IconData {
  name: string;
}

interface ApiResponse {
  docs: IconData[];
}

export default function IconImporter() {
  const [allIcons, setAllIcons] = useState<string[]>([]);
  const [existingIcons, setExistingIcons] = useState<Set<string>>(new Set());
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [imported, setImported] = useState(0);
  const [failed, setFailed] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    // Get all Lucide icon names
    const iconNames = Object.keys(LucideIcons).filter(
      (key) => {
        // Exclude non-icon exports
        if (key === 'createLucideIcon' || key === 'icons' || key === 'default') {
          return false;
        }
        // Check if it's a valid React component (starts with uppercase)
        return key[0] === key[0].toUpperCase();
      }
    );
    
    console.log('Found icons:', iconNames.length, iconNames.slice(0, 10));
    setAllIcons(iconNames);
    
    // Fetch existing icons
    fetchExistingIcons();
  }, []);

  const fetchExistingIcons = async () => {
    try {
      const response = await fetch('/api/icons?limit=1000');
      const data: ApiResponse = await response.json();
      const existing = new Set(data.docs.map((icon: IconData) => icon.name));
      setExistingIcons(existing);
      addLog(`Found ${existing.size} existing icons in database`, 'info');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      addLog(`Error fetching existing icons: ${errorMessage}`, 'error');
    }
  };

  const addLog = (message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setLogs(prev => [...prev, { message, type, time: new Date().toLocaleTimeString() }]);
  };

  const importIcons = async () => {
    setImporting(true);
    setProgress(0);
    setImported(0);
    setFailed(0);
    setComplete(false);
    setLogs([]);

    const iconsToImport = allIcons.filter(name => !existingIcons.has(name));
    const batchSize = 10;
    const totalBatches = Math.ceil(iconsToImport.length / batchSize);

    addLog(`Starting import of ${iconsToImport.length} new icons in ${totalBatches} batches`, 'info');

    for (let i = 0; i < iconsToImport.length; i += batchSize) {
      const batch = iconsToImport.slice(i, i + batchSize);
      const batchNumber = Math.floor(i / batchSize) + 1;

      addLog(`Processing batch ${batchNumber}/${totalBatches} (${batch.length} icons)`, 'info');

      await Promise.all(
        batch.map(async (iconName) => {
          try {
            const response = await fetch('/api/icons', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name: iconName }),
            });

            if (response.ok) {
              setImported(prev => prev + 1);
              setExistingIcons(prev => new Set([...prev, iconName]));
            } else {
              const error = await response.json();
              if (!error.message?.includes('unique')) {
                setFailed(prev => prev + 1);
                addLog(`Failed: ${iconName} - ${error.message}`, 'error');
              } else {
                setImported(prev => prev + 1);
              }
            }
          } catch (error) {
            setFailed(prev => prev + 1);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            addLog(`Failed: ${iconName} - ${errorMessage}`, 'error');
          }
        })
      );

      setProgress(Math.round(((i + batch.length) / iconsToImport.length) * 100));
      
      // Small delay between batches to avoid overwhelming the server
      if (i + batchSize < iconsToImport.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    setComplete(true);
    setImporting(false);
    addLog('Import complete!', 'success');
  };

  const newIconsCount = allIcons.filter(name => !existingIcons.has(name)).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Database className="w-12 h-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Lucide Icons Importer</h1>
          </div>
          <p className="text-gray-600">Import all Lucide icons into your Payload CMS</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
            <div className="text-sm text-gray-600 mb-1">Total Icons</div>
            <div className="text-3xl font-bold text-gray-900">{allIcons.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
            <div className="text-sm text-gray-600 mb-1">In Database</div>
            <div className="text-3xl font-bold text-gray-900">{existingIcons.size}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-1">To Import</div>
            <div className="text-3xl font-bold text-gray-900">{newIconsCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
            <div className="text-sm text-gray-600 mb-1">Coverage</div>
            <div className="text-3xl font-bold text-gray-900">
              {allIcons.length > 0 ? Math.round((existingIcons.size / allIcons.length) * 100) : 0}%
            </div>
          </div>
        </div>

        {/* Import Control */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <button
            onClick={importIcons}
            disabled={importing || newIconsCount === 0}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center gap-3 transition-all ${
              importing || newIconsCount === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {importing ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Importing... {progress}%
              </>
            ) : newIconsCount === 0 ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                All Icons Imported
              </>
            ) : (
              <>
                <Upload className="w-6 h-6" />
                Import {newIconsCount} Icons
              </>
            )}
          </button>

          {importing && (
            <div className="mt-6">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-3">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Imported: {imported}
                </span>
                {failed > 0 && (
                  <span className="flex items-center gap-1">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Failed: {failed}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logs */}
        {logs.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Import Log</h2>
            <div className="bg-gray-50 rounded-lg p-4 max-h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`py-1 ${
                    log.type === 'error'
                      ? 'text-red-600'
                      : log.type === 'success'
                      ? 'text-green-600'
                      : 'text-gray-700'
                  }`}
                >
                  <span className="text-gray-400">[{log.time}]</span> {log.message}
                </div>
              ))}
            </div>
          </div>
        )}

        {complete && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-green-900 mb-1">Import Complete!</h3>
              <p className="text-green-700">
                Successfully imported {imported} icons. {failed > 0 && `${failed} failed.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}