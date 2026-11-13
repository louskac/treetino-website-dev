import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:36
* @route '/token'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/token',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:36
* @route '/token'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/web.php:36
* @route '/token'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/token'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see routes/web.php:36
* @route '/token'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/token'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see routes/web.php:36
* @route '/token'
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

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
export const nimbus = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nimbus.url(options),
    method: 'get',
})

nimbus.definition = {
    methods: ["get","head"],
    url: '/nimbus',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
nimbus.url = (options?: RouteQueryOptions) => {
    return nimbus.definition.url + queryParams(options)
}

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
nimbus.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nimbus.url(options),
    method: 'get',
})

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
nimbus.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nimbus.url(options),
    method: 'head',
})

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
const nimbusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nimbus.url(options),
    method: 'get',
})

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
nimbusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nimbus.url(options),
    method: 'get',
})

/**
* @see routes/web.php:44
* @route '/nimbus'
*/
nimbusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nimbus.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

nimbus.form = nimbusForm

const token = {
    index: Object.assign(index, index),
    nimbus: Object.assign(nimbus, nimbus),
}

export default token