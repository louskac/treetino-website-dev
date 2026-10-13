import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
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
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
export const video = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: video.url(args, options),
    method: 'get',
})

video.definition = {
    methods: ["get","head"],
    url: '/web3/video/{filename}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
video.url = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return video.definition.url
            .replace('{filename}', parsedArgs.filename.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
video.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: video.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
video.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: video.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
const videoForm = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: video.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
videoForm.get = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: video.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web3Controller::video
* @see app/Http/Controllers/Web3Controller.php:28
* @route '/web3/video/{filename}'
*/
videoForm.head = (args: { filename: string | number } | [filename: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: video.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

video.form = videoForm

const web3 = {
    index: Object.assign(index, index),
    video: Object.assign(video, video),
}

export default web3