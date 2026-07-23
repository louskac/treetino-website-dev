<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PreorderConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    /** @var array<int, array{label: string, value: string}> */
    public readonly array $configurationRows;

    /**
     * @param  array<string, mixed>  $configuration
     */
    public function __construct(
        public readonly string $uuid,
        array $configuration = [],
    ) {
        $this->configurationRows = $this->makeConfigurationRows($configuration);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Potvrzení objednávky',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.preorder-confirmation-html',
            text: 'emails.preorder-confirmation-text',
        );
    }

    public function attachments(): array
    {
        return [];
    }

    /**
     * @param  array<string, mixed>  $configuration
     * @return array<int, array{label: string, value: string}>
     */
    private function makeConfigurationRows(array $configuration): array
    {
        $labels = [
            'color' => 'Barva konstrukce',
            'leafColor' => 'Barva listů',
            'fveLeafDesign' => 'Design FVE listů',
            'connectivity' => 'Konektivita',
            'battery' => 'Baterie',
            'evChargerCount' => 'Počet EV nabíječek',
            'bikeChargerRequested' => 'Nabíječka pro elektrokola',
            'windTurbines' => 'Větrné turbíny',
            'turbineSize' => 'Velikost turbíny',
            'turbineMount' => 'Umístění turbíny',
            'treeDesign' => 'Design stromu',
            'grant' => 'Dotační program',
            'paymentMode' => 'Způsob platby',
        ];

        $valueLabels = [
            'windTurbines' => [
                'with-turbines' => 'S větrnými turbínami',
                'without-turbines' => 'Bez větrných turbín',
            ],
            'turbineSize' => [
                'large' => 'Velká (3 kW)',
                'medium' => 'Střední (1,5 kW)',
                'small' => 'Menší (1 kW)',
            ],
            'turbineMount' => [
                'roof' => 'Na střechu',
                'wall' => 'Na zeď',
                'pole' => 'Na sloup',
            ],
            'treeDesign' => [
                'standard' => 'Standardní',
                'cyber' => 'Cyber',
            ],
            'fveLeafDesign' => [
                'none' => 'Bez designu',
                'spring' => 'Jaro',
                'summer' => 'Léto',
                'autumn' => 'Podzim',
                'winter' => 'Zima',
            ],
            'paymentMode' => [
                'cash' => 'Hotovost',
                'credit' => 'Zelený úvěr',
            ],
        ];

        $skipIfEmpty = ['evChargerCount', 'bikeChargerRequested'];
        $rows = [];

        foreach ($configuration as $key => $value) {
            if (in_array($key, $skipIfEmpty, true) && ! $value) {
                continue;
            }

            if (is_bool($value)) {
                $displayValue = $value ? 'Ano' : 'Ne';
            } elseif (is_array($value)) {
                $displayValue = implode(', ', array_map('strval', $value));
            } else {
                $displayValue = $valueLabels[$key][(string) $value] ?? (string) $value;
            }

            $rows[] = [
                'label' => $labels[$key] ?? $key,
                'value' => $displayValue,
            ];
        }

        return $rows;
    }
}
