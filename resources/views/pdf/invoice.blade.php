<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        @font-face {
            font-family: 'DM Sans';
            font-style: normal;
            font-weight: 400;
            src: url('{{ storage_path('fonts/DMSans_18pt-Regular.ttf') }}') format('truetype');
        }

        @font-face {
            font-family: 'DM Sans';
            font-style: normal;
            font-weight: 600;
            src: url('{{ storage_path('fonts/DMSans_18pt-SemiBold.ttf') }}') format('truetype');
        }

        body {
            font-family: 'DM Sans', sans-serif;
            font-size: 11px;
            line-height: 11px;
        }

        b, strong {
            font-weight: 600;
        }

        .invoice-box { max-width: 800px; margin: auto; }
        .header { margin-bottom: 40px; }
        .details-table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        .details-table td { padding: 10px; vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th { background: #eee; border: 1px solid #ddd; padding: 8px; }
        .items-table td { border: 1px solid #ddd; padding: 8px; }
        .text-right { text-align: right; }
    </style>
</head>
<body>
<div class="invoice-box">
    <table class="details-table">
        <tr>
            <td>
                <img src="/img/branding/logo-type.svg" style="height: 30px" alt="">
                <div class="" style="margin-top: 10px">
                    Treetino Corp s.r.o.<br>
                    IČO: 10800107
                </div>
                <div style="margin-top: 10px">
                    Bílá - Vlčetín 62,<br>
                    463 43 — Bílá - Vlčetín
                </div>
            </td>
            <td class="text-right">
                <strong>Invoice #:</strong> {{ $preorder->id }}<br>
                <strong>Date:</strong> {{ $date }}<br>
                <strong>Status:</strong> {{ strtoupper($preorder->status) }}
            </td>
        </tr>
    </table>

    <table class="details-table">
        <tr>
            <td>
                <strong>Customer:</strong><br>
                {{ $preorder->user->name }}<br>
                {{ $preorder->user->email }}
            </td>
        </tr>
    </table>

    <table class="items-table">
        <thead>
        <tr>
            <th style="text-align: left">Product</th>
            <th style="text-align: left">Type</th>
            <th class="text-right">Price</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Preorder Deposit</td>
            <td>{{ $preorder->product_type }}</td>
            <td class="text-right">CZK {{ number_format($preorder->amount_total / 100, 2, '.', ',') }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="2" class="text-right"><strong>Total:</strong></td>
            <td class="text-right"><b>CZK {{ number_format($preorder->amount_total / 100, 2, '.', ',') }}</b></td>
        </tr>
        </tfoot>
    </table>
</div>
</body>
</html>
