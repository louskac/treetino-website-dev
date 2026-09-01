import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
export const download = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/legal/nda/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
download.url = (options?: RouteQueryOptions) => {
    return download.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
download.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
download.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
const downloadForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::download
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const nda = {
    download: Object.assign(download, download),
}

export default nda