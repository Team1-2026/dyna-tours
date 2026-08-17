'use client';

import React, { useState, useRef, useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  minHeight?: string;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  minHeight = '250px',
  placeholder = 'Write content here...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTargetBlank, setLinkTargetBlank] = useState(false);
  const [savedSelectionRange, setSavedSelectionRange] = useState<Range | null>(null);

  // Synchronize external value with contentEditable div without losing cursor
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      // Only set if different to prevent cursor jumps
      if (document.activeElement !== editorRef.current) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      editorRef.current.focus();
      handleInput();
    }
  };

  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      setSavedSelectionRange(sel.getRangeAt(0));
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRange) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRange);
      }
    }
  };

  const openLinkDialog = () => {
    saveSelection();
    const sel = window.getSelection();
    let initialUrl = '';
    if (sel && sel.anchorNode) {
      let parent: HTMLElement | null = sel.anchorNode.parentElement;
      while (parent && parent !== editorRef.current) {
        if (parent.tagName === 'A') {
          initialUrl = parent.getAttribute('href') || '';
          setLinkTargetBlank(parent.getAttribute('target') === '_blank');
          break;
        }
        parent = parent.parentElement;
      }
    }
    setLinkUrl(initialUrl);
    setShowLinkModal(true);
  };

  const applyLink = () => {
    restoreSelection();
    setShowLinkModal(false);

    if (!linkUrl.trim()) {
      // Remove link if empty
      execCommand('unlink');
      return;
    }

    const formattedUrl = linkUrl.trim();
    execCommand('createLink', formattedUrl);

    // Apply target="_blank" if checked
    setTimeout(() => {
      if (editorRef.current) {
        const anchors = editorRef.current.querySelectorAll('a');
        anchors.forEach((a) => {
          if (a.getAttribute('href') === formattedUrl) {
            if (linkTargetBlank) {
              a.setAttribute('target', '_blank');
              a.setAttribute('rel', 'noopener noreferrer');
            } else {
              a.removeAttribute('target');
              a.removeAttribute('rel');
            }
          }
        });
        handleInput();
      }
    }, 50);
  };

  const removeLink = () => {
    restoreSelection();
    setShowLinkModal(false);
    execCommand('unlink');
  };

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '12px',
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Editor Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.6rem 0.8rem',
          background: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          userSelect: 'none',
        }}
      >
        {/* Header Block Selector */}
        <select
          onChange={(e) => {
            const val = e.target.value;
            if (val === 'p') {
              execCommand('formatBlock', '<p>');
            } else {
              execCommand('formatBlock', `<${val}>`);
            }
          }}
          defaultValue="p"
          style={{
            padding: '0.35rem 0.6rem',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            background: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#334155',
            cursor: 'pointer',
          }}
          title="Text Block Type"
        >
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1 (H1)</option>
          <option value="h2">Heading 2 (H2)</option>
          <option value="h3">Heading 3 (H3)</option>
          <option value="h4">Heading 4 (H4)</option>
        </select>

        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 0.2rem' }} />

        {/* Formatting Buttons */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('bold')}
          title="Bold (Ctrl+B)"
          style={btnStyle}
        >
          <strong>B</strong>
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('italic')}
          title="Italics (Ctrl+I)"
          style={btnStyle}
        >
          <em>I</em>
        </button>

        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 0.2rem' }} />

        {/* Lists */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet Points"
          style={btnStyle}
        >
          • List
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
          style={btnStyle}
        >
          1. List
        </button>

        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 0.2rem' }} />

        {/* Text Alignments */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('justifyLeft')}
          title="Align Left"
          style={btnStyle}
        >
          ⇐ Left
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('justifyCenter')}
          title="Align Center"
          style={btnStyle}
        >
          ⇔ Center
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('justifyRight')}
          title="Align Right"
          style={btnStyle}
        >
          ⇒ Right
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('justifyFull')}
          title="Justify Text"
          style={btnStyle}
        >
          ≡ Justify
        </button>

        <span style={{ width: '1px', height: '20px', background: '#cbd5e1', margin: '0 0.2rem' }} />

        {/* Hyperlink */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={openLinkDialog}
          title="Insert / Edit Link"
          style={{ ...btnStyle, background: '#eff6ff', color: '#1d4ed8', borderColor: '#bfdbfe' }}
        >
          🔗 Link
        </button>

        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => execCommand('removeFormat')}
          title="Clear Formatting"
          style={{ ...btnStyle, color: '#64748b' }}
        >
          🧹 Clear
        </button>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        style={{
          minHeight,
          padding: '1rem 1.25rem',
          outline: 'none',
          fontSize: '0.95rem',
          lineHeight: '1.75',
          color: '#1e293b',
        }}
        data-placeholder={placeholder}
      />

      {/* Link Modal */}
      {showLinkModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '1.5rem',
              width: '90%',
              maxWidth: '460px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              🔗 Insert / Edit Hyperlink
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
                URL / Path
              </label>
              <input
                type="text"
                placeholder="e.g. /destinations/dubai or https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                }}
                autoFocus
              />
              <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', display: 'block' }}>
                Use <code>/page-slug</code> for internal links or <code>https://...</code> for external links.
              </span>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={linkTargetBlank}
                  onChange={(e) => setLinkTargetBlank(e.target.checked)}
                />
                Open in new tab (<code>target="_blank"</code>)
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              {linkUrl && (
                <button
                  type="button"
                  onClick={removeLink}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #fca5a5',
                    background: '#fef2f2',
                    color: '#991b1b',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    marginRight: 'auto',
                  }}
                >
                  Remove Link
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#f8fafc',
                  color: '#475569',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={applyLink}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0C2745',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                }}
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  padding: '0.35rem 0.6rem',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  background: '#ffffff',
  fontSize: '0.825rem',
  fontWeight: 600,
  color: '#334155',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};
