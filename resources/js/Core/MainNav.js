// ================================
//             MainNav
// ================================

class MainNav {

    static headroom() {
        let header = document.querySelector(".MainNav");

        if (header && window.innerWidth > 768) {
            let headroom = new Headroom(header, {
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