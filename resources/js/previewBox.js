import { Toggle } from './Core/Toggle';
import { setBodyScrollable } from './pages';

const previewBox = function() {
    var content = document.getElementById('content');

    document.querySelector('.Content-refresh').addEventListener('click', function () {
        document.querySelector('.Content-preview').contentWindow.location.reload();
    });

    new Toggle(
        document.querySelector('.Content-collapseToggle'),
        function () {
            content.classList.add('Content-container--fill');
            setBodyScrollable(false);
        },
        function () {
            content.classList.remove('Content-container--fill');
            setBodyScrollable(true);
        }
    );

    setBodyScrollable(false);
};

export default previewBox;