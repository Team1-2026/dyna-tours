import React from 'react';

/**
 * Formats text by converting HTTP/HTTPS/WWW URLs into clickable, active links.
 */
export function renderMessageWithLinks(text: string, linkClassName?: string): React.ReactNode {
  if (!text) return null;

  // Regex to match http://, https://, or www. URLs
  const urlRegex = /(https?:\/\/[^\s<>"]+|www\.[^\s<>"]+)/gi;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (/^(https?:\/\/|www\.)/i.test(part)) {
      let url = part;
      let trailingPunctuation = '';

      // Separate trailing punctuation (such as trailing period, comma, question mark) from the URL
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
