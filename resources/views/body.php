<!-- Core -->
<script src="/vendor/oxygen/ui-theme/vendor/jquery.min.js"></script>
<script src="/vendor/oxygen/ui-theme/vendor/headroom.min.js"></script>
<script src="/vendor/oxygen/ui-theme/vendor/vex/vex.min.js"></script>
<script>vex.defaultOptions.className = 'Dialog';</script>
<link rel="stylesheet" type="text/css" href="/vendor/oxygen/ui-theme/vendor/vex/vex.css" />
<?php if(!Auth::check() || Auth::user()->getPreferences()->get('pageLoad.progress.enabled', true) === true): ?>
    <script>
        paceOptions = {
            restartOnRequestAfter: 0,
            ghostTime: 10,
            restartOnPushState: false,
            startOnPageLoad: false,
            elements: false,
            ajax: {
                trackMethods: ['GET', 'POST']
            }
        };
    </script>
    <script src="/vendor/oxygen/ui-theme/vendor/pace.min.js"></script>
<?php endif; ?>
<?php if(!Auth::check() || Auth::user()->getPreferences()->get('pageLoad.smoothState.enabled', true) === true): ?>
    <script src="/vendor/oxygen/ui-theme/vendor/smoothState.js"></script>
<?php endif; ?>
<script src="/vendor/oxygen/ui-theme/vendor/tagging.js"></script>

<!-- Code Editor -->
<script src="/vendor/oxygen/ui-theme/vendor/ace/ace.js"></script>
<script src="/vendor/oxygen/ui-theme/vendor/ckeditor/ckeditor.js"></script>

<!-- Image Editor -->
<script src="/vendor/oxygen/ui-theme/vendor/jcrop/jcrop.min.js"></script>
<link rel="stylesheet" type="text/css" href="/vendor/oxygen/ui-theme/vendor/jcrop/jcrop.min.css" type="text/css">