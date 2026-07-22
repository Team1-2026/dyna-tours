const http = require('http');

const data = JSON.stringify({
  rooms: [
    {
      type: "Blanket Camelia",
      size: "320 sq.ft",
      view: "Garden View",
      bed_type: "Queen Bed",
      breakfast: "Included",
      occupancy: "3 Adults",
      image: "/images/blanket_camelia.jpg",
      description: "Charming and cozy rooms featuring lovely views of the manicured gardens and surrounding greenery.",
      images: ["/images/blanket_camelia.jpg", "/images/blanket_hotel_room1.jpg"],
      amenities: ["Wifi", "AC", "TV", "Tea Maker", "Safe"],
      price: 150,
      video_url: "https://www.youtube.com/watch?v=kY41g2lF4A0" // Test updating to a different video!
    }
  ]
});

const options = {
  hostname: 'localhost',
  port: 8000,
  path: '/api/hotels/blanket-hotel-spa-munnar',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Body: ${body}`);
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(data);
req.end();
