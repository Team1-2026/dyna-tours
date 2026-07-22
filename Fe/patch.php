<?php
$content = file_get_contents('backend/app/Http/Controllers/HotelController.php');
$content = str_replace(
    '// Update rooms if provided',
    '\Illuminate\Support\Facades\Log::info("Hotel update payload rooms:", ["rooms" => $request->rooms]);' . "\n" . '        // Update rooms if provided',
    $content
);
file_put_contents('backend/app/Http/Controllers/HotelController.php', $content);
