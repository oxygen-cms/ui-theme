<?php

namespace Oxygen\Ui;

use Illuminate\Support\ServiceProvider;

class UiServiceProvider extends ServiceProvider {

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
		$this->package('oxygen/ui', 'oxygen/ui', __DIR__ . '/../resources');

        $this->addStylesheetsToLayout();
		$this->addScriptsToLayout();
	}

    /**
     * Adds Stylesheets references.
     *
     * @return void
     */

    protected function addStylesheetsToLayout() {
        $this->app['events']->listen('oxygen.layout.head', function() {
            echo $this->app['view']->make('oxygen/ui::head')->render();
        });
    }

	/**
     * Adds Javascript references.
     *
     * @return void
     */

    protected function addScriptsToLayout() {
        $this->app['events']->listen('oxygen.layout.body.after', function() {
            echo $this->app['view']->make('oxygen/ui::body')->render();
        });

        $this->app['events']->listen('oxygen.layout.body.after', function() {
            echo $this->app['view']->make('oxygen/ui::bodyLast')->render();
        }, -1);
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
