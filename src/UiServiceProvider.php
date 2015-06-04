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

        $this->app['oxygen.preferences']->loadDirectory(__DIR__ . '/../resources/preferences', [
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
     * Adds navigation transitions to the view.
     */
    public function addNavigationTransitions() {
        /*$this->app['events']->listen('oxygen.layout.headers', function() {
            header('Link: </packages/oxygen/ui/css/entering.css>;rel=transition-entering-stylesheet;scope=*');
        });*/
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
