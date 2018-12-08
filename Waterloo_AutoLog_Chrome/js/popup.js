function initPopup() {

    chrome.storage.local.get({
        GLB_Enabled: true
    }, function (items) {
        $('#enable-autolog').prop('checked', items.GLB_Enabled);
    });

    $('#report-bug').on('click', function (e) {
        e.preventDefault();
        chrome.tabs.create({
            url: 'https://docs.google.com/forms/d/e/1FAIpQLSc8teQisXY9j7mGFWwlNgna5qLqi3kjh31R3iR742oQpJ0fOA/viewform'
        });
    });

    $('#enable-autolog').change(function () {

        chrome.storage.local.set({

            GLB_Enabled: $(this).is(':checked')

        }, function () {

            $('#autolog-toast').removeClass('autolog-toast-hidden');
            setTimeout(function () {
                $('#autolog-toast').addClass('autolog-toast-hidden');
            }, 2000);

        });

    });

    $('#more-options').on('click', function () {
        chrome.runtime.openOptionsPage();
    });

}

initPopup();