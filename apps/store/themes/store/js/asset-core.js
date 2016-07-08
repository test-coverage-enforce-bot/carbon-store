var asset = {};

(function (asset) {
    var PROCESSING_TEXT = "processing";
    var SUCCESS_TEXT =  "success";
    var ERROR_TEXT = "error";
    var getText = function(key) {
        return $('#main-bookmark').data(key);
    };
    asset.process = function (type, path, destination, elem) {
        if (!store.user) {
            $('#modal-login').modal('show');
            return;
        }
        $(elem).find("i").removeClass().addClass('fa fa-spinner fa-spin');
        $(elem).find('#main-bookmark').html(getText(PROCESSING_TEXT));
        $(elem).unbind('click');
        $.ajax({
            url: caramel.url('/apis/subscriptions'),
            data: {type: type, asset: path, destination: encodeURIComponent(location.href)},
            method: 'POST',
            success: function (data) {
                messages.alertSuccess(getText(SUCCESS_TEXT));
                window.location.href=destination;
            },
            error: function () {
                messages.alertError(getText(ERROR_TEXT));
                $('i', elem).removeClass().addClass('fw fw-bookmark store-bookmark');
            }
        });
    };

    asset.unsubscribeBookmark = function (type, path, destination, elem) {
        if (!store.user) {
            $('#modal-login').modal('show');
            return;
        }
        $(elem).find("i").removeClass().addClass('fa fa-spinner fa-spin');
        $(elem).find('#main-bookmark').html(getText(PROCESSING_TEXT));
        $.ajax({
            url: caramel.url('/apis/subscriptions') + '?type=' + type + '&asset=' + path,
            method: 'DELETE',
            dataType: 'text json',
            success: function (data) {
                messages.alertSuccess(getText(SUCCESS_TEXT));
                $('i', elem).removeClass().addClass('fw fw-bookmark store-bookmark');
                $(elem).parents('[class^="ctrl-wr-asset"]').fadeOut();
                if ($(elem).find('#main-bookmark').length > 0) {
                    $(elem).find("i").removeClass().addClass('fw fw-bookmark');
                    $(elem).find('#main-bookmark').html("Bookmark");
                    $(elem).attr('id', 'btn-add-gadget');
                }
            },
            error: function (data) {
                var parent = $(elem).parents('[class^="ctrl-wr-asset"]');
                messages.alertError(getText(ERROR_TEXT));
                $(parent.find(".confirmation-popup-container")).fadeOut();
                parent.find('.btn-group').show();
                parent.find('#bookmark-animation').hide();
                $('i', elem).removeClass().addClass('fw fw-bookmark store-bookmarked');
            }
        });
    };
}(asset));