<?php

use Oxygen\Auth\Preferences\UserLoader;

Preferences::register('user.pageLoad', function(\Oxygen\Preferences\Schema $schema) {
    $schema->setTitle('Page Load');
    $schema->setLoader(function() {
        return new UserLoader(resolve('Oxygen\Auth\Repository\UserRepositoryInterface'), Auth::user());
    });

    $schema->makeFields([
        '' => [
            'Smooth Loading' => [
                [
                    'name'          => 'pageLoad.smoothState.enabled',
                    'label'         => 'Enabled',
                    'type'          => 'toggle'
                ],
                [
                    'name'          => 'pageLoad.smoothState.theme',
                    'label'         => 'Theme',
                    'type'          => 'select',
                    'options'       => [
                        'slide' => 'Slide',
                        'fade' => 'Fade',
                        'none'    => 'None'
                    ]
                ]
            ],
            'Progress' => [
                [
                    'name'          => 'pageLoad.progress.enabled',
                    'label'         => 'Enabled',
                    'type'          => 'toggle'
                ],
                [
                    'name'          => 'pageLoad.progress.theme',
                    'label'         => 'Theme',
                    'type'          => 'select',
                    'options' => [
                        'minimal' => 'Bar',
                        'spinner' => 'Spinner'
                    ],
                    'attributes' => [
                        'multiple' => true
                    ]
                ]
            ]
        ]
    ]);
});