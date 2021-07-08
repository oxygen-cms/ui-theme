<?php

use Illuminate\Contracts\Auth\Guard;
use Oxygen\Auth\Preferences\UserLoader;
use Oxygen\Auth\Repository\UserRepositoryInterface;
use Oxygen\Preferences\Schema;

Preferences::register('user.general', function(Schema $schema) {
    $schema->setTitle('General');
    $schema->setLoader(function() {
        return new UserLoader(app(UserRepositoryInterface::class), app(Guard::class), null);
    });

    $schema->makeFields([
        [
            'name'          => 'fontSize',
            'label'         => 'Font Size',
            'type'          => 'select',
            'options'       => [
                '62.5%'         => '10',
                '75%'           => '12',
                '87.5%'         => '14 (default)',
                '100%'          => '16',
                '112.5%'        => '18',
                '125%'          => '20',
                '150%'          => '24',
                '200%'          => '32'
            ]
        ]
    ]);
});
