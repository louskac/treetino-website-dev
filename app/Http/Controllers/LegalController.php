<?php

namespace App\Http\Controllers;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class LegalController extends Controller
{
    private \Closure $renderPublic;

    public function __construct()
    {
        $this->renderPublic = function ($component, $props = []) {
            return Inertia::render($component, array_merge([

            ], $props));
        };
    }

    public function tos(): Response
    {
        return ($this->renderPublic)('Legal/Tos', [

        ]);
    }

    public function pp(): Response
    {
        return ($this->renderPublic)('Legal/Pp', [

        ]);
    }

    public function nda(): Response
    {
        return ($this->renderPublic)('Legal/Nda', [

        ]);
    }

    /**
     * Download or stream the Sales NDA PDF (supports both CS and EN).
     */
    public function downloadNda(Request $request): HttpResponse|BinaryFileResponse
    {
        $lang = strtolower((string) $request->input('lang', 'cs'));
        $isEnglish = in_array($lang, ['en', 'eng', 'english'], true);

        $filename = $isEnglish
            ? 'treetino-nda-sales-partner-en.pdf'
            : 'treetino-nda-obchodni-zastupce.pdf';

        $viewName = $isEnglish ? 'pdf.nda-en' : 'pdf.nda';
        $pdfPath = public_path('downloads/'.$filename);

        if (file_exists($pdfPath) && ! $request->has('regenerate')) {
            return response()->download(
                $pdfPath,
                $filename,
                [
                    'Content-Type' => 'application/pdf',
                ]
            );
        }

        $pdf = Pdf::loadView($viewName)
            ->setPaper('a4', 'portrait');

        return response($pdf->output(), 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }
}
