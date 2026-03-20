(function($) {
    'use strict';

    var frame;
    var currentUploadTarget = null;

    $(function() {
        $(document).on('click', '.ports-upload', function(e) {
            e.preventDefault();
            var target = $(this).data('target');
            var isCard = typeof target === 'number' || (target && target !== 'hero_banner_id');
            currentUploadTarget = { type: isCard ? 'card' : 'hero', id: target };
            openMediaFrame();
        });

        $(document).on('click', '.ports-remove', function(e) {
            e.preventDefault();
            var target = $(this).data('target');
            if (target === 'hero_banner_id') {
                $('#hero_banner_id').val(0);
                $('#hero_banner_preview').empty();
            }
        });

        $(document).on('click', '.ports-remove-card', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $row = $(this).closest('.ports-card-row');
            if (!$row.length) return;
            $row.remove();
            reindexCards();
            syncCardsToDb();
        });

        $('#add-card').on('click', function() {
            var cardIndex = $('#cards-container .ports-card-row').length;
            var row = $(
                '<div class="ports-card-row" data-index="' + cardIndex + '">' +
                '<div class="ports-card-fields">' +
                '<div class="ports-card-row-header">' +
                '<span class="ports-card-row-label">Card #<span class="ports-card-num">' + (cardIndex + 1) + '</span></span>' +
                '<button type="button" class="button button-link-delete ports-remove-card" aria-label="Remove this card">Remove</button>' +
                '</div>' +
                '<div class="ports-media-wrap">' +
                '<input type="hidden" name="ports_services_page[cards][' + cardIndex + '][image_id]" class="card-image-id" value="0" />' +
                '<button type="button" class="button ports-upload" data-target="' + cardIndex + '">Image</button>' +
                '<div class="ports-preview card-preview"></div>' +
                '</div>' +
                '<input type="text" name="ports_services_page[cards][' + cardIndex + '][title]" placeholder="Card title" class="card-title" />' +
                '<textarea name="ports_services_page[cards][' + cardIndex + '][description]" rows="2" placeholder="Description"></textarea>' +
                '<input type="text" name="ports_services_page[cards][' + cardIndex + '][href]" placeholder="Link URL (e.g. /services/mobile-banking)" class="card-href" />' +
                '</div>' +
                '</div>'
            );
            $('#cards-container').append(row);
        });
    });

    function reindexCards() {
        $('#cards-container .ports-card-row').each(function(i) {
            var $row = $(this);
            $row.attr('data-index', i);
            $row.find('.ports-card-num').text(i + 1);
            $row.find('.card-image-id').attr('name', 'ports_services_page[cards][' + i + '][image_id]');
            $row.find('.ports-upload').data('target', i);
            $row.find('.card-title').attr('name', 'ports_services_page[cards][' + i + '][title]');
            $row.find('textarea').attr('name', 'ports_services_page[cards][' + i + '][description]');
            $row.find('.card-href').attr('name', 'ports_services_page[cards][' + i + '][href]');
        });
    }

    function collectCardsFromForm() {
        var cards = [];
        $('#cards-container .ports-card-row').each(function() {
            var $row = $(this);
            cards.push({
                image_id: $row.find('.card-image-id').val() || '0',
                title: $row.find('.card-title').val() || '',
                description: $row.find('textarea').val() || '',
                href: $row.find('.card-href').val() || ''
            });
        });
        return cards;
    }

    function syncCardsToDb() {
        var cards = collectCardsFromForm();
        var payload = {
            nonce: typeof portsServicesEditor !== 'undefined' ? portsServicesEditor.nonce : '',
            cards: cards
        };
        var action = typeof portsServicesEditor !== 'undefined' ? portsServicesEditor.actionRemoveCard : 'ports_services_remove_card';
        var url = (typeof portsServicesEditor !== 'undefined' ? portsServicesEditor.ajaxUrl : '') + '?action=' + encodeURIComponent(action);

        $.ajax({
            url: url,
            type: 'POST',
            data: JSON.stringify(payload),
            contentType: 'application/json',
            dataType: 'json'
        }).done(function(response) {
            if (response && response.success) {
                var $wrap = $('.ports-services-editor');
                if ($wrap.length && !$wrap.find('.ports-card-saved-notice').length) {
                    $wrap.prepend('<div class="notice notice-success is-dismissible ports-card-saved-notice"><p>' + (response.data && response.data.message ? response.data.message : 'Cards updated.') + '</p></div>');
                    setTimeout(function() { $wrap.find('.ports-card-saved-notice').fadeOut(function() { $(this).remove(); }); }, 3000);
                }
            }
        }).fail(function() {
            var $wrap = $('.ports-services-editor');
            if ($wrap.length && !$wrap.find('.ports-card-error-notice').length) {
                $wrap.prepend('<div class="notice notice-error is-dismissible ports-card-error-notice"><p>Could not update. Save the form to apply changes.</p></div>');
            }
        });
    }

    function openMediaFrame() {
        if (frame) frame.destroy();
        frame = wp.media({
            title: 'Select image',
            library: { type: 'image' },
            multiple: false,
            button: { text: 'Use this image' }
        });
        frame.on('select', function() {
            var att = frame.state().get('selection').first().toJSON();
            if (currentUploadTarget.type === 'hero') {
                $('#hero_banner_id').val(att.id);
                $('#hero_banner_preview').html('<img src="' + (att.sizes && att.sizes.medium ? att.sizes.medium.url : att.url) + '" alt="" style="max-width:300px;height:auto;" />');
            } else {
                var row = $('#cards-container .ports-card-row').eq(currentUploadTarget.id);
                row.find('.card-image-id').val(att.id);
                row.find('.card-preview').html('<img src="' + (att.sizes && att.sizes.thumbnail ? att.sizes.thumbnail.url : att.url) + '" alt="" />');
            }
        });
        frame.open();
    }
})(jQuery);
