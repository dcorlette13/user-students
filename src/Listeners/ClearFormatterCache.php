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

use Flarum\Settings\Event\Saved;

class ClearFormatterCache
{
    public function handle(Saved $event)
    {
        foreach ($event->settings as $key => $setting) {
            if ($key === 'dgc-user-students.allowFormatting') {
                resolve('dgc-user-students.formatter')->flush();

                return;
            }
        }
    }
}
