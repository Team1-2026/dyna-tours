import React from 'react';

/**
 * Formats text by:
 * 1. Parsing **bold text** (including staff names and highlights) into styled <strong> elements with a distinct accent color.
 * 2. Converting HTTP/HTTPS/WWW URLs into clickable, active links.
 */
export function renderMessageWithLinks(
  text: string,
  linkClassName?: string,
  boldClassName?: string
): React.ReactNode {
  if (!text) return null;

  // Split by markdown bold pattern: **text**
  const boldParts = text.split(/(\*\*[^*]+\*\*)/g);

  return boldParts.map((part, bIdx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      const innerText = part.slice(2, -2);
      return (
        <strong
          key={`bold-${bIdx}`}
          className={boldClassName}
          style={{
            fontWeight: 700,
            color: '#d97706', // Vibrant amber/gold color for staff names and bold text
          }}
        >
          {renderUrls(innerText, linkClassName)}
        </strong>
      );
    }

    return <React.Fragment key={`text-${bIdx}`}>{renderUrls(part, linkClassName)}</React.Fragment>;
  });
}

function renderUrls(text: string, linkClassName?: string): React.ReactNode {
  const urlRegex = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      let url = part;
      let trailingPunctuation = '';

      const matchPunct = part.match(/^((?:https?:\/\/|www\.)[^\s<>"]+?)([.,!?;:]+)$/i);
      if (matchPunct) {
        url = matchPunct[1];
        trailingPunctuation = matchPunct[2];
      }

      const href = url.toLowerCase().startsWith('www.') ? `https://${url}` : url;

      return (
        <React.Fragment key={index}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {url}
          </a>
          {trailingPunctuation}
        </React.Fragment>
      );
    }

    return part;
  });
}

