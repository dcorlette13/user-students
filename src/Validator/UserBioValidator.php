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

class UserBioValidator extends AbstractValidator
{
    /**
     * @return array
     */
    protected function getRules()
    {
        return [
            'bio' => [
                'nullable',
                'string',
                'regex:/^(\d{4}(,\d{4})*)?$/',
            ],
        ];
    }
}
