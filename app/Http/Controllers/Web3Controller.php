<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class Web3Controller extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([], $props));
        };
    }

    public function index()
    {
        return ($this->renderPublic)('Web3/Index', []);
    }

    /**
     * Stream MP4 video with full RFC 7233 Byte-Range support (HTTP 206 Partial Content).
     * This enables arbitrary instant slider seeking / scrubbing in HTML5 video players.
     */
    public function streamVideo(Request $request, string $filename)
    {
        $allowed = [
            'pitch-web.mp4',
            'demo-web.mp4',
            'colosseum-pitch.mp4',
            'drone-shot-web.mp4',
            'app-web.mp4',
            'app.mp4',
        ];

        if (!in_array($filename, $allowed, true)) {
            abort(404);
        }

        $path = public_path("video/{$filename}");
        if (!file_exists($path)) {
            abort(404);
        }

        $fileSize = filesize($path);
        $start = 0;
        $end = $fileSize - 1;
        $status = 200;

        $headers = [
            'Content-Type' => 'video/mp4',
            'Accept-Ranges' => 'bytes',
            'Cache-Control' => 'public, max-age=86400',
        ];

        if ($request->hasHeader('Range')) {
            $range = $request->header('Range');
            if (preg_match('/bytes=(\d+)-(\d+)?/', $range, $matches)) {
                $start = (int)$matches[1];
                if (!empty($matches[2])) {
                    $end = (int)$matches[2];
                }
                $status = 206;
                $length = $end - $start + 1;
                $headers['Content-Range'] = "bytes {$start}-{$end}/{$fileSize}";
                $headers['Content-Length'] = (string)$length;
            }
        } else {
            $headers['Content-Length'] = (string)$fileSize;
        }

        return response()->stream(function () use ($path, $start, $end) {
            $stream = fopen($path, 'rb');
            if (!$stream) return;
            fseek($stream, $start);
            $chunkSize = 512 * 1024; // 512 KB
            $remaining = $end - $start + 1;
            while (!feof($stream) && $remaining > 0 && connection_status() === CONNECTION_NORMAL) {
                $read = min($chunkSize, $remaining);
                $data = fread($stream, $read);
                if ($data === false) break;
                echo $data;
                flush();
                $remaining -= strlen($data);
            }
            fclose($stream);
        }, $status, $headers);
    }
}
