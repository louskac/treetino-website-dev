import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
/**
* @see routes/web.php:61
* @route '/pitch'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/pitch',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:61
* @route '/pitch'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see routes/web.php:61
* @route '/pitch'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see routes/web.php:61
* @route '/pitch'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see routes/web.php:61
* @route '/pitch'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see routes/web.php:61
* @route '/pitch'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see routes/web.php:61
* @route '/pitch'
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
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
export const hackathon = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hackathon.url(options),
    method: 'get',
})

hackathon.definition = {
    methods: ["get","head"],
    url: '/pitch-hackathon',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
hackathon.url = (options?: RouteQueryOptions) => {
    return hackathon.definition.url + queryParams(options)
}

/**
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
hackathon.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: hackathon.url(options),
    method: 'get',
})

/**
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
hackathon.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: hackathon.url(options),
    method: 'head',
})

/**
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
const hackathonForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hackathon.url(options),
    method: 'get',
})

/**
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
hackathonForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hackathon.url(options),
    method: 'get',
})

/**
* @see routes/web.php:64
* @route '/pitch-hackathon'
*/
hackathonForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: hackathon.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

hackathon.form = hackathonForm

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
export const fintech = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fintech.url(options),
    method: 'get',
})

fintech.definition = {
    methods: ["get","head"],
    url: '/pitch-fintech',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
fintech.url = (options?: RouteQueryOptions) => {
    return fintech.definition.url + queryParams(options)
}

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
fintech.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: fintech.url(options),
    method: 'get',
})

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
fintech.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: fintech.url(options),
    method: 'head',
})

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
const fintechForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fintech.url(options),
    method: 'get',
})

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
fintechForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fintech.url(options),
    method: 'get',
})

/**
* @see routes/web.php:67
* @route '/pitch-fintech'
*/
fintechForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: fintech.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

fintech.form = fintechForm

const pitch = {
    index: Object.assign(index, index),
    hackathon: Object.assign(hackathon, hackathon),
    fintech: Object.assign(fintech, fintech),
}

export default pitch