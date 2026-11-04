<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageStorageService
{
    /**
     * Check if a string is a base64 data URL
     */
    public static function isBase64Image(?string $value): bool
    {
        if (!$value || !is_string($value)) {
            return false;
        }
        return (bool) preg_match('/^data:image\/[a-zA-Z0-9\+\-\.]+;base64,/i', trim($value));
    }

    /**
     * Convert a base64 data URL into a stored file in public storage and return the public URL path.
     * If not base64, returns the original value.
     */
    public static function saveBase64ToFile(?string $base64String, string $prefix = 'img'): string
    {
        if (!self::isBase64Image($base64String)) {
            return $base64String ?? '';
        }

        $trimmed = trim($base64String);

        if (preg_match('/^data:image\/([a-zA-Z0-9\+\-\.]+);base64,(.+)$/si', $trimmed, $matches)) {
            $rawExt = strtolower($matches[1]);
            $base64Data = $matches[2];

            $extMap = [
                'jpeg' => 'jpg',
                'jpg' => 'jpg',
                'png' => 'png',
                'webp' => 'webp',
                'svg+xml' => 'svg',
                'svg' => 'svg',
                'gif' => 'gif',
            ];
            $ext = $extMap[$rawExt] ?? 'jpg';

            $binary = base64_decode($base64Data);
            if ($binary !== false) {
                $filename = $prefix . '_' . Str::random(8) . '_' . time() . '.' . $ext;
                $path = 'uploads/' . $filename;
                Storage::disk('public')->put($path, $binary);
                return '/storage/' . $path;
            }
        }

        return $base64String;
    }

    /**
     * Clean and migrate gallery items (strings or { url, section } objects)
     * Replaces any base64 string with a stored file URL.
     */
    public static function cleanGallery(?array $gallery, string $prefix = 'gallery'): array
    {
        if (!is_array($gallery)) {
            return [];
        }

        $cleaned = [];
        foreach ($gallery as $item) {
            if (is_string($item)) {
                $cleaned[] = self::saveBase64ToFile($item, $prefix);
            } elseif (is_array($item)) {
                if (isset($item['url'])) {
                    $item['url'] = self::saveBase64ToFile($item['url'], $prefix);
                }
                $cleaned[] = $item;
            } elseif (is_object($item)) {
                if (isset($item->url)) {
                    $item->url = self::saveBase64ToFile($item->url, $prefix);
                }
                $cleaned[] = $item;
            } else {
                $cleaned[] = $item;
            }
        }

        return $cleaned;
    }
}

