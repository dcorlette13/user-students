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

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\Event\Saving;
use DGC\UserStudents\Event\BioChanged;
use DGC\UserStudents\Formatter\UserBioFormatter;
use DGC\UserStudents\Validator\UserBioValidator;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class SaveUserBio
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    /**
     * @var UserBioFormatter
     */
    protected $formatter;

    /**
     * @var UserBioValidator
     */
    protected $validator;

    public function __construct(SettingsRepositoryInterface $settings, UserBioFormatter $formatter, UserBioValidator $validator)
    {
        $this->settings = $settings;
        $this->formatter = $formatter;
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
        $allowFormatting = $this->settings->get('dgc-user-students.allowFormatting', false);

        if (isset($attributes['bio'])) {
            $actor->assertCan('editBio', $user);

            $this->validator->assertValid(Arr::only($attributes, 'bio'));

            $bio = Str::of($attributes['bio'])->trim();
            $bio = preg_replace('/\R{3,}/u', "\n\n", $bio);

            if ($allowFormatting) {
                $user->bio = $this->formatter->parse($bio);
            } else {
                $user->bio = $bio;
            }

            if ($user->isDirty('bio')) {
                $user->raise(new BioChanged($user));
            }
        }
    }
}
