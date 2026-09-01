import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/contact',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\ContactController::index
 * @see app/Http/Controllers/ContactController.php:24
 * @route '/contact'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index.form = indexForm;

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/contact'
 */
const store36402f3b102b68b92616e946647e00cf = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store36402f3b102b68b92616e946647e00cf.url(options),
    method: 'post',
});

store36402f3b102b68b92616e946647e00cf.definition = {
    methods: ['post'],
    url: '/contact',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/contact'
 */
store36402f3b102b68b92616e946647e00cf.url = (options?: RouteQueryOptions) => {
    return (
        store36402f3b102b68b92616e946647e00cf.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/contact'
 */
store36402f3b102b68b92616e946647e00cf.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store36402f3b102b68b92616e946647e00cf.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/contact'
 */
const store36402f3b102b68b92616e946647e00cfForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store36402f3b102b68b92616e946647e00cf.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/contact'
 */
store36402f3b102b68b92616e946647e00cfForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store36402f3b102b68b92616e946647e00cf.url(options),
    method: 'post',
});

store36402f3b102b68b92616e946647e00cf.form =
    store36402f3b102b68b92616e946647e00cfForm;
/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
const store33b413cc12b7e3b28f5a57216b04763f = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store33b413cc12b7e3b28f5a57216b04763f.url(options),
    method: 'post',
});

store33b413cc12b7e3b28f5a57216b04763f.definition = {
    methods: ['post'],
    url: '/api/contact',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
store33b413cc12b7e3b28f5a57216b04763f.url = (options?: RouteQueryOptions) => {
    return (
        store33b413cc12b7e3b28f5a57216b04763f.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
store33b413cc12b7e3b28f5a57216b04763f.post = (
    options?: RouteQueryOptions,
): RouteDefinition<'post'> => ({
    url: store33b413cc12b7e3b28f5a57216b04763f.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
const store33b413cc12b7e3b28f5a57216b04763fForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store33b413cc12b7e3b28f5a57216b04763f.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\ContactController::store
 * @see app/Http/Controllers/ContactController.php:31
 * @route '/api/contact'
 */
store33b413cc12b7e3b28f5a57216b04763fForm.post = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: store33b413cc12b7e3b28f5a57216b04763f.url(options),
    method: 'post',
});

store33b413cc12b7e3b28f5a57216b04763f.form =
    store33b413cc12b7e3b28f5a57216b04763fForm;

export const store = {
    '/contact': store36402f3b102b68b92616e946647e00cf,
    '/api/contact': store33b413cc12b7e3b28f5a57216b04763f,
};

const ContactController = { index, store };

export default ContactController;
