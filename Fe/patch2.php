<?php
$content = file_get_contents('src/app/admin/page.tsx');
$content = str_replace(
    'const response = await api.updateHotel(selectedHotelId, {',
    'console.log("PAYLOAD TO SEND:", dataToSave.rooms); const response = await api.updateHotel(selectedHotelId, {',
    $content
);
file_put_contents('src/app/admin/page.tsx', $content);
