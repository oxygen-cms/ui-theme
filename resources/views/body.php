<?php
    use Oxygen\Core\Html\Editor\Editor;
?>

<!-- Core -->
<script src="/packages/oxygen/ui/bower_components/jquery/dist/jquery.min.js"></script>
<script src="/packages/oxygen/ui/bower_components/headroom.js/dist/headroom.min.js"></script>
<script src="/packages/oxygen/ui/bower_components/vex/js/vex.combined.min.js"></script>
<script>vex.defaultOptions.className = 'Dialog';</script>
<link rel="stylesheet" href="/packages/oxygen/ui/bower_components/vex/css/vex.css" />
<!--<script src="/packages/oxygen/ui/bower_components/smoothstate/jquery.smoothState.js"></script>-->
<script src="/packages/oxygen/ui/bower_components/taggingJS/tagging.min.js"></script>

<!-- Code Editor -->
<?php if(Editor::$includeScripts): ?>
    <script src="/packages/oxygen/ui/bower_components/ace-builds/src-min/ace.js"></script>
    <script src="/packages/oxygen/ui/bower_components/ckeditor/ckeditor.js"></script>
<?php endif; ?>

<!-- Image Editor -->
<!--<script src="/packages/oxygen/ui/bower_components/caman/dist/caman.full.js"></script>-->
<script src="/packages/oxygen/ui/bower_components/Jcrop/js/jquery.Jcrop.min.js"></script>
<!--<script src="/packages/oxygen/ui/bower_components/blueimp-canvas-to-blob/js/canvas-to-blob.js"></script>-->
<link rel="stylesheet" href="/packages/oxygen/ui/bower_components/Jcrop/css/jquery.Jcrop.css" type="text/css">