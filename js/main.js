jQuery(function ($) {
    "use strict";
    // Author Code Here
    var endpoint = "http://localhost:3015/";
    var lock = new Auth0Lock("tqhw2IpXKyjWpj6YtCze0jxGukTlaM3w", "fforres.auth0.com");

    lock.on("authenticated", function (authResult) {
        // Use the token in authResult to getProfile() and save it to localStorage
        lock.getProfile(authResult.idToken, function (error, profile) {
            if (error) {
                // Handle error
                return;
            }
            $("#modalSaveSkills").modal("toggle");
            console.log("profile", profile);
            localStorage.setItem("idToken", authResult.idToken);
            localStorage.setItem("profile", JSON.stringify(profile));
        });
    });

    $("#sltSkills").select2({
        tags: true,
        placeholder: "Select a skills",
        minimumInputLength: 2,
        maximumSelectionLength: 4,
        tokenSeparators: [",", " "],
        dropdownParent: $("#modalSaveSkills"),
        ajax: {
            url: endpoint+"tagsByString",
            data: function (params) {
                return {
                    searchString: encodeURI(params.term)
                };
            },
            dataType: "json",
            processResults: function (data, params) {
                return {
                    results: data.map(function(item){ return {id: item.id, text: item.tagName } })
                };
            }
        }
    });

    $("#btnSignUp").on("click", function (e) {
        lock.show();
    });

    $("#frmSaveSkills").on("submit", function(e){
        e.preventDefault();
        var skills = $("#sltSkills").val();
        var postData = {
            linkedinId: localStorage.getItem("idToken"),
            tags: JSON.stringify(skills),
            linkedinData: JSON.stringify(localStorage.getItem("profile"))
        };

        $.post(endpoint+"linkedin", postData, function(resp){
            console.log(resp);
            $("#modalSaveSkills").modal("hide");
            $("#modalSavedSkills").modal("show");
        });
    });
    var owlPricing;
    var ratio = 2;

    // Window Load
    $(window).load(function () {
        // Preloader
        $('.intro-tables, .parallax, header').css('opacity', '0');
        $('.preloader').addClass('animated fadeOut').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
            $('.preloader').hide();
            $('.parallax, header').addClass('animated fadeIn').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                $('.intro-tables').addClass('animated fadeInUp').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
            });
        });

        // Header Init
        if ($(window).height() > $(window).width()) {
            var ratio = $('.parallax').width() / $('.parallax').height();
            $('.parallax img').css('height', ($(window).height()) + 'px');
            $('.parallax img').css('width', $('.parallax').height() * ratio + 'px');
        }

        $('header').height($(window).height() + 80);
        $('section .cut').each(function () {
            if ($(this).hasClass('cut-bottom')) {
                $(this).css('border-left-width', $(this).parent().width() + "px");
            }
        });

        // Sliders Init
        $('.owl-schedule').owlCarousel({
            singleItem: true,
            pagination: true
        });
        $('.owl-testimonials').owlCarousel({
            singleItem: true,
            pagination: true
        });
        $('.owl-twitter').owlCarousel({
            singleItem: true,
            pagination: true
        });

        // Navbar Init
        $('nav').addClass('original').clone().insertAfter('nav').addClass('navbar-fixed-top').css('position', 'fixed').css('top', '0').css('margin-top', '0').removeClass('original');
        $('.mobile-nav ul').html($('nav .navbar-nav').html());
        $('nav.navbar-fixed-top .navbar-brand img').attr('src', $('nav.navbar-fixed-top .navbar-brand img').data("active-url"));

        // Typing Intro Init
        $(".typed").typewriter({
            speed: 60
        });

        // Popup Form Init
        var i = 0;
        var interval = 0.15;
        $('.popup-form .dropdown-menu li').each(function () {
            $(this).css('animation-delay', i + "s");
            i += interval;
        });
        $('.popup-form .dropdown-menu li a').click(function (event) {
            event.preventDefault();
            $(this).parent().parent().prev('button').html($(this).html());
        });

        // Onepage Nav
        $('.navbar.navbar-fixed-top .navbar-nav').onePageNav({
            currentClass: 'active',
            changeHash: false,
            scrollSpeed: 400,
            filter: ':not(.btn)'
        });
    });
    // Window Scroll
    function onScroll() {
        if ($(window).scrollTop() > 50) {
            $('nav.original').css('opacity', '0');
            $('nav.navbar-fixed-top').css('opacity', '1');
        } else {
            $('nav.original').css('opacity', '1');
            $('nav.navbar-fixed-top').css('opacity', '0');
        }
    }

    window.addEventListener('scroll', onScroll, false);

    // Window Resize
    $(window).resize(function () {
        $('header').height($(window).height());
    });

    // Pricing Box Click Event
    $('.pricing .box-main').click(function () {
        $('.pricing .box-main').removeClass('active');
        $('.pricing .box-second').removeClass('active');
        $(this).addClass('active');
        $(this).next($('.box-second')).addClass('active');
        $('#pricing').css("background-image", "url(" + $(this).data('img') + ")");
        $('#pricing').css("background-size", "cover");
    });

    // Mobile Nav
    $('body').on('click', 'nav .navbar-toggle', function () {
        event.stopPropagation();
        $('.mobile-nav').addClass('active');
    });

    $('body').on('click', '.mobile-nav a', function (event) {
        $('.mobile-nav').removeClass('active');
        if (!this.hash) return;
        event.preventDefault();
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            event.stopPropagation();
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    $('body').on('click', '.mobile-nav a.close-link', function (event) {
        $('.mobile-nav').removeClass('active');
        event.preventDefault();
    });

    $('body').on('click', 'nav.original .navbar-nav a:not([data-toggle])', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            event.stopPropagation();
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    function centerModal() {
        $(this).css('display', 'block');
        var $dialog = $(this).find(".modal-dialog"),
            offset = ($(window).height() - $dialog.height()) / 2,
            bottomMargin = parseInt($dialog.css('marginBottom'), 10);

        // Make sure you don't hide the top part of the modal w/ a negative margin
        // if it's longer than the screen height, and keep the margin equal to
        // the bottom margin of the modal
        if (offset < bottomMargin) offset = bottomMargin;
        $dialog.css("margin-top", offset);
    }

    $('.modal').on('show.bs.modal', centerModal);

    $('.modal-popup .close-link').click(function (event) {
        event.preventDefault();
        $('#modal1').modal('hide');
    });

    $(window).on("resize", function () {
        $('.modal:visible').each(centerModal);
    });
});
