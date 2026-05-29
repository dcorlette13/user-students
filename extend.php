<?php

/*
 * This file is part of dgc/user-students.
 *
 * Copyright (c) Corlette GTM.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace DGC\UserStudents;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend as Flarum;
use Flarum\Gdpr\Extend\UserData;
use Flarum\Settings\Event\Saved;
use Flarum\User\Event\Saving;
use Flarum\User\User;

return [
    (new Flarum\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/resources/less/forum.less'),

    (new Flarum\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Flarum\Locales(__DIR__.'/resources/locale'),

    (new Flarum\Model(User::class))
        ->cast('bio', 'string'),

    (new Flarum\Event())
        ->listen(Saving::class, Listeners\SaveUserBio::class)
        ->listen(Saved::class, Listeners\ClearFormatterCache::class),

    (new Flarum\ApiSerializer(UserSerializer::class))
        ->attributes(Listeners\AddUserBioAttribute::class),

    (new Flarum\Policy())
        ->modelPolicy(User::class, Access\UserPolicy::class),

    (new Flarum\Settings())
        ->serializeToForum('dgc-user-students.maxLength', 'dgc-user-students.maxLength', 'intVal')
        ->serializeToForum('dgc-user-students.maxLines', 'dgc-user-students.maxLines', 'intVal')
        ->default('dgc-user-students.maxLength', 200),

    (new Flarum\ServiceProvider())
        ->register(Formatter\FormatterServiceProvider::class),

    (new Flarum\Conditional())
        ->whenExtensionEnabled('flarum-gdpr', fn () => [
            (new UserData())
                ->addType(Data\UserBioData::class),
        ]),
];
