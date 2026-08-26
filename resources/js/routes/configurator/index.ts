import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
export const product = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: product.url(args, options),
    method: 'get',
})

product.definition = {
    methods: ["get","head"],
    url: '/configurator/{product}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
product.url = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return product.definition.url
            .replace('{product}', parsedArgs.product.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
product.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: product.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
product.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: product.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
const productForm = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: product.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
productForm.get = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: product.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ConfiguratorController::product
* @see app/Http/Controllers/ConfiguratorController.php:21
* @route '/configurator/{product}'
*/
productForm.head = (args: { product: string | number } | [product: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: product.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

product.form = productForm

const configurator = {
    product: Object.assign(product, product),
}

export default configurator