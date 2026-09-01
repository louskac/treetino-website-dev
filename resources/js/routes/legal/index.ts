import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import nda1c7b84 from './nda'
/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
export const tos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tos.url(options),
    method: 'get',
})

tos.definition = {
    methods: ["get","head"],
    url: '/legal/terms-and-conditions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
tos.url = (options?: RouteQueryOptions) => {
    return tos.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
tos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
tos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tos.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
const tosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
tosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tos.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::tos
* @see app/Http/Controllers/LegalController.php:25
* @route '/legal/terms-and-conditions'
*/
tosForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tos.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tos.form = tosForm

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
export const pp = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pp.url(options),
    method: 'get',
})

pp.definition = {
    methods: ["get","head"],
    url: '/legal/privacy-policy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
pp.url = (options?: RouteQueryOptions) => {
    return pp.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
pp.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pp.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
pp.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pp.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
const ppForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pp.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
ppForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pp.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::pp
* @see app/Http/Controllers/LegalController.php:32
* @route '/legal/privacy-policy'
*/
ppForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pp.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

pp.form = ppForm

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
export const nda = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nda.url(options),
    method: 'get',
})

nda.definition = {
    methods: ["get","head"],
    url: '/legal/nda',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda.url = (options?: RouteQueryOptions) => {
    return nda.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nda.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nda.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
const ndaForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nda.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
ndaForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nda.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
ndaForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nda.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

nda.form = ndaForm

const legal = {
    tos: Object.assign(tos, tos),
    pp: Object.assign(pp, pp),
    nda: Object.assign(nda, nda1c7b84),
}

export default legal