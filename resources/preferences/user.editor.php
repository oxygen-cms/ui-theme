<?php

use Oxygen\Auth\Preferences\UserLoader;

Preferences::register('user.editor', function($schema) {
    $schema->setTitle('Editor');
    $schema->setLoader(function() {
        return new UserLoader(App::make('Oxygen\Auth\Repository\UserRepositoryInterface'), Auth::user());
    });

    $schema->makeFields([
        '' => [
            'General' => [
                [
                    'name'          => 'editor.defaultMode',
                    'label'         => 'Default Mode',
                    'type'          => 'select',
                    'options'       => [
                        'design'        => 'Design',
                        'code'          => 'Code',
                        'split'         => 'Split',
                        'preview'       => 'Preview'
                    ]
                ]
            ],
            'Appearance' => [
                [
                    'name'          => 'editor.theme',
                    'label'         => 'Theme',
                    'type'          => 'select',
                    'options'       => [
                        'dark'          => 'Dark',
                        'light'         => 'Light'
                    ]
                ]
            ],
            'Code View' => [
                [
                    'name'          => 'editor.ace.theme',
                    'label'         => 'Color Scheme',
                    'type'          => 'select',
                    'options'       => [
                        'Dark' => [
                            'ace/theme/ambiance'                => 'Ambiance',
                            'ace/theme/chaos'                   => 'Chaos',
                            'ace/theme/clouds_midnight'         => 'Clouds Midnight',
                            'ace/theme/cobalt'                  => 'Cobalt',
                            'ace/theme/idle_fingers'            => 'Idle Fingers',
                            'ace/theme/merbivore'               => 'Merbivore',
                            'ace/theme/merbivore_soft'          => 'Merbivore Soft',
                            'ace/theme/mono_industrial'         => 'Mono Industrial',
                            'ace/theme/monokai'                 => 'Monokai',
                            'ace/theme/pastel_on_dark'          => 'Pastel on Dark',
                            'ace/theme/solarized_dark'          => 'Solarized Dark',
                            'ace/theme/terminal'                => 'Terminal',
                            'ace/theme/tomorrow_night'          => 'Tomorrow Night',
                            'ace/theme/tomorrow_night_blue'     => 'Tomorrow Night Blue',
                            'ace/theme/tomorrow_night_bright'   => 'Tomorrow Night Bright',
                            'ace/theme/tomorrow_night_eighties' => 'Tomorrow Night Eighties',
                            'ace/theme/twilight'                => 'Twilight',
                            'ace/theme/vibrant_ink'             => 'Vibrant Ink'
                        ],
                        'Light' => [
                            'ace/theme/chrome'                  => 'Chrome',
                            'ace/theme/clouds'                  => 'Clouds',
                            'ace/theme/crimson_editor'          => 'Crimson Editor',
                            'ace/theme/dawn'                    => 'Dawn',
                            'ace/theme/dreamweaver'             => 'Dreamweaver',
                            'ace/theme/eclipse'                 => 'Eclipse',
                            'ace/theme/github'                  => 'Github',
                            'ace/theme/kr_theme'                => 'Kr Theme',
                            'ace/theme/solarized_light'         => 'Solarized Light',
                            'ace/theme/textmate'                => 'Textmate',
                            'ace/theme/tomorrow'                => 'Tomorrow',
                            'ace/theme/xcode'                   => 'Xcode'
                        ]
                    ]
                ],
                [
                    'name'          => 'editor.ace.fontSize',
                    'label'         => 'Font Size',
                    'type'          => 'select',
                    'options'       => [
                        '10px' => '10',
                        '11px' => '11',
                        '12px' => '12',
                        '13px' => '13',
                        '14px' => '14',
                        '16px' => '16',
                        '18px' => '18',
                        '20px' => '20',
                        '24px' => '24',
                        '32px' => '32'
                    ]
                ],
                [
                    'name'          => 'editor.ace.wordWrap',
                    'label'         => 'Word Wrap',
                    'type'          => 'toggle',
                    'attributes'    => [
                        'labels' => ['on' => 'Wrap', 'off' => 'Don\'t Wrap']
                    ]
                ],
                [
                    'name'          => 'editor.ace.highlightActiveLine',
                    'label'         => 'Highlight Active Line',
                    'type'          => 'toggle'
                ],
                [
                    'name'          => 'editor.ace.showPrintMargin',
                    'label'         => 'Show Print Margins',
                    'type'          => 'toggle'
                ],
                [
                    'name'          => 'editor.ace.showInvisibles',
                    'label'         => 'Show Invisibles',
                    'type'          => 'toggle'
                ]
            ],
            'Design View' => [
                [
                    'name'          => 'editor.ckeditor.skin',
                    'label'         => 'Theme',
                    'type'          => 'select',
                    'options'       => [
                        'Dark' => [
                            '../../../vendor/ckeditor-skins/moono-dark' => 'Moono Dark',
                        ],
                        'Light' => [
                            '../../../vendor/ckeditor-skins/bootstrapck' => 'BootstrapCK',
                            '../../../vendor/ckeditor-skins/office2013' => 'Office 2013',
                            'moono' => 'Moono'
                        ]
                    ]
                ],
            ]
        ]
    ]);
});