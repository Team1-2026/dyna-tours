const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

const getEmbedUrl = (url, autoplay = false) => {
  if (!url) return null;
  const formatted = url; // formatVideoUrl just returns url for full URLs
  if (!formatted) return null;
  
  const autoParam = autoplay ? '?autoplay=1' : '';
  
  // YouTube Regex to match standard, youtu.be, and shorts links
  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.b[e]\/)([^"&?\/\s]{11})/;
  const match = formatted.match(ytRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}${autoParam}`;
  }
  
  // Vimeo Regex
  const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;
  const vimeoMatch = formatted.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}${autoParam}`;
  }
  
  return formatted;
};

console.log(getEmbedUrl(url, true));
