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

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class AddUserBioAttribute
{
    /**
     * @param UserSerializer $serializer
     * @param User           $user
     * @param array          $attributes
     *
     * @return array
     */
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $actor = $serializer->getActor();

        if ($actor->can('viewBio', $user)) {
            $attributes['bio'] = $user->bio ?? '';
            $attributes['canViewBio'] = true;
            $attributes['canEditBio'] = $actor->can('editBio', $user);
        }

        return $attributes;
    }
}
