'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './admin.module.css';
import { api } from '@/lib/api';
import { VisaCountry, eVisaDestinations, schengenCountries, otherCountries } from '@/data/visaData';

const WysiwygEditor = dynamic(
  () => import('react-simple-wysiwyg').then((mod) => {
    const EditorProvider = mod.EditorProvider;
    const Editor = mod.Editor;
    return function WrappedEditor({ value, onChange }: { value: string, onChange: (e: any) => void }) {
      return (
        <EditorProvider>
          <Editor value={value} onChange={onChange} style={{ minHeight: '200px', backgroundColor: 'white' }} />
        </EditorProvider>
      );
    }
  }),
  { ssr: false, loading: () => <p>Loading editor...</p> }
);

const FLAG_OPTIONS = [
  { name: 'Australia', flag: '🇦🇺' }, { name: 'Austria', flag: '🇦🇹' }, { name: 'Belgium', flag: '🇧🇪' },
  { name: 'Bhutan', flag: '🇧🇹' }, { name: 'Brazil', flag: '🇧🇷' }, { name: 'Cambodia', flag: '🇰🇭' },
  { name: 'Canada', flag: '🇨🇦' }, { name: 'China', flag: '🇨🇳' }, { name: 'Denmark', flag: '🇩🇰' },
  { name: 'Egypt', flag: '🇪🇬' }, { name: 'Fiji', flag: '🇫🇯' }, { name: 'France', flag: '🇫🇷' },
  { name: 'Germany', flag: '🇩🇪' }, { name: 'Greece', flag: '🇬🇷' }, { name: 'Hong Kong', flag: '🇭🇰' },
  { name: 'Hungary', flag: '🇭🇺' }, { name: 'India', flag: '🇮🇳' }, { name: 'Indonesia', flag: '🇮🇩' },
  { name: 'Italy', flag: '🇮🇹' }, { name: 'Japan', flag: '🇯🇵' }, { name: 'Kenya', flag: '🇰🇪' },
  { name: 'Malaysia', flag: '🇲🇾' }, { name: 'Maldives', flag: '🇲🇻' }, { name: 'Mauritius', flag: '🇲🇺' },
  { name: 'Mexico', flag: '🇲🇽' }, { name: 'Morocco', flag: '🇲🇦' }, { name: 'Nepal', flag: '🇳🇵' },
  { name: 'Netherlands', flag: '🇳🇱' }, { name: 'New Zealand', flag: '🇳🇿' }, { name: 'Norway', flag: '🇳🇴' },
  { name: 'Oman', flag: '🇴🇲' }, { name: 'Philippines', flag: '🇵🇭' }, { name: 'Poland', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' }, { name: 'Qatar', flag: '🇶🇦' }, { name: 'Russia', flag: '🇷🇺' },
  { name: 'Saudi Arabia', flag: '🇸🇦' }, { name: 'Seychelles', flag: '🇸🇨' }, { name: 'Singapore', flag: '🇸🇬' },
  { name: 'South Africa', flag: '🇿🇦' }, { name: 'South Korea', flag: '🇰🇷' }, { name: 'Spain', flag: '🇪🇸' },
  { name: 'Sri Lanka', flag: '🇱🇰' }, { name: 'Sweden', flag: '🇸🇪' }, { name: 'Switzerland', flag: '🇨🇭' },
  { name: 'Taiwan', flag: '🇹🇼' }, { name: 'Thailand', flag: '🇹🇭' }, { name: 'Turkey', flag: '🇹🇷' },
  { name: 'United Arab Emirates', flag: '🇦🇪' }, { name: 'United Kingdom', flag: '🇬🇧' },
  { name: 'United States', flag: '🇺🇸' }, { name: 'Vietnam', flag: '🇻🇳' }, { name: 'Other', flag: '🏳️' }
];

export default function VisasAdmin() {
  const [visas, setVisas] = useState<VisaCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<Partial<VisaCountry> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    fetchVisas();
  }, []);

  const fetchVisas = async () => {
    setIsLoading(true);
    try {
      const data = await api.getVisas();
      setVisas(data);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load visas' });
    }
    setIsLoading(false);
  };

  const handleEdit = (visa: VisaCountry) => {
    setSelectedVisa({ ...visa });
    setIsEditing(true);
    setIsCreating(false);
  };

  const handleCreateNew = () => {
    setSelectedVisa({
      id: '',
      name: '',
      flag: '',
      type: 'e-visa',
      price: '',
      processingTime: '',
      validity: '',
      biometric: 'No',
      entryType: '',
      stayPeriod: '',
      description: '',
      requirements: [''],
      importantNotes: [''],
      terms: [''],
      faqs: [{ question: '', answer: '' }]
    });
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this visa?')) return;
    try {
      await api.deleteVisa(id);
      setMessage({ type: 'success', text: 'Visa deleted successfully' });
      fetchVisas();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to delete visa' });
    }
  };

  const handleLoadSampleData = async () => {
    if (!window.confirm('This will load all the default visas into your database. Continue?')) return;
    setIsLoading(true);
    let successCount = 0;
    
    // Load full detailed e-visas
    for (const visa of eVisaDestinations) {
      try {
        await api.createVisa(visa);
        successCount++;
      } catch (err) {
        console.error('Failed to create visa:', visa.name, err);
      }
    }
    
    // Load stubs for Schengen and Other countries for the user to edit later
    const allOtherCountries = [...schengenCountries, ...otherCountries];
    for (const country of allOtherCountries) {
      try {
        const stub = {
          id: country.id || (country.name ? country.name.toLowerCase().replace(/\s+/g, '-') : 'unknown'),
          name: country.name || 'Unknown',
          flag: country.flag || '🌍', // Generic globe flag
          type: 'stamped' as const,
          price: country.price,
          processingTime: 'Please update in admin',
          validity: 'Please update in admin',
          biometric: 'Yes' as const,
          requirements: ['Please update this requirement'],
          importantNotes: ['Please update this note'],
          terms: ['Please update this term'],
          faqs: [{ question: 'Please update FAQ?', answer: 'Please update answer' }]
        };
        await api.createVisa(stub);
        successCount++;
      } catch (err) {
        console.error('Failed to create stub visa:', country, err);
      }
    }
    
    setMessage({ type: 'success', text: `Successfully loaded ${successCount} visas. You can now edit them!` });
    fetchVisas();
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisa) return;

    try {
      if (isCreating) {
        await api.createVisa(selectedVisa as VisaCountry);
        setMessage({ type: 'success', text: 'Visa created successfully' });
      } else {
        await api.updateVisa(selectedVisa.id!, selectedVisa as VisaCountry);
        setMessage({ type: 'success', text: 'Visa updated successfully' });
      }
      setIsEditing(false);
      fetchVisas();
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to save visa' });
    }
  };

  // Helper for array of strings
  const handleStringArrayChange = (field: keyof VisaCountry, index: number, value: string) => {
    const newArr = [...(selectedVisa![field] as string[])];
    newArr[index] = value;
    setSelectedVisa({ ...selectedVisa, [field]: newArr });
  };
  const addStringArrayItem = (field: keyof VisaCountry) => {
    setSelectedVisa({ ...selectedVisa, [field]: [...(selectedVisa![field] as string[] || []), ''] });
  };
  const removeStringArrayItem = (field: keyof VisaCountry, index: number) => {
    const newArr = (selectedVisa![field] as string[]).filter((_, i) => i !== index);
    setSelectedVisa({ ...selectedVisa, [field]: newArr });
  };

  // Helper for faqs
  const handleFaqChange = (index: number, key: 'question' | 'answer', value: string) => {
    const newFaqs = [...(selectedVisa!.faqs || [])];
    newFaqs[index] = { ...newFaqs[index], [key]: value };
    setSelectedVisa({ ...selectedVisa, faqs: newFaqs });
  };
  const addFaq = () => {
    setSelectedVisa({ ...selectedVisa, faqs: [...(selectedVisa!.faqs || []), { question: '', answer: '' }] });
  };
  const removeFaq = (index: number) => {
    const newFaqs = (selectedVisa!.faqs || []).filter((_, i) => i !== index);
    setSelectedVisa({ ...selectedVisa, faqs: newFaqs });
  };

  if (isLoading) return <div>Loading Visas...</div>;

  return (
    <div className={styles.adminSection}>
      {message && (
        <div className={message.type === 'success' ? styles.successAlert : styles.errorAlert} style={{ padding: '1rem', marginBottom: '1rem', borderRadius: '4px', background: message.type === 'success' ? '#dcfce7' : '#fee2e2', color: message.type === 'success' ? '#166534' : '#991b1b' }}>
          {message.text}
          <button onClick={() => setMessage(null)} style={{ float: 'right', background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      {!isEditing ? (
        <>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Manage Visa Services</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {visas.length < 5 && (
                <button className="btn btn-outline" onClick={handleLoadSampleData} style={{ cursor: 'pointer' }}>
                  Load Initial Visas
                </button>
              )}
              <button className="btn btn-primary" onClick={handleCreateNew} style={{ cursor: 'pointer' }}>
                + Add New Visa
              </button>
            </div>
          </div>

          <div className={styles.tableContainer}>
            <table className={styles.adminTable}>
              <thead>
                <tr>
                  <th>Flag</th>
                  <th>Country Name</th>
                  <th>Type</th>
                  <th>Processing Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visas.map((visa) => (
                  <tr key={visa.id}>
                    <td style={{ fontSize: '1.5rem' }}>{visa.flag}</td>
                    <td><strong>{visa.name}</strong></td>
                    <td>{visa.type.toUpperCase()}</td>
                    <td>{visa.processingTime}</td>
                    <td>{visa.price || '-'}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button onClick={() => handleEdit(visa)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(visa.id)} className="btn btn-primary" style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {visas.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No visas found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className={styles.formContainer}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>{isCreating ? 'Add New Visa' : `Edit Visa: ${selectedVisa?.name}`}</h2>
            <button className="btn btn-primary" onClick={() => setIsEditing(false)}>Back to List</button>
          </div>

          <form onSubmit={handleSave} className={styles.adminForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>ID / Slug (e.g., 'cambodia')</label>
                <input 
                  type="text" 
                  value={selectedVisa?.id || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, id: e.target.value})}
                  disabled={!isCreating}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Country Name</label>
                <input 
                  type="text" 
                  value={selectedVisa?.name || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, name: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Flag Emoji</label>
                <select 
                  value={selectedVisa?.flag || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, flag: e.target.value})}
                  required 
                >
                  <option value="" disabled>Select a flag</option>
                  {FLAG_OPTIONS.map(opt => (
                    <option key={opt.name} value={opt.flag}>
                      {opt.flag} {opt.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Visa Type</label>
                <select 
                  value={selectedVisa?.type || 'e-visa'} 
                  onChange={e => setSelectedVisa({...selectedVisa, type: e.target.value as any})}
                >
                  <option value="e-visa">e-Visa</option>
                  <option value="stamped">Stamped Visa</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Price (Starting Price)</label>
                <input 
                  type="text" 
                  value={selectedVisa?.price || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, price: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Processing Time</label>
                <input 
                  type="text" 
                  value={selectedVisa?.processingTime || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, processingTime: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Validity</label>
                <input 
                  type="text" 
                  value={selectedVisa?.validity || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, validity: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Biometric Required?</label>
                <input 
                  type="text" 
                  value={selectedVisa?.biometric || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, biometric: e.target.value as any})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Entry Type</label>
                <input 
                  type="text" 
                  value={selectedVisa?.entryType || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, entryType: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Stay Period</label>
                <input 
                  type="text" 
                  value={selectedVisa?.stayPeriod || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, stayPeriod: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
              <label>Description (Rich Text)</label>
              <WysiwygEditor 
                value={selectedVisa?.description || ''} 
                onChange={e => setSelectedVisa({...selectedVisa, description: e.target.value})}
              />
            </div>

            {/* Arrays */}
            <div className={styles.formSection} style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Requirements</h3>
              {selectedVisa?.requirements?.map((req, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input style={{ flex: 1 }} type="text" value={req} onChange={e => handleStringArrayChange('requirements', i, e.target.value)} />
                  <button type="button" className="btn btn-primary" onClick={() => removeStringArrayItem('requirements', i)} style={{ cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={() => addStringArrayItem('requirements')} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>+ Add Requirement</button>
            </div>

            <div className={styles.formSection} style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Important Notes</h3>
              {selectedVisa?.importantNotes?.map((note, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input style={{ flex: 1 }} type="text" value={note} onChange={e => handleStringArrayChange('importantNotes', i, e.target.value)} />
                  <button type="button" className="btn btn-primary" onClick={() => removeStringArrayItem('importantNotes', i)} style={{ cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={() => addStringArrayItem('importantNotes')} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>+ Add Note</button>
            </div>

            <div className={styles.formSection} style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Terms & Conditions</h3>
              {selectedVisa?.terms?.map((term, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input style={{ flex: 1 }} type="text" value={term} onChange={e => handleStringArrayChange('terms', i, e.target.value)} />
                  <button type="button" className="btn btn-primary" onClick={() => removeStringArrayItem('terms', i)} style={{ cursor: 'pointer' }}>✕</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={() => addStringArrayItem('terms')} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>+ Add Term</button>
            </div>

            <div className={styles.formSection} style={{ marginTop: '2rem', borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>FAQs</h3>
              {selectedVisa?.faqs?.map((faq, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem', padding: '1rem', border: '1px dashed #cbd5e1' }}>
                  <input placeholder="Question" type="text" value={faq.question} onChange={e => handleFaqChange(i, 'question', e.target.value)} />
                  <textarea placeholder="Answer" value={faq.answer} onChange={e => handleFaqChange(i, 'answer', e.target.value)} rows={2} />
                  <button type="button" className="btn btn-primary" onClick={() => removeFaq(i)} style={{ alignSelf: 'flex-start', marginTop: '0.5rem', cursor: 'pointer' }}>Remove FAQ</button>
                </div>
              ))}
              <button type="button" className="btn btn-primary" onClick={addFaq} style={{ marginTop: '0.5rem', cursor: 'pointer' }}>+ Add FAQ</button>
            </div>

            <div className={styles.formActions} style={{ marginTop: '3rem' }}>
              <button type="button" className="btn btn-primary" onClick={() => setIsEditing(false)} style={{ marginRight: '1rem', padding: '0.75rem 2rem', fontSize: '1.1rem', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', cursor: 'pointer' }}>Save Visa</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
