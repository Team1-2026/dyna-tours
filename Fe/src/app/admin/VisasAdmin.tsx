'use client';

import React, { useState, useEffect } from 'react';
import styles from './admin.module.css';
import { api } from '@/lib/api';
import { VisaCountry, eVisaDestinations, schengenCountries, otherCountries } from '@/data/visaData';
import SectionVisibilityToggle from '@/components/admin/SectionVisibilityToggle';

import RichTextEditor from '@/components/RichTextEditor';
import VisaFlag, { countryNameToCode, emojiToCountryCode } from '@/components/visa/VisaFlag';
import { COUNTRIES_LIST } from '@/data/countries';

export default function VisasAdmin() {
  const [visas, setVisas] = useState<VisaCountry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<Partial<VisaCountry> | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [showCustomCountryInput, setShowCustomCountryInput] = useState(false);
  const [showCustomFlagInput, setShowCustomFlagInput] = useState(false);

  const clearVisaFormState = () => {
    setSelectedVisa(null);
    setIsEditing(false);
    setIsCreating(false);
    setShowCustomCountryInput(false);
    setShowCustomFlagInput(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('admin_visa_is_editing');
      sessionStorage.removeItem('admin_visa_is_creating');
      sessionStorage.removeItem('admin_visa_draft');
      sessionStorage.removeItem('admin_visa_id');
      if (window.location.hash.startsWith('#add-visa') || window.location.hash.startsWith('#edit-visa')) {
        try {
          window.history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (e) {
          window.location.hash = '';
        }
      }
    }
  };

  useEffect(() => {
    fetchVisas();

    if (typeof window !== 'undefined') {
      const isEditingSaved = sessionStorage.getItem('admin_visa_is_editing') === 'true' || 
                             window.location.hash === '#add-visa' || 
                             window.location.hash.startsWith('#edit-visa-');
      const isCreatingSaved = sessionStorage.getItem('admin_visa_is_creating') === 'true' || 
                              window.location.hash === '#add-visa';
      const savedDraft = sessionStorage.getItem('admin_visa_draft');

      if (isEditingSaved) {
        if (savedDraft) {
          try {
            const parsed = JSON.parse(savedDraft);
            setSelectedVisa(parsed);
            setIsEditing(true);
            setIsCreating(isCreatingSaved);
          } catch (e) {
            console.error('Failed to parse saved visa draft', e);
          }
        } else if (isCreatingSaved) {
          handleCreateNew();
        }
      }
    }

    const onAddNew = () => {
      handleCreateNew();
    };
    const onViewAll = () => {
      clearVisaFormState();
    };

    window.addEventListener('admin:add-new-visa', onAddNew);
    window.addEventListener('admin:view-visas', onViewAll);

    return () => {
      window.removeEventListener('admin:add-new-visa', onAddNew);
      window.removeEventListener('admin:view-visas', onViewAll);
    };
  }, []);

  // Save active editing/creating draft into sessionStorage and sync URL hash
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isEditing && selectedVisa) {
        sessionStorage.setItem('admin_visa_is_editing', 'true');
        sessionStorage.setItem('admin_visa_is_creating', String(isCreating));
        sessionStorage.setItem('admin_visa_draft', JSON.stringify(selectedVisa));
        sessionStorage.setItem('admin_visa_id', selectedVisa.id || '');

        const expectedHash = isCreating ? '#add-visa' : (selectedVisa.id ? `#edit-visa-${selectedVisa.id}` : '#edit-visa');
        if (window.location.hash !== expectedHash) {
          try {
            window.history.replaceState(null, '', window.location.pathname + window.location.search + expectedHash);
          } catch (e) {}
        }
      }
    }
  }, [isEditing, isCreating, selectedVisa]);

  const fetchVisas = async () => {
    setIsLoading(true);
    try {
      const data = await api.getVisas();
      setVisas(data);

      if (typeof window !== 'undefined') {
        const savedId = sessionStorage.getItem('admin_visa_id') || 
          (window.location.hash.startsWith('#edit-visa-') ? window.location.hash.replace('#edit-visa-', '') : null);
        const isEditingSaved = sessionStorage.getItem('admin_visa_is_editing') === 'true' || window.location.hash.startsWith('#edit-visa-');
        const isCreatingSaved = sessionStorage.getItem('admin_visa_is_creating') === 'true' || window.location.hash === '#add-visa';

        if (isEditingSaved && !isCreatingSaved && savedId && !selectedVisa) {
          const found = (data || []).find((v: VisaCountry) => v.id.toLowerCase() === savedId.toLowerCase());
          if (found) {
            setSelectedVisa({ ...found });
            setIsEditing(true);
            setIsCreating(false);
          }
        }
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'Failed to load visas' });
    }
    setIsLoading(false);
  };

  const handleEdit = (visa: VisaCountry) => {
    setSelectedVisa({ ...visa });
    setShowCustomCountryInput(false);
    setShowCustomFlagInput(false);
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
      show_price: true,
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
    setShowCustomCountryInput(false);
    setShowCustomFlagInput(false);
    setIsCreating(true);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this visa?')) return;
    try {
      await api.deleteVisa(id);
      setMessage({ type: 'success', text: 'Visa deleted successfully' });
      if (selectedVisa?.id === id) {
        clearVisaFormState();
      }
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
    
    try {
      // Get existing visas from backend to avoid duplicate ID errors
      const existing = await api.getVisas();
      const existingIds = new Set((existing || []).map(v => v.id.toLowerCase()));
      const createdIds = new Set<string>();

      // Load full detailed e-visas
      for (const visa of eVisaDestinations) {
        const cleanId = visa.id.toLowerCase();
        if (existingIds.has(cleanId) || createdIds.has(cleanId)) {
          continue;
        }
        try {
          await api.createVisa({ ...visa, type: 'e-visa', region: 'e-visa' });
          createdIds.add(cleanId);
          successCount++;
        } catch (err) {
          console.warn('Visa already exists or failed to create:', visa.name);
        }
      }
      
      // Load stubs for Schengen countries
      for (const country of schengenCountries) {
        const countryId = country.id || (country.name ? country.name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
        const cleanId = countryId.toLowerCase();

        if (existingIds.has(cleanId) || createdIds.has(cleanId)) {
          continue;
        }

        try {
          const stub = {
            id: countryId,
            name: country.name || 'Unknown',
            flag: country.flag || '🌍',
            type: 'stamped' as const,
            region: 'schengen',
            price: country.price,
            show_price: country.show_price !== false,
            processingTime: 'Please update in admin',
            validity: 'Please update in admin',
            biometric: 'Yes' as const,
            requirements: ['Passport copy', 'Schengen visa application form', 'Flight & Hotel itineraries'],
            importantNotes: ['Biometrics enrolment required at VFS center'],
            terms: ['Visa fee is non-refundable'],
            faqs: [{ question: 'Is biometric enrolment required?', answer: 'Yes, biometric enrolment is mandatory for Schengen visas.' }]
          };
          await api.createVisa(stub);
          createdIds.add(cleanId);
          successCount++;
        } catch (err) {
          console.warn('Stub visa already exists or failed to create:', country.name);
        }
      }

      // Load stubs for Other countries
      for (const country of otherCountries) {
        const countryId = country.id || (country.name ? country.name.toLowerCase().replace(/\s+/g, '-') : 'unknown');
        const cleanId = countryId.toLowerCase();

        if (existingIds.has(cleanId) || createdIds.has(cleanId)) {
          continue;
        }

        try {
          const stub = {
            id: countryId,
            name: country.name || 'Unknown',
            flag: country.flag || '🌍',
            type: 'stamped' as const,
            region: 'other',
            price: country.price,
            show_price: country.show_price !== false,
            processingTime: 'Please update in admin',
            validity: 'Please update in admin',
            biometric: 'Yes' as const,
            requirements: ['Passport copy', 'Visa application form', 'Flight & Hotel itineraries'],
            importantNotes: ['Subject to embassy approval'],
            terms: ['Visa fee is non-refundable'],
            faqs: [{ question: 'How long does processing take?', answer: 'Processing time varies depending on the consulate.' }]
          };
          await api.createVisa(stub);
          createdIds.add(cleanId);
          successCount++;
        } catch (err) {
          console.warn('Stub visa already exists or failed to create:', country.name);
        }
      }
      
      setMessage({ 
        type: 'success', 
        text: successCount > 0 
          ? `Successfully loaded ${successCount} new visa(s). You can now edit them!` 
          : 'All sample visas are already loaded in your database.' 
      });
    } catch (err) {
      console.warn('Failed to load sample data:', err);
      setMessage({ type: 'error', text: 'Failed to process sample visas' });
    }
    
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
      clearVisaFormState();
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
          <div className={styles.sectionHeader} style={{ marginBottom: '1.5rem' }}>
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
                  <th>Region / Section</th>
                  <th>Processing Time</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visas.map((visa) => (
                  <tr key={visa.id}>
                    <td><VisaFlag flag={visa.flag} countryName={visa.name} size="sm" /></td>
                    <td><strong>{visa.name}</strong></td>
                    <td>{visa.type?.toUpperCase() || 'E-VISA'}</td>
                    <td><span className="badge" style={{ background: visa.region === 'schengen' ? '#e0e7ff' : visa.region === 'other' ? '#fef3c7' : '#dcfce7', color: visa.region === 'schengen' ? '#3730a3' : visa.region === 'other' ? '#92400e' : '#166534', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{visa.region === 'schengen' ? 'Schengen' : visa.region === 'other' ? 'Other Stamped' : visa.region || 'E-Visa'}</span></td>
                    <td>{visa.processingTime}</td>
                    <td>{visa.show_price === false ? <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Hidden ({visa.price || '-'})</span> : (visa.price || '-')}</td>
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
            <button className="btn btn-primary" onClick={clearVisaFormState}>Back to List</button>
          </div>

          <form onSubmit={handleSave} className={styles.adminForm}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>ID / Slug (e.g., 'cambodia') <span className="required-star">*</span></label>
                <input 
                  type="text" 
                  value={selectedVisa?.id || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, id: e.target.value})}
                  disabled={!isCreating}
                  required 
                />
              </div>
              {/* Country Name Dropdown */}
              {(() => {
                const currentName = selectedVisa?.name || '';
                const codeFromName = countryNameToCode(currentName);
                const matchedCountry = COUNTRIES_LIST.find(c => 
                  c.name.toLowerCase() === currentName.toLowerCase() || 
                  (codeFromName && c.code.toLowerCase() === codeFromName.toLowerCase())
                );
                const selectedCountryValue = matchedCountry
                  ? matchedCountry.name
                  : (currentName || showCustomCountryInput ? '__custom__' : '');
                const isCustomCountry = showCustomCountryInput || (!matchedCountry && Boolean(currentName));

                return (
                  <div className={styles.formGroup}>
                    <label>Country Name <span className="required-star">*</span></label>
                    <select 
                      value={selectedCountryValue} 
                      onChange={e => {
                        const val = e.target.value;
                        if (val === '__custom__') {
                          setShowCustomCountryInput(true);
                          setSelectedVisa({ ...selectedVisa, name: '' });
                        } else if (val) {
                          setShowCustomCountryInput(false);
                          const found = COUNTRIES_LIST.find(c => c.name === val);
                          const updates: Partial<VisaCountry> = { name: val };
                          if (found) {
                            updates.flag = found.flag;
                          }
                          if (isCreating) {
                            const slug = val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                            updates.id = slug;
                            if (!selectedVisa?.meta_title) {
                              updates.meta_title = `${val} Visa for Indians - Requirements, Process & Fees`;
                            }
                            if (!selectedVisa?.url_slug) {
                              updates.url_slug = slug;
                            }
                          }
                          setSelectedVisa({ ...selectedVisa, ...updates });
                        } else {
                          setShowCustomCountryInput(false);
                          setSelectedVisa({ ...selectedVisa, name: '' });
                        }
                      }}
                      required={!isCustomCountry}
                    >
                      <option value="">-- Select Country --</option>
                      {COUNTRIES_LIST.map(c => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                      <option value="__custom__">➕ Other / Custom Country Name...</option>
                    </select>

                    {isCustomCountry && (
                      <input 
                        type="text" 
                        placeholder="Enter custom country name..."
                        value={selectedVisa?.name || ''} 
                        onChange={e => {
                          const name = e.target.value;
                          const updates: any = { name };
                          if (isCreating) {
                            updates.id = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
                          }
                          const matched = COUNTRIES_LIST.find(c => c.name.toLowerCase() === name.toLowerCase());
                          if (matched && (!selectedVisa?.flag || selectedVisa?.flag === '🏳️')) {
                            updates.flag = matched.flag;
                          }
                          setSelectedVisa({ ...selectedVisa, ...updates });
                        }}
                        style={{ marginTop: '0.5rem' }}
                        required 
                      />
                    )}
                  </div>
                );
              })()}

              {/* Flag Dropdown */}
              {(() => {
                const currentFlag = selectedVisa?.flag || '';
                const cdnCodeMatch = currentFlag.match(/flagcdn\.com\/[^/]+\/([a-zA-Z]{2})\.png/i);
                const flagCode = emojiToCountryCode(currentFlag) || 
                  (cdnCodeMatch ? cdnCodeMatch[1].toLowerCase() : null) || 
                  (/^[a-zA-Z]{2}$/.test(currentFlag) ? currentFlag.toLowerCase() : null);
                
                const matchedCountry = COUNTRIES_LIST.find(c => 
                  c.flag === currentFlag || 
                  (flagCode && c.code.toLowerCase() === flagCode)
                );

                const isKnown = Boolean(matchedCountry) || currentFlag === '🏳️' || currentFlag === '🇪🇺' || currentFlag === '🌍';
                const selectedFlagValue = matchedCountry 
                  ? matchedCountry.flag 
                  : (currentFlag === '🇪🇺' ? '🇪🇺' : (currentFlag === '🌍' ? '🌍' : (currentFlag === '🏳️' ? '🏳️' : (currentFlag || showCustomFlagInput ? '__custom__' : ''))));

                const isCustomFlag = showCustomFlagInput || (!isKnown && Boolean(currentFlag));

                return (
                  <div className={styles.formGroup}>
                    <label>Flag <span className="required-star">*</span></label>
                    <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                      <VisaFlag flag={selectedVisa?.flag} countryName={selectedVisa?.name} size="md" />
                      <select 
                        value={selectedFlagValue}
                        onChange={e => {
                          const val = e.target.value;
                          if (val === '__custom__') {
                            setShowCustomFlagInput(true);
                          } else if (val) {
                            setShowCustomFlagInput(false);
                            setSelectedVisa({ ...selectedVisa, flag: val });
                          } else {
                            setShowCustomFlagInput(false);
                            setSelectedVisa({ ...selectedVisa, flag: '' });
                          }
                        }}
                        style={{ flex: 1 }}
                        required={!isCustomFlag}
                      >
                        <option value="">-- Select Flag --</option>
                        <option value="🇪🇺">🇪🇺 European Union / Schengen (EU)</option>
                        <option value="🌍">🌍 Global / World (All Regions)</option>
                        {COUNTRIES_LIST.map(c => (
                          <option key={c.code} value={c.flag}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                        <option value="🏳️">🏳️ Neutral Flag (Other)</option>
                        <option value="__custom__">➕ Custom Flag (Emoji / Image URL / Code...)</option>
                      </select>
                    </div>

                    {isCustomFlag && (
                      <input 
                        type="text" 
                        placeholder="e.g. 🇸🇬 or sg or https://flagcdn.com/w160/sg.png"
                        value={selectedVisa?.flag || ''} 
                        onChange={e => setSelectedVisa({ ...selectedVisa, flag: e.target.value })}
                        style={{ marginTop: '0.5rem' }}
                        required 
                      />
                    )}
                  </div>
                );
              })()}
              <div className={styles.formGroup}>
                <label>Visa Type <span className="required-star">*</span></label>
                <select 
                  value={selectedVisa?.type || 'e-visa'} 
                  onChange={e => setSelectedVisa({...selectedVisa, type: e.target.value as any})}
                >
                  <option value="e-visa">e-Visa (Online Visa)</option>
                  <option value="stamped">Stamped Visa (Offline / Embassy Visa)</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Region / Section Category</label>
                <select 
                  value={selectedVisa?.region || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, region: e.target.value})}
                >
                  <option value="">Standard / Auto</option>
                  <option value="schengen">Stamped Visa - Schengen Countries</option>
                  <option value="other">Stamped Visa - Other Countries</option>
                  <option value="e-visa">E-Visa Destinations</option>
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
                <label>Processing Time <span className="required-star">*</span></label>
                <input 
                  type="text" 
                  value={selectedVisa?.processingTime || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, processingTime: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Validity <span className="required-star">*</span></label>
                <input 
                  type="text" 
                  value={selectedVisa?.validity || ''} 
                  onChange={e => setSelectedVisa({...selectedVisa, validity: e.target.value})}
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Biometrics/Interview Required? <span className="required-star">*</span></label>
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

              <div className={styles.formGroup} style={{ gridColumn: '1 / -1', marginTop: '0.5rem', padding: '1.25rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#0C2745' }}>👁️ Visibility & Home Page Controls</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#15803d', margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedVisa?.popular !== false} 
                      onChange={e => setSelectedVisa({ ...selectedVisa, popular: e.target.checked })} 
                      style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                    />
                    <span>Show on Home Page (Popular Visa Service)</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, color: '#0369a1', margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedVisa?.show_price !== false} 
                      onChange={e => setSelectedVisa({ ...selectedVisa, show_price: e.target.checked })} 
                      style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                    />
                    <span>Show Price (Display Starting Price on Website)</span>
                  </label>

                  <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.65rem 1.1rem', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, color: '#334155', margin: 0 }}>
                    <input 
                      type="checkbox" 
                      checked={selectedVisa?.status !== 'Inactive'} 
                      onChange={e => setSelectedVisa({ ...selectedVisa, status: e.target.checked ? 'Active' : 'Inactive' })} 
                      style={{ width: '18px', height: '18px', margin: 0, flexShrink: 0 }}
                    />
                    <span>Enable Visa Service (Active Status)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
              <label>Description (Rich Text)</label>
              <RichTextEditor 
                value={selectedVisa?.description || ''} 
                onChange={(val) => setSelectedVisa({ ...selectedVisa, description: val })}
                placeholder="Enter detailed visa description, guidelines, and overview..."
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

            {/* SEO Settings Card (Matching Add Hotel Page) */}
            <div className={styles.formCard} style={{ marginTop: '2rem' }}>
              <h4 className={styles.formCardTitle}>SEO Settings</h4>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  Meta Title <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter meta title"
                  value={selectedVisa?.meta_title || ''}
                  onChange={e => setSelectedVisa({ ...selectedVisa, meta_title: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                  {(selectedVisa?.meta_title || '').length}/60
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  Meta Description <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="Enter meta description"
                  value={selectedVisa?.meta_description || ''}
                  onChange={e => setSelectedVisa({ ...selectedVisa, meta_description: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)' }}
                />
                <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', marginTop: '0.25rem', textAlign: 'right' }}>
                  {(selectedVisa?.meta_description || '').length}/160
                </span>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>
                  URL Slug <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ padding: '0.75rem', background: '#f1f5f9', border: '1px solid var(--color-border, #cbd5e1)', borderRight: 'none', borderRadius: 'var(--radius-md, 8px) 0 0 var(--radius-md, 8px)', fontSize: '0.8rem', color: 'var(--color-text-secondary, #64748b)', fontWeight: 600 }}>/visa/</span>
                  <input
                    type="text"
                    placeholder="enter-url-slug"
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: '0 var(--radius-md, 8px) var(--radius-md, 8px) 0' }}
                    value={selectedVisa?.url_slug || ''}
                    onChange={e => setSelectedVisa({ ...selectedVisa, url_slug: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.35rem', fontWeight: 600, fontSize: '0.9rem' }}>Canonical URL</label>
                <input
                  type="text"
                  placeholder="https://www.example.com/visa/slug"
                  value={selectedVisa?.canonical_url || ''}
                  onChange={e => setSelectedVisa({ ...selectedVisa, canonical_url: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--color-border, #cbd5e1)', borderRadius: 'var(--radius-md, 8px)' }}
                />
              </div>
            </div>

            <div className={styles.formActions} style={{ marginTop: '3rem' }}>
              <button type="button" className="btn btn-primary" onClick={clearVisaFormState} style={{ marginRight: '1rem', padding: '0.75rem 2rem', fontSize: '1.1rem', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', cursor: 'pointer' }}>Save Visa</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
