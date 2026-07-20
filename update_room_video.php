<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$hotel = \App\Models\Hotel::with('rooms')->find('blanket-hotel-spa-munnar');
if ($hotel) {
    $room = $hotel->rooms()->where('type', 'Blanket Camelia')->first();
    if ($room) {
        $room->video_url = 'https://www.youtube.com/watch?v=DYtaEFkyx28';
        $room->save();
        echo "Updated Room Video URL successfully!\n";
    } else {
        echo "Room not found\n";
    }
} else {
    echo "Hotel not found\n";
}
