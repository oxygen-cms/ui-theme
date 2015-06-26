<?php

namespace Oxygen\UiTheme;

use Illuminate\Support\ServiceProvider;
use Oxygen\Preferences\PreferencesManager;

class UiThemeServiceProvider extends ServiceProvider {

	/**
	 * Indicates if loading of the provider is deferred.
	 *
	 * @var bool
	 */
	protected $defer = false;

	/**
	 * Bootstrap the application events.
	 *
	 * @return void
	 */
	public function boot() {
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'oxygen/ui-theme');
        $this->publishes([
            __DIR__.'/../resources/views' => base_path('resources/views/vendor/oxygen/ui-theme')
        ]);
        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/oxygen/ui-theme'),
        ], 'public');

        $this->app[PreferencesManager::class]->loadDirectory(__DIR__ . '/../resources/preferences', [
            'user.general', 'user.editor', 'user.pageLoad'
        ]);

        $this->addClassesToLayout();
        $this->addStylesheetsToLayout();
		$this->addScriptsToLayout();
        $this->addNavigationTransitions();
	}

    /**
     * Adds Stylesheets references.
     *
     * @return void
     */

    protected function addClassesToLayout() {
        $this->app['events']->listen('oxygen.layout.classes', function(&$htmlClasses, &$bodyClasses, &$pageClasses) {
            $htmlClasses[] = 'no-js';
            $htmlClasses[] = 'no-flexbox';
            $pageClasses[] = 'Page';
        });

        $this->app['events']->listen('oxygen.layout.attributes', function(&$htmlAttributes, &$bodyAttributes, &$pageAttributes) {
            if($this->app['auth']->check() && $this->app['auth']->user()->getPreferences()->get('fontSize') !== '87.5%') {
                $htmlAttributes['style'] = 'font-size: ' . $this->app['auth']->user()->getPreferences()->get('fontSize') . ';';
            }

            $pageAttributes['id'] = 'page';
        });
    }

    /**
     * Adds Stylesheets references.
     *
     * @return void
     */

    protected function addStylesheetsToLayout() {
        $this->app['events']->listen('oxygen.layout.head', function() {
            echo $this->app['view']->make('oxygen/ui-theme::head')->render();
        });
    }

	/**
     * Adds Javascript references.
     *
     * @return void
     */

    protected function addScriptsToLayout() {
        $this->app['events']->listen('oxygen.layout.body.after', function() {
            echo $this->app['view']->make('oxygen/ui-theme::body')->render();
        });

        $this->app['events']->listen('oxygen.layout.body.after', function() {
            echo $this->app['view']->make('oxygen/ui-theme::bodyLast')->render();
        }, -1);
    }

    /**
     * Adds navigation transitions to the view.
     */
    public function addNavigationTransitions() {
    }

	/**
	 * Register the service provider.
	 *
	 * @return void
	 */
	public function register() {
		//
	}

	/**
	 * Get the services provided by the provider.
	 *
	 * @return array
	 */
	public function provides() {
		return [];
	}

}
