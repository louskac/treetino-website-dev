import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:19
* @route '/checkout'
*/
export const initiate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

initiate.definition = {
    methods: ["post"],
    url: '/checkout',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:19
* @route '/checkout'
*/
initiate.url = (options?: RouteQueryOptions) => {
    return initiate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:19
* @route '/checkout'
*/
initiate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:19
* @route '/checkout'
*/
const initiateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiate.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PreorderController::initiate
* @see app/Http/Controllers/Api/PreorderController.php:19
* @route '/checkout'
*/
initiateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: initiate.url(options),
    method: 'post',
})

initiate.form = initiateForm

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

const PreorderController = { initiate, invoice, invoicetest }

export default PreorderController