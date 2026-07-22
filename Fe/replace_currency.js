const fs = require('fs');

const replaceInFile = (file, replacements) => {
  let content = fs.readFileSync(file, 'utf8');
  replacements.forEach(r => {
    content = content.replace(r.search, r.replace);
  });
  fs.writeFileSync(file, content);
  console.log(`Updated ${file}`);
};

replaceInFile('src/app/tours/page.tsx', [
  { search: /Under \$1,500/g, replace: 'Under ₹1,500' },
  { search: /Under \$2,000/g, replace: 'Under ₹2,000' },
  { search: /Under \$2,500/g, replace: 'Under ₹2,500' },
]);

replaceInFile('src/app/page.tsx', [
  { search: /Under \$1,500/g, replace: 'Under ₹1,500' },
  { search: /Under \$2,000/g, replace: 'Under ₹2,000' },
  { search: /Under \$2,500/g, replace: 'Under ₹2,500' },
  { search: /\$\{hotel\.price\}/g, replace: '₹{hotel.price}' }
]);

replaceInFile('src/data/toursData.ts', [
  { search: /\$550/g, replace: '₹550' },
  { search: /\$20/g, replace: '₹20' }
]);

replaceInFile('src/app/tours/[id]/page.tsx', [
  { search: /\$\{tour\.price\.toLocaleString\(\)\}/g, replace: '₹{tour.price.toLocaleString()}' }
]);

replaceInFile('src/app/tour-packages/[id]/page.tsx', [
  { search: /\$\{tour\.price\.toLocaleString\(\)\}/g, replace: '₹{tour.price.toLocaleString()}' }
]);

replaceInFile('src/app/hotels/[id]/HotelPageClient.tsx', [
  { search: /\$\{hotel\.price\}/g, replace: '₹{hotel.price}' },
  { search: /\$\{room\.price \|\| hotel\.price\}/g, replace: '₹{room.price || hotel.price}' }
]);

replaceInFile('src/app/destinations/[slug]/DestinationPageClient.tsx', [
  { search: /\$\{hotel\.price\}/g, replace: '₹{hotel.price}' }
]);

replaceInFile('src/app/admin/page.tsx', [
  { search: /\$\$\{room\.price\}/g, replace: '₹${room.price}' }
]);

replaceInFile('src/app/dashboard/page.tsx', [
  { search: /\$\$\{booking\.pricePaid\.toLocaleString\(\)\}/g, replace: '₹${booking.pricePaid.toLocaleString()}' },
  { search: /\$\{booking\.pricePaid\.toLocaleString\(\)\}/g, replace: '₹{booking.pricePaid.toLocaleString()}' }
]);

replaceInFile('src/components/TourCard.tsx', [
  { search: /\$\{tour\.price\.toLocaleString\(\)\}/g, replace: '₹{tour.price.toLocaleString()}' }
]);

