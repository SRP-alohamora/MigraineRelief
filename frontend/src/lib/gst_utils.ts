/**
 * Gulf Standard Time (GST - UTC+4) utilities for patient record filenames and RAG persistence.
 */

export interface GSTFormattedTime {
  dateStr: string; // e.g. "20260908"
  timeStr: string; // e.g. "03h14m_GST"
  fullDisplay: string; // e.g. "2026-09-08 03:14 GST (UTC+4)"
  filename: string; // e.g. "username_20260908_03h14m_GST.json"
}

/**
 * Returns current timestamp converted to Gulf Standard Time (UTC+4).
 */
export function getGSTTimestamp(loginName: string = 'anonymousPatient_0', customDate?: Date): GSTFormattedTime {
  const date = customDate || new Date();

  // Convert current UTC time to GST (UTC + 4 hours)
  const utcMilliseconds = date.getTime() + date.getTimezoneOffset() * 60000;
  const gstMilliseconds = utcMilliseconds + 4 * 3600000;
  const gstDate = new Date(gstMilliseconds);

  const year = gstDate.getFullYear();
  const month = String(gstDate.getMonth() + 1).padStart(2, '0');
  const day = String(gstDate.getDate()).padStart(2, '0');
  const hours = String(gstDate.getHours()).padStart(2, '0');
  const minutes = String(gstDate.getMinutes()).padStart(2, '0');

  const dateStr = `${year}${month}${day}`;
  const timeStr = `${hours}h${minutes}m_GST`;
  const fullDisplay = `${year}-${month}-${day} ${hours}:${minutes} GST (UTC+4)`;

  // Clean login name to be safe for filenames
  const sanitizedLogin = loginName.replace(/[^a-zA-Z0-9_\-]/g, '_') || 'anonymousPatient_0';
  const filename = `${sanitizedLogin}_${dateStr}_${timeStr}.json`;

  return {
    dateStr,
    timeStr,
    fullDisplay,
    filename,
  };
}

/**
 * Triggers a browser file download of JSON or CSV content.
 */
export function triggerFileDownload(filename: string, content: string, mimeType: string = 'application/json'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

/**
 * Converts form data into exact CSV row matching the Kaggle 24-feature dataset:
 * Age,Duration,Frequency,Location,Character,Intensity,Nausea,Vomit,Phonophobia,Photophobia,Visual,Sensory,Dysphasia,Dysarthria,Vertigo,Tinnitus,Hypoacusis,Diplopia,Defect,Ataxia,Conscience,Paresthesia,DPF,Type
 */
export function formatDataToCSV(data: any, predictedType: string = 'Typical aura with migraine'): string {
  const headers = [
    'Age',
    'Duration',
    'Frequency',
    'Location',
    'Character',
    'Intensity',
    'Nausea',
    'Vomit',
    'Phonophobia',
    'Photophobia',
    'Visual',
    'Sensory',
    'Dysphasia',
    'Dysarthria',
    'Vertigo',
    'Tinnitus',
    'Hypoacusis',
    'Diplopia',
    'Defect',
    'Ataxia',
    'Conscience',
    'Paresthesia',
    'DPF',
    'Type',
  ];

  const row = [
    data.age ?? 30,
    data.duration ?? 1,
    data.frequency ?? 5,
    data.location ?? 1,
    data.character ?? 1,
    data.intensity ?? 2,
    data.nausea ? 1 : 0,
    data.vomit ? 1 : 0,
    data.phonophobia ? 1 : 0,
    data.photophobia ? 1 : 0,
    data.visual ?? 1,
    data.sensory ?? 2,
    data.dysphasia ? 1 : 0,
    data.dysarthria ? 1 : 0,
    data.vertigo ? 1 : 0,
    data.tinnitus ? 1 : 0,
    data.hypoacusis ? 1 : 0,
    data.diplopia ? 1 : 0,
    data.defect ? 1 : 0,
    data.ataxia ? 1 : 0,
    data.conscience ? 1 : 0,
    data.paresthesia ? 1 : 0,
    data.dpf ? 1 : 0,
    `"${predictedType}"`,
  ];

  return `${headers.join(',')}\n${row.join(',')}`;
}
