import React, { useState } from 'react';
import { UploadCloud, Lock, FileText, CheckCircle, ShieldCheck } from 'lucide-react';
import { parseHealthFileContent, ParsedHealthSummary } from '../lib/wasm_parser';

interface AnonymousUploadBoxProps {
  onParsed: (summary: ParsedHealthSummary) => void;
}

export const AnonymousUploadBox: React.FC<AnonymousUploadBoxProps> = ({ onParsed }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsing, setParsing] = useState(false);

  const handleFile = async (file: File) => {
    setFileName(file.name);
    setParsing(true);
    try {
      const text = await file.text();
      const summary = parseHealthFileContent(text, file.name);
      onParsed(summary);
    } catch (err) {
      console.error('Error parsing health file:', err);
    } finally {
      setParsing(false);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="card-panel p-6 md:p-8 mb-8 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-teal-600" />
            Anonymous Health Export &amp; Wearables Sandbox
          </h3>
          <p className="text-xs text-slate-500">Instant Day-0 baseline analysis without account creation</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
          <Lock className="w-3.5 h-3.5 text-emerald-600" /> Client-Side Web Crypto AES-256
        </div>
      </div>
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">
        Drop Apple Health <code className="px-1.5 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">export.xml</code> or Oura/Whoop logs. Your records are decoded inside your browser memory and never uploaded unencrypted.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-teal-500 bg-teal-50/50'
            : 'border-slate-300 hover:border-teal-400 bg-slate-50/70'
        }`}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.xml,.json,.csv';
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files[0]) {
              handleFile(target.files[0]);
            }
          };
          input.click();
        }}
      >
        {fileName ? (
          <div className="flex items-center justify-center gap-2 text-teal-800">
            <FileText className="w-6 h-6 text-teal-600" />
            <span className="font-bold text-sm">{fileName}</span>
            <CheckCircle className="w-5 h-5 text-emerald-600 ml-2" />
          </div>
        ) : (
          <div>
            <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-800">
              Drag and drop health export, or click to browse
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Supports Apple Health (XML), Oura Ring (JSON), Whoop CSV
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
