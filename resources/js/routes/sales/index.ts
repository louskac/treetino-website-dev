import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sales',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\SalesController::index
* @see app/Http/Controllers/SalesController.php:13
* @route '/sales'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const sales = {
    index: Object.assign(index, index),
}

export default sales