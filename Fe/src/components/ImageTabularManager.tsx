'use client';

import React, { useState } from 'react';
import { GalleryImage } from '@/lib/api';

interface ImageTabularManagerProps {
  images: (string | GalleryImage)[];
  onChange: (updated: GalleryImage[]) => void;
}

const SECTION_SIZES = {
  banner: { label: 'Banner', size: '1920x1080 px' },
  gallery: { label: 'Gallery', size: '1200x800 px' },
  featured: { label: 'Featured', size: '800x600 px' },
  other: { label: 'Other / Room', size: 'Any size' },
};

export default function ImageTabularManager({ images, onChange }: ImageTabularManagerProps) {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalForm, setModalForm] = useState<GalleryImage>({ url: '', section: 'gallery' });

  // Normalize array input to array of GalleryImage objects
  const items: GalleryImage[] = (images || []).map((img) => {
    if (typeof img === 'string') {
      return { url: img, section: 'gallery' };
    }
    return {
      url: img?.url || '',
      section: img?.section || 'gallery',
    };
  });

  const notifyChange = (updatedItems: GalleryImage[]) => {
    onChange(updatedItems);
  };

  // Open modal for adding a new image
  const openAddModal = () => {
    setEditingIndex(null);
    setModalForm({ url: '', section: 'gallery' });
    setIsModalOpen(true);
  };

  // Open modal for editing an existing image
  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setModalForm({
      url: items[index].url,
      section: items[index].section,
    });
    setIsModalOpen(true);
  };

  // Save changes from modal (either add or edit)
  const saveModalImage = () => {
    if (!modalForm.url.trim()) {
      alert('Image URL or content path is required!');
      return;
    }

    const updated = [...items];
    const itemPayload: GalleryImage = {
      url: modalForm.url.trim(),
      section: modalForm.section,
    };

    if (editingIndex === null) {
      updated.push(itemPayload);
    } else {
      updated[editingIndex] = itemPayload;
    }

    notifyChange(updated);
    setIsModalOpen(false);
  };

  // Handle local file upload inside the modal
  const handleLocalUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (editingIndex !== null) {
      // Single file upload when editing
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result) {
          setModalForm((prev) => ({
            ...prev,
            url: result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Multiple file upload when adding new images
      const loadedImages: GalleryImage[] = [];
      let processedCount = 0;
      const totalFiles = files.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result;
          if (result) {
            loadedImages.push({
              url: result as string,
              section: modalForm.section,
            });
          }
          processedCount++;
          if (processedCount === totalFiles) {
            // Save all loaded images directly
            notifyChange([...items, ...loadedImages]);
            setIsModalOpen(false);
          }
        };
        reader.readAsDataURL(file);
      }
    }
    e.target.value = ''; // clear input
  };

  // Delete image with confirmation
  const handleDelete = (index: number) => {
    if (confirm('Are you sure you want to delete this image?')) {
      const updated = items.filter((_, idx) => idx !== index);
      notifyChange(updated);
    }
  };

  // Move image order
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const updated = [...items];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;

    // Swap elements
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    notifyChange(updated);
  };

  return (
    <div style={styles.container}>
      {/* Row List Header Controls */}
      <div style={styles.headerRow}>
        <div style={styles.headerText}>
          List of uploaded images for banners, pages, and search thumbnails.
        </div>
        <button 
          type="button" 
          onClick={openAddModal} 
          style={styles.mainAddBtn}
        >
          + Add Image
        </button>
      </div>

      {/* Row List */}
      {items.length > 0 ? (
        <div style={styles.listContainer}>
          {items.map((item, index) => (
            <div key={index} style={styles.rowCard}>
              <div style={styles.rowInfo}>
                <img 
                  src={item.url} 
                  alt={`Thumbnail ${index}`} 
                  style={styles.thumbnail}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/default_hotel.png';
                  }}
                />
                <div style={styles.rowText}>
                  <div style={styles.rowUrl}>{item.url}</div>
                  <div style={styles.rowMeta}>
                    <span style={styles.sectionBadge}>
                      {SECTION_SIZES[item.section || 'gallery']?.label || 'Gallery'}
                    </span>
                    <span style={styles.sizeText}>
                      Recommended: {SECTION_SIZES[item.section || 'gallery']?.size || 'Any size'}
                    </span>
                  </div>
                </div>
              </div>
              <div style={styles.rowActions}>
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => handleMove(index, 'up')}
                  style={index === 0 ? styles.actionBtnDisabled : styles.actionBtn}
                  title="Move Up"
                >
                  ▲
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => handleMove(index, 'down')}
                  style={index === items.length - 1 ? styles.actionBtnDisabled : styles.actionBtn}
                  title="Move Down"
                >
                  ▼
                </button>
                <button
                  type="button"
                  onClick={() => openEditModal(index)}
                  style={styles.editBtn}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(index)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          No images added yet. Click "+ Add Image" above to add your first banner, thumbnail, or gallery picture.
        </div>
      )}

      {/* Image Editor Modal Overlay */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {editingIndex === null ? 'Add Image to Gallery' : 'Edit Gallery Image'}
              </h3>
              <button 
                type="button" 
                style={styles.modalCloseBtn} 
                onClick={() => setIsModalOpen(false)}
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Target Section Selection */}
              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>Target Section / Page Location</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '4px' }}>
                  <select 
                    value={modalForm.section} 
                    onChange={(e) => setModalForm((prev) => ({ ...prev, section: e.target.value as any }))}
                    style={styles.select}
                  >
                    {Object.entries(SECTION_SIZES).map(([key, value]) => (
                      <option key={key} value={key}>{value.label}</option>
                    ))}
                  </select>
                  <div style={styles.sizeInfo}>
                    <span style={styles.sizeInfoLabel}>Recommended dimensions:</span>
                    <span style={styles.sizeInfoVal}>{SECTION_SIZES[modalForm.section].size}</span>
                  </div>
                </div>
              </div>

              {/* Paste Image URL Input */}
              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>Image URL Link</label>
                <input 
                  type="text" 
                  placeholder="e.g. /images/munnar_banner.png or https://example.com/image.jpg"
                  value={modalForm.url}
                  onChange={(e) => setModalForm((prev) => ({ ...prev, url: e.target.value }))}
                  style={styles.input}
                />
              </div>

              {/* Divider */}
              <div style={styles.dividerRow}>
                <div style={styles.dividerLine} />
                <span style={styles.dividerText}>OR</span>
                <div style={styles.dividerLine} />
              </div>

              {/* Upload Local Image File */}
              <div style={styles.formGroup}>
                <label style={styles.modalLabel}>Upload Local Image File</label>
                 <input 
                   type="file" 
                   accept="image/*"
                   multiple={editingIndex === null}
                   onChange={handleLocalUpload}
                   style={styles.fileInput}
                 />
                <p style={styles.uploadHint}>
                  Choosing a file will load it directly into the URL field above as a web image resource.
                </p>
              </div>

              {/* Image Preview Box inside Modal */}
              {modalForm.url && (
                <div style={styles.previewBox}>
                  <label style={{ ...styles.modalLabel, marginBottom: '6px', display: 'block' }}>Image Preview</label>
                  <img 
                    src={modalForm.url} 
                    alt="Preview snippet" 
                    style={styles.modalPreviewImg} 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/default_hotel.png';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={styles.modalFooter}>
              <button 
                type="button" 
                style={styles.cancelBtn} 
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                style={styles.saveBtn} 
                onClick={saveModalImage}
              >
                {editingIndex === null ? 'Add Image' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    background: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    marginBottom: '2.5rem',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '1rem',
  },
  headerText: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
  },
  mainAddBtn: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'var(--color-secondary-navy)',
    color: '#ffffff',
    fontSize: '0.875rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
    transition: 'background-color 0.15s ease',
  },
  listContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  rowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    background: '#ffffff',
    transition: 'background-color 0.15s ease',
  },
  rowInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem',
    flex: 1,
    minWidth: 0,
  },
  thumbnail: {
    width: '75px',
    height: '50px',
    objectFit: 'cover' as const,
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#f1f5f9',
    flexShrink: 0,
  },
  rowText: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    flex: 1,
    minWidth: 0,
  },
  rowUrl: {
    fontWeight: 600,
    fontSize: '0.85rem',
    color: 'var(--color-secondary-navy)',
    fontFamily: 'monospace',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap' as const,
  },
  rowMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sectionBadge: {
    fontSize: '0.725rem',
    background: 'rgba(12, 39, 69, 0.08)',
    color: 'var(--color-secondary-navy)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontWeight: 700,
    textTransform: 'uppercase' as const,
  },
  sizeText: {
    fontSize: '0.75rem',
    color: 'var(--color-primary-red)',
    fontWeight: 600,
  },
  rowActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginLeft: '1.5rem',
  },
  actionBtn: {
    backgroundColor: '#ffffff',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    fontSize: '0.75rem',
    transition: 'background-color 0.1s ease',
  },
  actionBtnDisabled: {
    backgroundColor: '#f1f5f9',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    width: '28px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'not-allowed',
    fontSize: '0.75rem',
    opacity: 0.4,
  },
  editBtn: {
    padding: '5px 12px',
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#ffffff',
    color: 'var(--color-text-secondary)',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  deleteBtn: {
    padding: '5px 12px',
    borderRadius: '4px',
    border: '1px solid #fca5a5',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    fontSize: '0.8rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  emptyState: {
    textAlign: 'center' as const,
    color: 'var(--color-text-secondary)',
    padding: '3rem 1rem',
    backgroundColor: '#f8fafc',
    borderRadius: 'var(--radius-md)',
    border: '1px dashed var(--color-border)',
    fontStyle: 'italic',
    fontSize: '0.85rem',
  },

  // Modal styles
  modalOverlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modalContent: {
    background: '#ffffff',
    width: '90%',
    maxWidth: '580px',
    borderRadius: 'var(--radius-lg)',
    boxShadow: 'var(--shadow-premium)',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.25rem 1.75rem',
    borderBottom: '1px solid var(--color-border)',
    background: '#f8fafc',
  },
  modalTitle: {
    fontSize: '1.15rem',
    fontWeight: 800,
    color: 'var(--color-secondary-navy)',
    margin: 0,
  },
  modalCloseBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    color: 'var(--color-text-muted)',
    lineHeight: '1',
  },
  modalBody: {
    padding: '1.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.25rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  modalLabel: {
    fontSize: '0.75rem',
    fontWeight: 800,
    color: 'var(--color-secondary-navy)',
    textTransform: 'uppercase' as const,
  },
  select: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '0.85rem',
    fontWeight: 600,
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    width: '150px',
  },
  sizeInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  sizeInfoLabel: {
    fontSize: '0.7rem',
    fontWeight: 700,
    color: 'var(--color-text-secondary)',
    textTransform: 'uppercase' as const,
  },
  sizeInfoVal: {
    fontSize: '0.85rem',
    fontWeight: 800,
    color: 'var(--color-primary-red)',
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    fontSize: '0.875rem',
    outline: 'none',
  },
  dividerRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    margin: '4px 0',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: 'var(--color-border)',
  },
  dividerText: {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: 'var(--color-text-muted)',
  },
  fileInput: {
    fontSize: '0.85rem',
    color: 'var(--color-text-secondary)',
  },
  uploadHint: {
    fontSize: '0.75rem',
    color: 'var(--color-text-muted)',
    marginTop: '2px',
    fontStyle: 'italic',
  },
  previewBox: {
    marginTop: '4px',
    backgroundColor: '#f8fafc',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
  },
  modalPreviewImg: {
    width: '100%',
    height: '150px',
    objectFit: 'contain' as const,
    borderRadius: '4px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#ffffff',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '1.25rem 1.75rem',
    borderTop: '1px solid var(--color-border)',
    background: '#f8fafc',
  },
  cancelBtn: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid var(--color-border)',
    backgroundColor: '#ffffff',
    color: 'var(--color-text-secondary)',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  saveBtn: {
    padding: '8px 18px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: 'var(--color-primary-red)',
    color: '#ffffff',
    fontWeight: 700,
    fontSize: '0.85rem',
    cursor: 'pointer',
    boxShadow: 'var(--shadow-sm)',
  },
};
