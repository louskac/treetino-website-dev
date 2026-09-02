import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
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
const nda4fc3351bfc10f4baee67d9e253fc77cc = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
})

nda4fc3351bfc10f4baee67d9e253fc77cc.definition = {
    methods: ["get","head"],
    url: '/legal/nda',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda4fc3351bfc10f4baee67d9e253fc77cc.url = (options?: RouteQueryOptions) => {
    return nda4fc3351bfc10f4baee67d9e253fc77cc.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda4fc3351bfc10f4baee67d9e253fc77cc.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda4fc3351bfc10f4baee67d9e253fc77cc.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
const nda4fc3351bfc10f4baee67d9e253fc77ccForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda4fc3351bfc10f4baee67d9e253fc77ccForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/legal/nda'
*/
nda4fc3351bfc10f4baee67d9e253fc77ccForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: nda4fc3351bfc10f4baee67d9e253fc77cc.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

nda4fc3351bfc10f4baee67d9e253fc77cc.form = nda4fc3351bfc10f4baee67d9e253fc77ccForm
/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
const ndaedc555a7e5f17eb02c2257f689c19b17 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
})

ndaedc555a7e5f17eb02c2257f689c19b17.definition = {
    methods: ["get","head"],
    url: '/sales/nda',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
ndaedc555a7e5f17eb02c2257f689c19b17.url = (options?: RouteQueryOptions) => {
    return ndaedc555a7e5f17eb02c2257f689c19b17.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
ndaedc555a7e5f17eb02c2257f689c19b17.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
ndaedc555a7e5f17eb02c2257f689c19b17.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
const ndaedc555a7e5f17eb02c2257f689c19b17Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
ndaedc555a7e5f17eb02c2257f689c19b17Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::nda
* @see app/Http/Controllers/LegalController.php:39
* @route '/sales/nda'
*/
ndaedc555a7e5f17eb02c2257f689c19b17Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: ndaedc555a7e5f17eb02c2257f689c19b17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

ndaedc555a7e5f17eb02c2257f689c19b17.form = ndaedc555a7e5f17eb02c2257f689c19b17Form

export const nda = {
    '/legal/nda': nda4fc3351bfc10f4baee67d9e253fc77cc,
    '/sales/nda': ndaedc555a7e5f17eb02c2257f689c19b17,
}

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
const downloadNda2cd58995c13bc892d9586d6c21487905 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
})

downloadNda2cd58995c13bc892d9586d6c21487905.definition = {
    methods: ["get","head"],
    url: '/legal/nda/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadNda2cd58995c13bc892d9586d6c21487905.url = (options?: RouteQueryOptions) => {
    return downloadNda2cd58995c13bc892d9586d6c21487905.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadNda2cd58995c13bc892d9586d6c21487905.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadNda2cd58995c13bc892d9586d6c21487905.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
const downloadNda2cd58995c13bc892d9586d6c21487905Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadNda2cd58995c13bc892d9586d6c21487905Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/legal/nda/download'
*/
downloadNda2cd58995c13bc892d9586d6c21487905Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadNda2cd58995c13bc892d9586d6c21487905.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadNda2cd58995c13bc892d9586d6c21487905.form = downloadNda2cd58995c13bc892d9586d6c21487905Form
/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
const downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
})

downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.definition = {
    methods: ["get","head"],
    url: '/sales/nda/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url = (options?: RouteQueryOptions) => {
    return downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
const downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadNda
* @see app/Http/Controllers/LegalController.php:49
* @route '/sales/nda/download'
*/
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.form = downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form

export const downloadNda = {
    '/legal/nda/download': downloadNda2cd58995c13bc892d9586d6c21487905,
    '/sales/nda/download': downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6,
}

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
const mediationf6018cbc465f1cf5c90089fce428357e = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mediationf6018cbc465f1cf5c90089fce428357e.url(options),
    method: 'get',
})

mediationf6018cbc465f1cf5c90089fce428357e.definition = {
    methods: ["get","head"],
    url: '/legal/mediation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
mediationf6018cbc465f1cf5c90089fce428357e.url = (options?: RouteQueryOptions) => {
    return mediationf6018cbc465f1cf5c90089fce428357e.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
mediationf6018cbc465f1cf5c90089fce428357e.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mediationf6018cbc465f1cf5c90089fce428357e.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
mediationf6018cbc465f1cf5c90089fce428357e.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mediationf6018cbc465f1cf5c90089fce428357e.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
const mediationf6018cbc465f1cf5c90089fce428357eForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediationf6018cbc465f1cf5c90089fce428357e.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
mediationf6018cbc465f1cf5c90089fce428357eForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediationf6018cbc465f1cf5c90089fce428357e.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/mediation'
*/
mediationf6018cbc465f1cf5c90089fce428357eForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediationf6018cbc465f1cf5c90089fce428357e.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mediationf6018cbc465f1cf5c90089fce428357e.form = mediationf6018cbc465f1cf5c90089fce428357eForm
/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
const mediation3997171bda301017be8473cf20aee8bd = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mediation3997171bda301017be8473cf20aee8bd.url(options),
    method: 'get',
})

