<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use App\Services\ImageStorageService;
use App\Models\Hotel;
use App\Models\Cruise;
use App\Models\GroupTour;
use App\Models\TourPackage;
use App\Models\Destination;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('images:migrate-base64', function () {
    $this->info('Starting migration of Base64 images to physical storage...');
    $totalMigrated = 0;

    // 1. Hotels
    $hotels = Hotel::all();
    foreach ($hotels as $hotel) {
        $changed = false;
        if (is_array($hotel->gallery)) {
            $hasBase64 = false;
            foreach ($hotel->gallery as $item) {
                $u = is_string($item) ? $item : ($item['url'] ?? '');
                if (ImageStorageService::isBase64Image($u)) {
                    $hasBase64 = true;
                    break;
                }
            }
            if ($hasBase64) {
                $hotel->gallery = ImageStorageService::cleanGallery($hotel->gallery, 'hotel_gallery');
                $changed = true;
            }
        }
        if ($changed) {
            $hotel->save();
            $this->line("Migrated base64 gallery for Hotel: {$hotel->name} ({$hotel->id})");
            $totalMigrated++;
        }
    }

    // 2. Cruises
    $cruises = Cruise::all();
    foreach ($cruises as $cruise) {
        $changed = false;
        if (ImageStorageService::isBase64Image($cruise->banner_image)) {
            $cruise->banner_image = ImageStorageService::saveBase64ToFile($cruise->banner_image, 'cruise_banner');
            $changed = true;
        }
        if (is_array($cruise->gallery)) {
            $hasBase64 = false;
            foreach ($cruise->gallery as $item) {
                $u = is_string($item) ? $item : ($item['url'] ?? '');
                if (ImageStorageService::isBase64Image($u)) {
                    $hasBase64 = true;
                    break;
                }
            }
            if ($hasBase64) {
                $cruise->gallery = ImageStorageService::cleanGallery($cruise->gallery, 'cruise_gallery');
                $changed = true;
            }
        }
        if ($changed) {
            $cruise->save();
            $this->line("Migrated base64 images for Cruise: {$cruise->name} ({$cruise->id})");
            $totalMigrated++;
        }
    }

    // 3. Group Tours
    $groupTours = GroupTour::all();
    foreach ($groupTours as $tour) {
        $changed = false;
        if (ImageStorageService::isBase64Image($tour->image)) {
            $tour->image = ImageStorageService::saveBase64ToFile($tour->image, 'grouptour_img');
            $changed = true;
        }
        if (ImageStorageService::isBase64Image($tour->banner_image)) {
            $tour->banner_image = ImageStorageService::saveBase64ToFile($tour->banner_image, 'grouptour_banner');
            $changed = true;
        }
        if (is_array($tour->gallery)) {
            $hasBase64 = false;
            foreach ($tour->gallery as $item) {
                $u = is_string($item) ? $item : ($item['url'] ?? '');
                if (ImageStorageService::isBase64Image($u)) {
                    $hasBase64 = true;
                    break;
                }
            }
            if ($hasBase64) {
                $tour->gallery = ImageStorageService::cleanGallery($tour->gallery, 'grouptour_gallery');
                $changed = true;
            }
        }
        if ($changed) {
            $tour->save();
            $this->line("Migrated base64 images for GroupTour: {$tour->title} ({$tour->id})");
            $totalMigrated++;
        }
    }

    // 4. Tour Packages
    $packages = TourPackage::all();
    foreach ($packages as $pkg) {
        $changed = false;
        if (ImageStorageService::isBase64Image($pkg->image)) {
            $pkg->image = ImageStorageService::saveBase64ToFile($pkg->image, 'pkg_img');
            $changed = true;
        }
        if (is_array($pkg->gallery)) {
            $hasBase64 = false;
            foreach ($pkg->gallery as $item) {
                $u = is_string($item) ? $item : ($item['url'] ?? '');
                if (ImageStorageService::isBase64Image($u)) {
                    $hasBase64 = true;
                    break;
                }
            }
            if ($hasBase64) {
                $pkg->gallery = ImageStorageService::cleanGallery($pkg->gallery, 'pkg_gallery');
                $changed = true;
            }
        }
        if ($changed) {
            $pkg->save();
            $this->line("Migrated base64 images for TourPackage: {$pkg->name} ({$pkg->id})");
            $totalMigrated++;
        }
    }

    // 5. Destinations
    $destinations = Destination::all();
    foreach ($destinations as $dest) {
        $changed = false;
        if (ImageStorageService::isBase64Image($dest->banner_image)) {
            $dest->banner_image = ImageStorageService::saveBase64ToFile($dest->banner_image, 'dest_banner');
            $changed = true;
        }
        if (is_array($dest->gallery)) {
            $hasBase64 = false;
            foreach ($dest->gallery as $item) {
                $u = is_string($item) ? $item : ($item['url'] ?? '');
                if (ImageStorageService::isBase64Image($u)) {
                    $hasBase64 = true;
                    break;
                }
            }
            if ($hasBase64) {
                $dest->gallery = ImageStorageService::cleanGallery($dest->gallery, 'dest_gallery');
                $changed = true;
            }
        }
        if ($changed) {
            $dest->save();
            $this->line("Migrated base64 images for Destination: {$dest->name} ({$dest->id})");
            $totalMigrated++;
        }
    }

    $this->info("Migration completed! {$totalMigrated} records updated.");
})->purpose('Migrate any base64 image strings from database into physical storage files');
