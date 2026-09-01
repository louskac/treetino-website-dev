import {
    queryParams,
    type RouteQueryOptions,
    type RouteDefinition,
    type RouteFormDefinition,
    applyUrlDefaults,
} from './../../../../../wayfinder';
/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

index.definition = {
    methods: ['get', 'head'],
    url: '/admin/translations',
} satisfies RouteDefinition<['get', 'head']>;

/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
 */
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
 */
const indexForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::index
 * @see app/Http/Controllers/Admin/TranslationController.php:17
 * @route '/admin/translations'
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
 * @see \App\Http\Controllers\Admin\TranslationController::sync
 * @see app/Http/Controllers/Admin/TranslationController.php:52
 * @route '/admin/translations/sync'
 */
export const sync = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
});

sync.definition = {
    methods: ['post'],
    url: '/admin/translations/sync',
} satisfies RouteDefinition<['post']>;

/**
 * @see \App\Http\Controllers\Admin\TranslationController::sync
 * @see app/Http/Controllers/Admin/TranslationController.php:52
 * @route '/admin/translations/sync'
 */
sync.url = (options?: RouteQueryOptions) => {
    return sync.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\Admin\TranslationController::sync
 * @see app/Http/Controllers/Admin/TranslationController.php:52
 * @route '/admin/translations/sync'
 */
sync.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: sync.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::sync
 * @see app/Http/Controllers/Admin/TranslationController.php:52
 * @route '/admin/translations/sync'
 */
const syncForm = (
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::sync
 * @see app/Http/Controllers/Admin/TranslationController.php:52
 * @route '/admin/translations/sync'
 */
syncForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: sync.url(options),
    method: 'post',
});

sync.form = syncForm;

/**
 * @see \App\Http\Controllers\Admin\TranslationController::update
 * @see app/Http/Controllers/Admin/TranslationController.php:61
 * @route '/admin/translations/{translationKey}'
 */
export const update = (
    args:
        | { translationKey: number | { id: number } }
        | [translationKey: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

update.definition = {
    methods: ['put'],
    url: '/admin/translations/{translationKey}',
} satisfies RouteDefinition<['put']>;

/**
 * @see \App\Http\Controllers\Admin\TranslationController::update
 * @see app/Http/Controllers/Admin/TranslationController.php:61
 * @route '/admin/translations/{translationKey}'
 */
update.url = (
    args:
        | { translationKey: number | { id: number } }
        | [translationKey: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { translationKey: args };
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { translationKey: args.id };
    }

    if (Array.isArray(args)) {
        args = {
            translationKey: args[0],
        };
    }

    args = applyUrlDefaults(args);

    const parsedArgs = {
        translationKey:
            typeof args.translationKey === 'object'
                ? args.translationKey.id
                : args.translationKey,
    };

    return (
        update.definition.url
            .replace('{translationKey}', parsedArgs.translationKey.toString())
            .replace(/\/+$/, '') + queryParams(options)
    );
};

/**
 * @see \App\Http\Controllers\Admin\TranslationController::update
 * @see app/Http/Controllers/Admin/TranslationController.php:61
 * @route '/admin/translations/{translationKey}'
 */
update.put = (
    args:
        | { translationKey: number | { id: number } }
        | [translationKey: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteDefinition<'put'> => ({
    url: update.url(args, options),
    method: 'put',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::update
 * @see app/Http/Controllers/Admin/TranslationController.php:61
 * @route '/admin/translations/{translationKey}'
 */
const updateForm = (
    args:
        | { translationKey: number | { id: number } }
        | [translationKey: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

/**
 * @see \App\Http\Controllers\Admin\TranslationController::update
 * @see app/Http/Controllers/Admin/TranslationController.php:61
 * @route '/admin/translations/{translationKey}'
 */
updateForm.put = (
    args:
        | { translationKey: number | { id: number } }
        | [translationKey: number | { id: number }]
        | number
        | { id: number },
    options?: RouteQueryOptions,
): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        },
    }),
    method: 'post',
});

update.form = updateForm;

const TranslationController = { index, sync, update };

export default TranslationController;
