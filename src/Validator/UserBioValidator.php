<?php

/*
 * This file is part of dgc/user-students.
 *
 * Copyright (c) Corlette GTM.
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

namespace DGC\UserStudents\Validator;

use Flarum\Foundation\AbstractValidator;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Validation\Factory;
use Symfony\Contracts\Translation\TranslatorInterface;

class UserBioValidator extends AbstractValidator
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $settings;

    public function __construct(Factory $validator, TranslatorInterface $translator, SettingsRepositoryInterface $settings)
    {
        parent::__construct($validator, $translator);

        $this->settings = $settings;
    }

    /**
     * @return array
     */
    protected function getRules()
    {
        return [
            'bio' => [
                'string',
                'max:'.$this->settings->get('dgc-user-students.maxLength'),
            ],
        ];
    }
}
