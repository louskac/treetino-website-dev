import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
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

const OrderController = { success }

export default OrderController