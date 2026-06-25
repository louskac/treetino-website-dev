# Configurator and reservation

## Start a configuration

Open `/configurator` or use a product page’s configuration button. Select one of the three available products:

- Strom V1;
- Strom V2;
- Wind turbine.

`[[SCREENSHOT]] - Configurator product selection showing all three products`

The configurator displays product output information and guides you through the options that apply to the selected product.

## Configure Strom V1

The Strom V1 flow includes:

1. structure color;
2. leaf color;
3. photovoltaic leaf design;
4. connectivity;
5. battery;
6. EV charger count and bicycle-charger request;
7. grant selection and checkout summary.

## Configure Strom V2

The Strom V2 flow includes:

1. wind-turbine configuration;
2. tree design;
3. structure color;
4. leaf color;
5. photovoltaic leaf design;
6. connectivity;
7. battery;
8. EV charger count and bicycle-charger request;
9. grant selection and checkout summary.

## Configure the wind turbine

The wind-turbine flow includes:

1. turbine size;
2. mounting type;
3. turbine color;
4. grant selection and checkout summary.

Use **Next** and **Back** to review the steps. Changing the selected product resets the configuration to that product’s defaults.

`[[SCREENSHOT]] - A configurator option step with the current selection`

## Grant and financing estimate

The summary uses the selected grant, estimated monthly savings, down payment, financing period, and annual interest rate to show an indicative calculation. This calculation is informational and is separate from the reservation payment.

`[[SCREENSHOT]] - Configuration summary with grant and financing estimate`

## Reserve a product

Current reservation payments are:

- Strom V1: CZK 12,000;
- Strom V2: CZK 12,000;
- Wind turbine: CZK 6,000.

To reserve the configured product:

1. review the configuration summary;
2. open the reservation checkout;
3. enter a valid email address;
4. enter the payment details in the Stripe payment form;
5. submit the payment once and wait for confirmation.

`[[SCREENSHOT]] - Reservation checkout with email and Stripe payment fields`

The site creates or reuses a customer record for the submitted email and creates a preorder containing the selected configuration. The reservation charge is processed in Czech koruna through Stripe.

Do not close the page or submit the form repeatedly while payment is processing.

## Payment result and invoice

After a successful checkout, the site opens the preorder confirmation page identified by the reservation UUID. The page displays the reservation details and configured options.

Use the invoice action on this page to download a PDF invoice for the reservation.

`[[SCREENSHOT]] - Successful preorder page with reservation summary and invoice action`

Keep the confirmation link for your records. It contains the reservation identifier used to retrieve the confirmation and invoice.
