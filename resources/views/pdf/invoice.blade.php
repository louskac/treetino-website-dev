<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        body { font-family: 'DejaVu Sans', sans-serif; font-size: 14px; }
        .invoice-box { max-width: 800px; margin: auto; }
        .header { margin-bottom: 40px; }
        .details-table { width: 100%; line-height: inherit; text-align: left; border-collapse: collapse; }
        .details-table td { padding: 10px; vertical-align: top; }
        .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        .items-table th { background: #eee; border: 1px solid #ddd; padding: 8px; }
        .items-table td { border: 1px solid #ddd; padding: 8px; }
        .text-right { text-align: right; }
        .total { font-weight: bold; font-size: 18px; }
    </style>
</head>
<body>
<div class="invoice-box">
    <table class="details-table">
        <tr>
            <td>
                <h2>LOGO</h2>
                Your Company S.R.O.<br>
                Street 123, Prague
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
            <th>Product</th>
            <th>Type</th>
            <th class="text-right">Price</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td>Preorder Deposit</td>
            <td>{{ $preorder->type }}</td>
            <td class="text-right">{{ $preorder->amount_total }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="2" class="text-right"><strong>Total:</strong></td>
            <td class="text-right total">€500.00</td>
        </tr>
        </tfoot>
    </table>
</div>
</body>
</html>
