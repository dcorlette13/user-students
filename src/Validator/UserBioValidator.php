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
     * Valid school names.
     */
    const VALID_SCHOOLS = [
        'DCB',
        'LAMB',
        'Mundo Verde',
        'Stokes',
        'Yu Ying',
        'a non-member school',
    ];

    /**
     * @return array
     */
    protected function getRules()
    {
        $schoolList = implode('|', array_map('preg_quote', self::VALID_SCHOOLS));

        return [
            'bio' => [
                'nullable',
                'string',
                // Allows:
                // - empty string
                // - comma-separated 4-digit years only
                // - years optionally followed by | and a valid school name
                'regex:/^(\d{4}(,\d{4})*)?(\|(' . $schoolList . '))?$/',
            ],
        ];
    }
}
