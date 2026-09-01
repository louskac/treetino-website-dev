import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
} from './../../../../wayfinder';
/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
const index355c8433c4cb5a1bf0560a37a6ea7af5 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: index355c8433c4cb5a1bf0560a37a6ea7af5.url(options),
    method: 'get',
});

index355c8433c4cb5a1bf0560a37a6ea7af5.definition = {
    methods: ['get', 'head'],
    url: '/sales',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
index355c8433c4cb5a1bf0560a37a6ea7af5.url = (options?: RouteQueryOptions) => {
    return (
        index355c8433c4cb5a1bf0560a37a6ea7af5.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
index355c8433c4cb5a1bf0560a37a6ea7af5.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: index355c8433c4cb5a1bf0560a37a6ea7af5.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
index355c8433c4cb5a1bf0560a37a6ea7af5.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: index355c8433c4cb5a1bf0560a37a6ea7af5.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
const index355c8433c4cb5a1bf0560a37a6ea7af5Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index355c8433c4cb5a1bf0560a37a6ea7af5.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
index355c8433c4cb5a1bf0560a37a6ea7af5Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index355c8433c4cb5a1bf0560a37a6ea7af5.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/sales'
 */
index355c8433c4cb5a1bf0560a37a6ea7af5Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index355c8433c4cb5a1bf0560a37a6ea7af5.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index355c8433c4cb5a1bf0560a37a6ea7af5.form =
    index355c8433c4cb5a1bf0560a37a6ea7af5Form;
/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
const index7c11fb32ed7f77905765045cf75128ff = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: index7c11fb32ed7f77905765045cf75128ff.url(options),
    method: 'get',
});

index7c11fb32ed7f77905765045cf75128ff.definition = {
    methods: ['get', 'head'],
    url: '/crm',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
index7c11fb32ed7f77905765045cf75128ff.url = (options?: RouteQueryOptions) => {
    return (
        index7c11fb32ed7f77905765045cf75128ff.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
index7c11fb32ed7f77905765045cf75128ff.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: index7c11fb32ed7f77905765045cf75128ff.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
index7c11fb32ed7f77905765045cf75128ff.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: index7c11fb32ed7f77905765045cf75128ff.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
const index7c11fb32ed7f77905765045cf75128ffForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index7c11fb32ed7f77905765045cf75128ff.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
index7c11fb32ed7f77905765045cf75128ffForm.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index7c11fb32ed7f77905765045cf75128ff.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/crm'
 */
index7c11fb32ed7f77905765045cf75128ffForm.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index7c11fb32ed7f77905765045cf75128ff.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

index7c11fb32ed7f77905765045cf75128ff.form =
    index7c11fb32ed7f77905765045cf75128ffForm;
/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
const indexb4090fa2e00fa06dbc9e2d8379a27221 = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: indexb4090fa2e00fa06dbc9e2d8379a27221.url(options),
    method: 'get',
});

indexb4090fa2e00fa06dbc9e2d8379a27221.definition = {
    methods: ['get', 'head'],
    url: '/cmr',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
indexb4090fa2e00fa06dbc9e2d8379a27221.url = (options?: RouteQueryOptions) => {
    return (
        indexb4090fa2e00fa06dbc9e2d8379a27221.definition.url +
        queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
indexb4090fa2e00fa06dbc9e2d8379a27221.get = (
    options?: RouteQueryOptions,
): RouteDefinition<'get'> => ({
    url: indexb4090fa2e00fa06dbc9e2d8379a27221.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
indexb4090fa2e00fa06dbc9e2d8379a27221.head = (
    options?: RouteQueryOptions,
): RouteDefinition<'head'> => ({
    url: indexb4090fa2e00fa06dbc9e2d8379a27221.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
const indexb4090fa2e00fa06dbc9e2d8379a27221Form = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: indexb4090fa2e00fa06dbc9e2d8379a27221.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
indexb4090fa2e00fa06dbc9e2d8379a27221Form.get = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: indexb4090fa2e00fa06dbc9e2d8379a27221.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\SalesController::index
 * @see app/Http/Controllers/SalesController.php:13
 * @route '/cmr'
 */
indexb4090fa2e00fa06dbc9e2d8379a27221Form.head = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: indexb4090fa2e00fa06dbc9e2d8379a27221.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'get',
});

indexb4090fa2e00fa06dbc9e2d8379a27221.form =
    indexb4090fa2e00fa06dbc9e2d8379a27221Form;

export const index = {
    '/sales': index355c8433c4cb5a1bf0560a37a6ea7af5,
    '/crm': index7c11fb32ed7f77905765045cf75128ff,
    '/cmr': indexb4090fa2e00fa06dbc9e2d8379a27221,
};

const SalesController = { index };

export default SalesController;
