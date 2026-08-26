import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
export const treeV1 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: treeV1.url(options),
    method: 'get',
})

treeV1.definition = {
    methods: ["get","head"],
    url: '/products/treetino-v1',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
treeV1.url = (options?: RouteQueryOptions) => {
    return treeV1.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
treeV1.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: treeV1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
treeV1.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: treeV1.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
const treeV1Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: treeV1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
treeV1Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: treeV1.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV1
* @see app/Http/Controllers/ProductsController.php:21
* @route '/products/treetino-v1'
*/
treeV1Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: treeV1.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

treeV1.form = treeV1Form

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
export const treeV2 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: treeV2.url(options),
    method: 'get',
})

treeV2.definition = {
    methods: ["get","head"],
    url: '/products/treetino-v2',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
treeV2.url = (options?: RouteQueryOptions) => {
    return treeV2.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
treeV2.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: treeV2.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
treeV2.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: treeV2.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
const treeV2Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: treeV2.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
treeV2Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: treeV2.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::treeV2
* @see app/Http/Controllers/ProductsController.php:28
* @route '/products/treetino-v2'
*/
treeV2Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: treeV2.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

treeV2.form = treeV2Form

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
export const turbine = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: turbine.url(options),
    method: 'get',
})

turbine.definition = {
    methods: ["get","head"],
    url: '/products/turbine',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
turbine.url = (options?: RouteQueryOptions) => {
    return turbine.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
turbine.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: turbine.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
turbine.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: turbine.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
const turbineForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: turbine.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
turbineForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: turbine.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProductsController::turbine
* @see app/Http/Controllers/ProductsController.php:35
* @route '/products/turbine'
*/
turbineForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: turbine.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

turbine.form = turbineForm

const ProductsController = { treeV1, treeV2, turbine }

export default ProductsController