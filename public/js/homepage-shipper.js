//   RMIT University Vietnam
//   Course: COSC2430 Web Programming
//   Semester: 2023A
//   Assessment: Assignment 2
//   Author:
//     1. Tran Manh Cuong (s3974735)
//     2. Truong Quang Bao Loc (s3965528)
//     3. Nguyen Van Khai (s3979259)
//     4. Truong Tuong Hao (s3979259)
//     5. Huynh Nguyen Thien Minh (s3978742)
(function ($) {
    "use strict";
    // Sidebar Toggler
    $('.sidebar-toggler').click(function () {
        $('.sidebar, .content').toggleClass("open");
        return false;
    });
})(jQuery);