// ================================
//             MainNav
// ================================

class MainNav {

    static headroom() {
        var header = $(".MainNav");

        if (header.length > 0) {
            if ($(window).width() > 768) {
                var headroom = new Headroom(header[0], {
                    "tolerance": 20,
                    "offset": 50,
                    "classes":
                        {"initial": "Headroom",
                        "pinned": "Headroom--pinned",
                        "unpinned": "Headroom--unpinned",
                        "top": "Headroom--top",
                        "notTop": "Headroom--not-top"
                        }
                });
                headroom.init();
            }
        }
    }
}