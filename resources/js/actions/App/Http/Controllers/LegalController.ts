import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\LegalController::tos
 * @see app/Http/Controllers/LegalController.php:25
 * @route '/legal/terms-and-conditions'
 */
export const tos = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tos.url(options),
    method: 'get',
});

tos.definition = {
    methods: ['get', 'head'],
    url: '/legal/terms-and-conditions',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LegalController::tos
 * @see app/Http/Controllers/LegalController.php:25
 * @route '/legal/terms-and-conditions'
 */
tos.url = (options?: RouteQueryOptions) => {
    return tos.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\LegalController::tos
 * @see app/Http/Controllers/LegalController.php:25
 * @route '/legal/terms-and-conditions'
 */
tos.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tos.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::tos
 * @see app/Http/Controllers/LegalController.php:25
 * @route '/legal/terms-and-conditions'
 */
tos.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tos.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LegalController::tos
 * @see app/Http/Controllers/LegalController.php:25
 * @route '/legal/terms-and-conditions'
 */
const tosForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tos.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::tos
 * @see app/Http/Controllers/LegalController.php:25
 * @route '/legal/terms-and-conditions'
 */
tosForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tos.url(options),
    method: 'get',
});

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
        },
    }),
    method: 'get',
});

tos.form = tosForm;

/**
 * @see \App\Http\Controllers\LegalController::pp
 * @see app/Http/Controllers/LegalController.php:32
 * @route '/legal/privacy-policy'
 */
export const pp = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pp.url(options),
    method: 'get',
});

pp.definition = {
    methods: ['get', 'head'],
    url: '/legal/privacy-policy',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LegalController::pp
 * @see app/Http/Controllers/LegalController.php:32
 * @route '/legal/privacy-policy'
 */
pp.url = (options?: RouteQueryOptions) => {
    return pp.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\LegalController::pp
 * @see app/Http/Controllers/LegalController.php:32
 * @route '/legal/privacy-policy'
 */
pp.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: pp.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::pp
 * @see app/Http/Controllers/LegalController.php:32
 * @route '/legal/privacy-policy'
 */
pp.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: pp.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LegalController::pp
 * @see app/Http/Controllers/LegalController.php:32
 * @route '/legal/privacy-policy'
 */
const ppForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pp.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::pp
 * @see app/Http/Controllers/LegalController.php:32
 * @route '/legal/privacy-policy'
 */
ppForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: pp.url(options),
    method: 'get',
});

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
        },
    }),
    method: 'get',
});

pp.form = ppForm;

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
const nda4fc3351bfc10f4baee67d9e253fc77cc = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
});

nda4fc3351bfc10f4baee67d9e253fc77cc.definition = {
    methods: ['get', 'head'],
    url: '/legal/nda',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
nda4fc3351bfc10f4baee67d9e253fc77cc.url = (options?: RouteQueryOptions) => {
    return (
        nda4fc3351bfc10f4baee67d9e253fc77cc.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
nda4fc3351bfc10f4baee67d9e253fc77cc.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
nda4fc3351bfc10f4baee67d9e253fc77cc.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
const nda4fc3351bfc10f4baee67d9e253fc77ccForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
nda4fc3351bfc10f4baee67d9e253fc77ccForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: nda4fc3351bfc10f4baee67d9e253fc77cc.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/legal/nda'
 */
nda4fc3351bfc10f4baee67d9e253fc77ccForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: nda4fc3351bfc10f4baee67d9e253fc77cc.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

nda4fc3351bfc10f4baee67d9e253fc77cc.form =
    nda4fc3351bfc10f4baee67d9e253fc77ccForm;
/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
const ndaedc555a7e5f17eb02c2257f689c19b17 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
});

ndaedc555a7e5f17eb02c2257f689c19b17.definition = {
    methods: ['get', 'head'],
    url: '/sales/nda',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
ndaedc555a7e5f17eb02c2257f689c19b17.url = (options?: RouteQueryOptions) => {
    return (
        ndaedc555a7e5f17eb02c2257f689c19b17.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
ndaedc555a7e5f17eb02c2257f689c19b17.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
ndaedc555a7e5f17eb02c2257f689c19b17.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
const ndaedc555a7e5f17eb02c2257f689c19b17Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
ndaedc555a7e5f17eb02c2257f689c19b17Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: ndaedc555a7e5f17eb02c2257f689c19b17.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::nda
 * @see app/Http/Controllers/LegalController.php:39
 * @route '/sales/nda'
 */
ndaedc555a7e5f17eb02c2257f689c19b17Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: ndaedc555a7e5f17eb02c2257f689c19b17.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

ndaedc555a7e5f17eb02c2257f689c19b17.form =
    ndaedc555a7e5f17eb02c2257f689c19b17Form;

export const nda = {
    '/legal/nda': nda4fc3351bfc10f4baee67d9e253fc77cc,
    '/sales/nda': ndaedc555a7e5f17eb02c2257f689c19b17,
};

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
const downloadNda2cd58995c13bc892d9586d6c21487905 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
});

downloadNda2cd58995c13bc892d9586d6c21487905.definition = {
    methods: ['get', 'head'],
    url: '/legal/nda/download',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
downloadNda2cd58995c13bc892d9586d6c21487905.url = (
    options?: RouteQueryOptions,
) => {
    return (
        downloadNda2cd58995c13bc892d9586d6c21487905.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
downloadNda2cd58995c13bc892d9586d6c21487905.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
downloadNda2cd58995c13bc892d9586d6c21487905.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
const downloadNda2cd58995c13bc892d9586d6c21487905Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
downloadNda2cd58995c13bc892d9586d6c21487905Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadNda2cd58995c13bc892d9586d6c21487905.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/legal/nda/download'
 */
downloadNda2cd58995c13bc892d9586d6c21487905Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadNda2cd58995c13bc892d9586d6c21487905.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadNda2cd58995c13bc892d9586d6c21487905.form =
    downloadNda2cd58995c13bc892d9586d6c21487905Form;
/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
const downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
});

downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.definition = {
    methods: ['get', 'head'],
    url: '/sales/nda/download',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url = (
    options?: RouteQueryOptions,
) => {
    return (
        downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
const downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\LegalController::downloadNda
 * @see app/Http/Controllers/LegalController.php:49
 * @route '/sales/nda/download'
 */
downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6.form =
    downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6Form;

export const downloadNda = {
    '/legal/nda/download': downloadNda2cd58995c13bc892d9586d6c21487905,
    '/sales/nda/download': downloadNdaf1cb137263b24b1c3fda5e949fd3e0d6,
};

const LegalController = { tos, pp, nda, downloadNda };

export default LegalController;