mediation3997171bda301017be8473cf20aee8bd.definition = {
    methods: ["get","head"],
    url: '/legal/smlouva-o-zprostredkovani',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
mediation3997171bda301017be8473cf20aee8bd.url = (options?: RouteQueryOptions) => {
    return mediation3997171bda301017be8473cf20aee8bd.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
mediation3997171bda301017be8473cf20aee8bd.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mediation3997171bda301017be8473cf20aee8bd.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
mediation3997171bda301017be8473cf20aee8bd.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mediation3997171bda301017be8473cf20aee8bd.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
const mediation3997171bda301017be8473cf20aee8bdForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediation3997171bda301017be8473cf20aee8bd.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
mediation3997171bda301017be8473cf20aee8bdForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediation3997171bda301017be8473cf20aee8bd.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/legal/smlouva-o-zprostredkovani'
*/
mediation3997171bda301017be8473cf20aee8bdForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediation3997171bda301017be8473cf20aee8bd.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mediation3997171bda301017be8473cf20aee8bd.form = mediation3997171bda301017be8473cf20aee8bdForm
/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
const mediation588a70ecaf7627f41964daea2969e7fe = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mediation588a70ecaf7627f41964daea2969e7fe.url(options),
    method: 'get',
})

mediation588a70ecaf7627f41964daea2969e7fe.definition = {
    methods: ["get","head"],
    url: '/sales/mediation',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
mediation588a70ecaf7627f41964daea2969e7fe.url = (options?: RouteQueryOptions) => {
    return mediation588a70ecaf7627f41964daea2969e7fe.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
mediation588a70ecaf7627f41964daea2969e7fe.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: mediation588a70ecaf7627f41964daea2969e7fe.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
mediation588a70ecaf7627f41964daea2969e7fe.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: mediation588a70ecaf7627f41964daea2969e7fe.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
const mediation588a70ecaf7627f41964daea2969e7feForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediation588a70ecaf7627f41964daea2969e7fe.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
mediation588a70ecaf7627f41964daea2969e7feForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediation588a70ecaf7627f41964daea2969e7fe.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::mediation
* @see app/Http/Controllers/LegalController.php:80
* @route '/sales/mediation'
*/
mediation588a70ecaf7627f41964daea2969e7feForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: mediation588a70ecaf7627f41964daea2969e7fe.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

mediation588a70ecaf7627f41964daea2969e7fe.form = mediation588a70ecaf7627f41964daea2969e7feForm

export const mediation = {
    '/legal/mediation': mediationf6018cbc465f1cf5c90089fce428357e,
    '/legal/smlouva-o-zprostredkovani': mediation3997171bda301017be8473cf20aee8bd,
    '/sales/mediation': mediation588a70ecaf7627f41964daea2969e7fe,
}

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
const downloadMediation27017fd45daa5f4f866b02e6b41b5594 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadMediation27017fd45daa5f4f866b02e6b41b5594.url(options),
    method: 'get',
})

downloadMediation27017fd45daa5f4f866b02e6b41b5594.definition = {
    methods: ["get","head"],
    url: '/legal/mediation/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
downloadMediation27017fd45daa5f4f866b02e6b41b5594.url = (options?: RouteQueryOptions) => {
    return downloadMediation27017fd45daa5f4f866b02e6b41b5594.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
downloadMediation27017fd45daa5f4f866b02e6b41b5594.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadMediation27017fd45daa5f4f866b02e6b41b5594.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
downloadMediation27017fd45daa5f4f866b02e6b41b5594.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadMediation27017fd45daa5f4f866b02e6b41b5594.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
const downloadMediation27017fd45daa5f4f866b02e6b41b5594Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadMediation27017fd45daa5f4f866b02e6b41b5594.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
downloadMediation27017fd45daa5f4f866b02e6b41b5594Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadMediation27017fd45daa5f4f866b02e6b41b5594.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/legal/mediation/download'
*/
downloadMediation27017fd45daa5f4f866b02e6b41b5594Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadMediation27017fd45daa5f4f866b02e6b41b5594.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadMediation27017fd45daa5f4f866b02e6b41b5594.form = downloadMediation27017fd45daa5f4f866b02e6b41b5594Form
/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
const downloadMediation1757566698d825dc8dd577dec68793e7 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadMediation1757566698d825dc8dd577dec68793e7.url(options),
    method: 'get',
})

downloadMediation1757566698d825dc8dd577dec68793e7.definition = {
    methods: ["get","head"],
    url: '/sales/mediation/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
downloadMediation1757566698d825dc8dd577dec68793e7.url = (options?: RouteQueryOptions) => {
    return downloadMediation1757566698d825dc8dd577dec68793e7.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
downloadMediation1757566698d825dc8dd577dec68793e7.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: downloadMediation1757566698d825dc8dd577dec68793e7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
downloadMediation1757566698d825dc8dd577dec68793e7.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: downloadMediation1757566698d825dc8dd577dec68793e7.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
const downloadMediation1757566698d825dc8dd577dec68793e7Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadMediation1757566698d825dc8dd577dec68793e7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
downloadMediation1757566698d825dc8dd577dec68793e7Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadMediation1757566698d825dc8dd577dec68793e7.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\LegalController::downloadMediation
* @see app/Http/Controllers/LegalController.php:90
* @route '/sales/mediation/download'
*/
downloadMediation1757566698d825dc8dd577dec68793e7Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: downloadMediation1757566698d825dc8dd577dec68793e7.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

downloadMediation1757566698d825dc8dd577dec68793e7.form = downloadMediation1757566698d825dc8dd577dec68793e7Form

export const downloadMediation = {
    '/legal/mediation/download': downloadMediation27017fd45daa5f4f866b02e6b41b5594,
    '/sales/mediation/download': downloadMediation1757566698d825dc8dd577dec68793e7,
}

const LegalController = { tos, pp, nda, downloadNda, mediation, downloadMediation }

export default LegalController