<?php

/*
 * This file is part of dgc/user-students.
 *
 * Copyright (c) Corlette GTM.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace DGC\UserStudents\Listeners;

use Flarum\User\Event\Saving;
use DGC\UserStudents\Event\BioChanged;
use DGC\UserStudents\Validator\UserBioValidator;
use Illuminate\Support\Arr;

class SaveUserBio
{
    /**
     * @var UserBioValidator
     */
    protected $validator;

    public function __construct(UserBioValidator $validator)
    {
        $this->validator = $validator;
    }

    /**
     * @param Saving $event
     *
     * @throws \Flarum\User\Exception\PermissionDeniedException
     */
    public function handle(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;

        $attributes = Arr::get($data, 'attributes', []);

        if (isset($attributes['bio'])) {
            $actor->assertCan('editBio', $user);

            $this->validator->assertValid(Arr::only($attributes, 'bio'));

            $user->bio = $attributes['bio'];

            if ($user->isDirty('bio')) {
                $user->raise(new BioChanged($user));
            }
        }
    }
}
