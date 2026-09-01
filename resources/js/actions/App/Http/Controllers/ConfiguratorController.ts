import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
const indexcf288da5537793a2740acbb775632b3d = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexcf288da5537793a2740acbb775632b3d.url(options),
    method: 'get',
})

indexcf288da5537793a2740acbb775632b3d.definition = {
    methods: ["get","head"],
    url: '/configurator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
indexcf288da5537793a2740acbb775632b3d.url = (options?: RouteQueryOptions) => {
    return indexcf288da5537793a2740acbb775632b3d.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
indexcf288da5537793a2740acbb775632b3d.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexcf288da5537793a2740acbb775632b3d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
indexcf288da5537793a2740acbb775632b3d.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexcf288da5537793a2740acbb775632b3d.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
const indexcf288da5537793a2740acbb775632b3dForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexcf288da5537793a2740acbb775632b3d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
indexcf288da5537793a2740acbb775632b3dForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexcf288da5537793a2740acbb775632b3d.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator'
*/
indexcf288da5537793a2740acbb775632b3dForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexcf288da5537793a2740acbb775632b3d.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexcf288da5537793a2740acbb775632b3d.form = indexcf288da5537793a2740acbb775632b3dForm
/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
const indexe6157d8352d2f30082765849b7332c54 = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe6157d8352d2f30082765849b7332c54.url(args, options),
    method: 'get',
})

indexe6157d8352d2f30082765849b7332c54.definition = {
    methods: ["get","head"],
    url: '/configurator/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
indexe6157d8352d2f30082765849b7332c54.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { product: args }
    }

    if (Array.isArray(args)) {
        args = {
            product: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        product: args.product,
    }

    return indexe6157d8352d2f30082765849b7332c54.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
indexe6157d8352d2f30082765849b7332c54.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexe6157d8352d2f30082765849b7332c54.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
indexe6157d8352d2f30082765849b7332c54.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexe6157d8352d2f30082765849b7332c54.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
const indexe6157d8352d2f30082765849b7332c54Form = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe6157d8352d2f30082765849b7332c54.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
indexe6157d8352d2f30082765849b7332c54Form.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe6157d8352d2f30082765849b7332c54.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::index
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
indexe6157d8352d2f30082765849b7332c54Form.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexe6157d8352d2f30082765849b7332c54.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexe6157d8352d2f30082765849b7332c54.form = indexe6157d8352d2f30082765849b7332c54Form

export const index = {
    '/configurator': indexcf288da5537793a2740acbb775632b3d,
    '/configurator/{product}': indexe6157d8352d2f30082765849b7332c54,
}

const ConfiguratorController = { index }

export default ConfiguratorController