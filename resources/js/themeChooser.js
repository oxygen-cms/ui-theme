import $ from 'jquery';

export default function() {
    $('[data-index]').on('click', function() {
        $('[name="theme"]').val($(event.currentTarget).attr('data-index'));
        $('.Form--themes').submit();
    });
}