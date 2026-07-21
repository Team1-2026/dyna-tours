'use client';

import React, { useRef, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toursData } from '@/data/toursData';
import styles from './RichTextEditor.module.css';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  id?: string;
}

export default function RichTextEditor({ value, onChange, placeholder, label, id }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef<string>(value);
  const [isMounted, setIsMounted] = useState(false);
  const [internalLinks, setInternalLinks] = useState<{ label: string; url: string }[]>([]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch and compile available destinations, hotels, and tours for internal linking
  useEffect(() => {
    if (!isMounted) return;

    const fetchInternalItems = async () => {
      try {
        const [dests, htls] = await Promise.all([
          api.getDestinations().catch(() => []),
          api.getHotels().catch(() => [])
        ]);

        const links: { label: string; url: string }[] = [];
        
        // Add Destinations
        dests.forEach(d => {
          links.push({ label: `📍 Dest: ${d.name}`, url: `/destinations/${d.id}` });
        });

        // Add Hotels
        htls.forEach(h => {
          links.push({ label: `🏨 Hotel: ${h.name}`, url: `/hotels/${h.id}` });
        });

        // Add Tour Packages
        toursData.forEach(t => {
          links.push({ label: `🎒 Tour: ${t.title}`, url: `/tour-packages/${t.id}` });
        });

        setInternalLinks(links);
      } catch (error) {
        console.error('Failed to load internal links list', error);
      }
    };

    fetchInternalItems();
  }, [isMounted]);

  // Sync value if it is modified externally (e.g. when selected hotel/destination changes)
  useEffect(() => {
    if (editorRef.current && value !== lastHtmlRef.current) {
      editorRef.current.innerHTML = value || '';
      lastHtmlRef.current = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      // If it is just an empty tag or br left by browser, normalize to empty string
      const normalizedHtml = (html === '<br>' || html === '<p><br></p>') ? '' : html;
      lastHtmlRef.current = normalizedHtml;
      onChange(normalizedHtml);
    }
  };

  const executeCommand = (command: string, valueStr: string = '') => {
    document.execCommand(command, false, valueStr);
    handleInput();
  };

  const handleToolbarAction = (e: React.MouseEvent, command: string, valueStr: string = '') => {
    e.preventDefault(); // Keep focus on the contentEditable editor
    executeCommand(command, valueStr);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  if (!isMounted) {
    return (
      <div className={styles.container}>
        {label && <label className={styles.label}>{label}</label>}
        <div className={styles.editorPlaceholder} />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {label && <label htmlFor={id} className={styles.label}>{label}</label>}
      <div className={styles.editorWrapper}>
        <div className={styles.toolbar}>
          {/* Bold & Underline */}
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'bold')}
            title="Bold (Ctrl+B)"
            className={styles.toolBtn}
          >
            <b>B</b>
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'underline')}
            title="Underline (Ctrl+U)"
            className={styles.toolBtn}
          >
            <u>U</u>
          </button>
          
          <div className={styles.separator} />
          
          {/* Headings */}
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'formatBlock', '<h1>')}
            title="Heading 1"
            className={styles.toolBtn}
            style={{ fontWeight: 800 }}
          >
            H1
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'formatBlock', '<h2>')}
            title="Heading 2"
            className={styles.toolBtn}
            style={{ fontWeight: 700 }}
          >
            H2
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'formatBlock', '<p>')}
            title="Paragraph"
            className={styles.toolBtn}
          >
            P
          </button>
          
          <div className={styles.separator} />

          {/* Text Alignments */}
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'justifyLeft')}
            title="Align Left"
            className={styles.toolBtn}
          >
            ⟨ Left
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'justifyCenter')}
            title="Align Center"
            className={styles.toolBtn}
          >
            | Center |
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'justifyRight')}
            title="Align Right"
            className={styles.toolBtn}
          >
            Right ⟩
          </button>

          <div className={styles.separator} />
          
          {/* Bullet Points */}
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'insertUnorderedList')}
            title="Bullet List"
            className={styles.toolBtn}
          >
            • List
          </button>

          <div className={styles.separator} />

          {/* Color Selection */}
          <div className={styles.colorPickerWrapper} title="Text Color">
            <span className={styles.colorIcon}>🎨 Color</span>
            <input
              type="color"
              onChange={(e) => executeCommand('foreColor', e.target.value)}
              className={styles.colorInput}
            />
          </div>

          <div className={styles.separator} />
          
          {/* Hyperlinks */}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              const url = prompt('Enter link URL (e.g., https://google.com):');
              if (url) {
                executeCommand('createLink', url);
              }
            }}
            title="Insert External Link"
            className={styles.toolBtn}
          >
            🔗 Link
          </button>

          {/* Internal Linking Dropdown Selector */}
          <select
            className={styles.toolSelect}
            defaultValue=""
            onChange={(e) => {
              const url = e.target.value;
              if (url) {
                executeCommand('createLink', url);
                e.target.value = ''; // Reset dropdown after execution
              }
            }}
          >
            <option value="" disabled>📁 Internal Linking...</option>
            {internalLinks.map((item, idx) => (
              <option key={idx} value={item.url}>
                {item.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'unlink')}
            title="Remove Link"
            className={styles.toolBtn}
          >
            🪓 Unlink
          </button>
          <button
            type="button"
            onMouseDown={(e) => handleToolbarAction(e, 'removeFormat')}
            title="Clear Formatting"
            className={styles.toolBtn}
          >
            🧹 Clear
          </button>
        </div>
        
        <div
          ref={editorRef}
          id={id}
          className={styles.editor}
          contentEditable
          onInput={handleInput}
          data-placeholder={placeholder || 'Start typing details...'}
        />
      </div>
    </div>
  );
}
