<?php
    use Oxygen\Core\Html\Editor\Editor;
?>

<!-- Core -->
<script src="/packages/oxygen/ui/vendor/jquery.min.js"></script>
<script src="/packages/oxygen/ui/vendor/headroom.min.js"></script>
<script src="/packages/oxygen/ui/vendor/vex/vex.min.js"></script>
<script>vex.defaultOptions.className = 'Dialog';</script>
<link rel="stylesheet" href="/packages/oxygen/ui/vendor/vex/vex.css" />
<?php if(Auth::user()->getPreferences()->get('pageLoad.progress.enabled', true) === true): ?>
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
    <script src="/packages/oxygen/ui/vendor/pace.min.js"></script>
<?php endif; ?>
<?php if(Auth::user()->getPreferences()->get('pageLoad.smoothState.enabled', true) === true): ?>
<script src="/packages/oxygen/ui/vendor/smoothState.js"></script>
<?php endif; ?>
<script src="/packages/oxygen/ui/vendor/tagging.js"></script>

<!-- Code Editor -->
<script src="/packages/oxygen/ui/vendor/ace/ace.js"></script>
<script src="/packages/oxygen/ui/vendor/ckeditor/ckeditor.js"></script>

<!-- Image Editor -->
<script src="/packages/oxygen/ui/vendor/jcrop/jcrop.min.js"></script>
<link rel="stylesheet" href="/packages/oxygen/ui/vendor/jcrop/jcrop.min.css" type="text/css">