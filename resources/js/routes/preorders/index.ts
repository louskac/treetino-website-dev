import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PreorderController::invoice
* @see app/Http/Controllers/Api/PreorderController.php:99
* @route '/preorders/invoice'
*/
export const invoice = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invoice.url(options),
    method: 'post',
})

invoice.definition = {
    methods: ["post"],
    url: '/preorders/invoice',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PreorderController::invoice
* @see app/Http/Controllers/Api/PreorderController.php:99
* @route '/preorders/invoice'
*/
invoice.url = (options?: RouteQueryOptions) => {
    return invoice.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreorderController::invoice
* @see app/Http/Controllers/Api/PreorderController.php:99
* @route '/preorders/invoice'
*/
invoice.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: invoice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::invoice
* @see app/Http/Controllers/Api/PreorderController.php:99
* @route '/preorders/invoice'
*/
const invoiceForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invoice.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::invoice
* @see app/Http/Controllers/Api/PreorderController.php:99
* @route '/preorders/invoice'
*/
invoiceForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: invoice.url(options),
    method: 'post',
})

invoice.form = invoiceForm

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
export const invoicetest = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoicetest.url(options),
    method: 'get',
})

invoicetest.definition = {
    methods: ["get","head"],
    url: '/preorders/invoicetest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
invoicetest.url = (options?: RouteQueryOptions) => {
    return invoicetest.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
invoicetest.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: invoicetest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
invoicetest.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: invoicetest.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
const invoicetestForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoicetest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
invoicetestForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoicetest.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::invoicetest
* @see app/Http/Controllers/Api/PreorderController.php:125
* @route '/preorders/invoicetest'
*/
invoicetestForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: invoicetest.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

invoicetest.form = invoicetestForm

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
export const success = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(args, options),
    method: 'get',
})

success.definition = {
    methods: ["get","head"],
    url: '/preorders/{uuid}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
success.url = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { uuid: args }
    }

    if (Array.isArray(args)) {
        args = {
            uuid: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        uuid: args.uuid,
    }

    return success.definition.url
            .replace('{uuid}', parsedArgs.uuid.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
success.get = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: success.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
success.head = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: success.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
const successForm = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: success.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
successForm.get = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: success.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\OrderController::success
* @see app/Http/Controllers/OrderController.php:22
* @route '/preorders/{uuid}'
*/
successForm.head = (args: { uuid: string | number } | [uuid: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: success.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

success.form = successForm

const preorders = {
    invoice: Object.assign(invoice, invoice),
    invoicetest: Object.assign(invoicetest, invoicetest),
    success: Object.assign(success, success),
}

export default preorders