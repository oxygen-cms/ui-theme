<?php

use Oxygen\Auth\Preferences\UserLoader;

Preferences::register('user.general', function($schema) {
    $schema->setTitle('General');
    $schema->setLoader(function() {
        return new UserLoader(App::make('Oxygen\Auth\Repository\UserRepositoryInterface'), Auth::user());
    });

    $schema->makeFields([
        '' => [
            'Appearance' => [
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
            ]
        ]
    ]);
});