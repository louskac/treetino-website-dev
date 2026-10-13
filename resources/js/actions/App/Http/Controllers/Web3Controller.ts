import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/web3',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::index
* @see app/Http/Controllers/Web3Controller.php:19
* @route '/web3'
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
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
export const streamVideo = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamVideo.url(args, options),
    method: 'get',
})

streamVideo.definition = {
    methods: ["get","head"],
    url: '/web3/video/{filename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
streamVideo.url = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { filename: args }
    }

    if (Array.isArray(args)) {
        args = {
            filename: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        filename: args.filename,
    }

    return streamVideo.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
streamVideo.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: streamVideo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
streamVideo.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: streamVideo.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
const streamVideoForm = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: streamVideo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
streamVideoForm.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: streamVideo.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::streamVideo
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
streamVideoForm.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: streamVideo.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

streamVideo.form = streamVideoForm

const Web3Controller = { index, streamVideo }

export default Web3Controller