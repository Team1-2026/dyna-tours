const urls = [
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "https://youtu.be/dQw4w9WgXcQ",
  "https://vimeo.com/123456789",
  "https://player.vimeo.com/video/123456789",
  "https://youtube.com/shorts/dQw4w9WgXcQ"
];

const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.b[e]\/)([^"&?\/\s]{11})/;
const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/;

urls.forEach(url => {
  let res = url;
  const match = url.match(ytRegex);
  if (match && match[1]) {
    res = `https://www.youtube.com/embed/${match[1]}`;
  } else {
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
        res = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
  }
  console.log(url, "=>", res);
});
