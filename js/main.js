"use strict";
var SCRIPT_MAIN = (function () {
  var initFullPage = function () {
    if ($("#fullpage").length > 0) {
      $("#fullpage").fullpage({
        autoScrolling: true,
        scrollHorizontally: true,
        sectionSelector: ".section",
        controlArrows: false,
        verticalCentered: false,
        scrollOverflow: false,
        scrollingSpeed: 800,
        anchors: [
          "intro",
          "main",
          "world_view",
          "story",
          "combat",
          "media",
          "footer",
        ],
        menu: ".menu_list",
        onLeave: function (origin, destination, direction, trigger) {
          var media_box = document.querySelector(".section_media");
          var control = document.querySelector(".control_page");
          var name_space = document.querySelectorAll(".name_item");
          if (destination.index === 0) {
            var videoIntro = document.querySelector(".section_intro .video");
            videoIntro.currentTime = 0;
            videoIntro.play();
          }
          media_box.classList.toggle("is_visible", destination.index == 6);
          control.classList.toggle(
            "is_show",
            destination.index !== 0 &&
              destination.index !== 1 &&
              destination.index !== 6
          );
          name_space.forEach(function (elm, index) {
            var anchor = elm.getAttribute("data-id");
            elm.classList.toggle("is_show", anchor === destination.anchor);
            if (destination.anchor === "house" && anchor === "story") {
              elm.classList.add("is_show");
            }
          });
          switch (destination.index) {
            case 2:
              resetSlides(".world_slide_thumbs", ".world_slide_banner");
              break;
            case 3:
              resetSlides(".story_slide");
              break;
            case 4:
              resetSlides(".combat_slide_thumbs", ".combat_slide_banner");
              break;
            case 5:
              if (direction === 'down') {
                resetSlides(".media_slide_thumbs", ".media_slide_banner", ".slide_media_popup");
              }
              break;
            case 7:
              resetSlides(".house_slide_thumbs", ".house_slide_banner", {selector: ".slide_pagination_house", slideIndex: 2});
              break;
            default:
              break;
          }
          function resetSlides(...selectors) {
            selectors.forEach(item => {
              if (typeof item === 'string') {
                $(item)[0].swiper.slideTo(0);
              } else if (typeof item === 'object') {
                $(item.selector)[0].swiper.slideTo(item.slideIndex);
              }
            });
          }
        },
        afterLoad: function (origin, destination, direction, trigger) {
          const header = document.querySelector(".header");
          const btnShowMenu = document.querySelector(".js_toggle_menu");
          const shouldShowHeader = !destination.isFirst && !destination.isLast;
          header.classList.toggle("is_show", shouldShowHeader);
          header.classList.toggle("is_delay", destination.index === 1);
          const sections = document.querySelectorAll(".section");
          const isPenultimateSection =
            destination.index === sections.length - 2;
          btnShowMenu.classList.toggle("is_hidden", destination.isLast);

          if (destination.isLast || destination.isFirst) {
            fullpage_api.setAllowScrolling(false, "down,up");
            fullpage_api.setKeyboardScrolling(false, "down,up");
          } else if (destination.index === 1) {
            fullpage_api.setAllowScrolling(false, "up");
            fullpage_api.setKeyboardScrolling(false, "up");
            fullpage_api.setAllowScrolling(true, "down");
            fullpage_api.setKeyboardScrolling(true, "down");
          } else if (isPenultimateSection) {
            fullpage_api.setAllowScrolling(false, "down");
            fullpage_api.setKeyboardScrolling(false, "down");
          } else {
            fullpage_api.setAllowScrolling(true);
            fullpage_api.setKeyboardScrolling(true);
          }
          var width = $(window).width();
          if (width <= 720 && destination.isFirst) {
            fullpage_api.moveSectionDown();
          }
        },
      });
    }

    const videoIntro = document.querySelector(".section_intro .video");
    if (videoIntro) {
        videoIntro.onended = function () {
        fullpage_api.moveSectionDown();
      };
    }
    $(document).on("click", ".control_prev", function () {
      fullpage_api.moveSectionUp();
    });
    $(document).on("click", ".control_next", function () {
      fullpage_api.moveSectionDown();
    });
    $(document).on("click", ".btn_skip", function () {
      fullpage_api.moveSectionDown();
    });
    $(document).on("click", ".js_show_popup", function () {
      fullpage_api.setAllowScrolling(false);
      $(".header").removeClass("is_show");
      $(".js_toggle_menu").addClass("is_hidden");
      if (
        $(this).attr("data-id") === "popup_combat" ||
        $(this).attr("data-id") === "popup_media"
      ) {
        $(".control_page").removeClass("is_show");
      }
    });
    $(document).on("click", ".btn_close_popup", function () {
      if ($(this).parent().hasClass("house_popup")) {
        $(".header").removeClass("is_show");
        $(".js_toggle_menu").addClass("is_hidden");
        fullpage_api.setAllowScrolling(false);
      } else {
        $(".header").addClass("is_show");
        $(".js_toggle_menu").removeClass("is_hidden");
        fullpage_api.setAllowScrolling(true);
      }
      if (
        $(this).parent().attr("id") === "popup_combat" ||
        $(this).parent().attr("id") === "popup_media"
      ) {
        $(".control_page").addClass("is_show");
      }
    });
    slideMedia();
    slideWorldView();
    slideCombat();
    slideStory();
    slideHouse();
  };
  var slideWorldView = function () {
    if (typeof document.querySelector(".world_slide_thumbs") === "undefined")
      return;
    const swiperBanner1 = new Swiper(".world_slide_thumbs", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      allowTouchMove: false,
      effect: "fade",
    });
    if (typeof document.querySelector(".world_slide_banner") === "undefined")
      return;
    const swiperBanner = new Swiper(".world_slide_banner", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
      loop: true,
      thumbs: {
        swiper: swiperBanner1,
      },
      navigation: {
        nextEl: ".button_world_next",
        prevEl: ".button_world_prev",
      },
      pagination: {
        el: ".pagination_world_view",
        clickable: true,
        renderBullet: function (index, className) {
          return `<button class="${className}"><i class="sp ico_pagination"></i></button>`;
        },
      },
    });
  };
  var slideStory = function () {
    if (typeof document.querySelector(".story_slide") === "undefined") return;
    const swiperBanner = new Swiper(".story_slide", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 21,
      watchSlidesProgress: true,
      allowTouchMove: false,
      navigation: {
        nextEl: ".button_story_next",
        prevEl: ".button_story_prev",
      },
      pagination: {
        el: ".pagination_story",
        clickable: true,
        renderBullet: function (index, className) {
          return `<button class="${className}"><i class="sp ico_pagination"></i></button>`;
        },
      },
      breakpoints: {
        721: {
          slidesPerView: "auto",
          spaceBetween: 21,
        },
      },
    });
  };
  var slideCombat = function () {
    if (typeof document.querySelector(".combat_slide_thumbs") === "undefined")
      return;
    const swiperBanner1 = new Swiper(".combat_slide_thumbs", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 21,
      watchSlidesProgress: true,

      breakpoints: {
        721: {
          slidesPerView: 3,
          spaceBetween: 21,
        },
      },
    });
    if (typeof document.querySelector(".combat_slide_banner") === "undefined")
      return;
    const swiperBanner = new Swiper(".combat_slide_banner", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
      allowTouchMove: false,
      pagination: {
        el: ".pagination_combat",
        clickable: true,
        renderBullet: function (index, className) {
          return `<button class="${className}"><i class="sp ico_pagination"></i></button>`;
        },
      },
      navigation: {
        nextEl: ".button_combat_next",
        prevEl: ".button_combat_prev",
      },
      thumbs: {
        swiper: swiperBanner1,
      },
    });
    $(".combat_slide_thumbs .swiper-slide").hover(function () {
      var index = $(this).index();
      swiperBanner.slideTo(index);
      swiperBanner1.slideTo(index);
      $(".combat_slide_thumbs .swiper-slide").removeClass(
        "swiper-slide-thumb-active"
      );
      $(this).addClass("swiper-slide-thumb-active");
    });
  };
  var slideMedia = function () {
    if (typeof document.querySelector(".media_slide_thumbs") === "undefined")
      return;
    if (typeof document.querySelector(".media_slide_banner") === "undefined")
      return;
    if (typeof document.querySelector(".slide_media_popup") === "undefined")
      return;
    const swiperBanner1 = new Swiper(".media_slide_thumbs", {
      slidesPerView: 2,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 10,
      watchSlidesProgress: true,
      freeMode: true,
      scrollbar: {
        el: ".pagination_media",
        hide: false,
      },

      breakpoints: {
        721: {
          slidesPerView: 3,
          spaceBetween: 10,
        },
        1025: {
          slidesPerView: 4,
          spaceBetween: 10,
        },
      },
    });
    const swiperBanner = new Swiper(".media_slide_banner", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
      allowTouchMove: false,
      thumbs: {
        swiper: swiperBanner1,
      },
      navigation: {
        nextEl: ".button_media_next",
        prevEl: ".button_media_prev",
      },
    });

    const swiperBanner2 = new Swiper(".slide_media_popup", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 0,
      watchSlidesProgress: true,
    });
    swiperBanner.on("slideChange", function () {
      var indexActive = swiperBanner.activeIndex;
      swiperBanner2.slideTo(indexActive);
    });
  };
  var slideHouse = function () {
    if (
      typeof document.querySelector(".slide_pagination_house") === "undefined"
    )
      return;
    if (typeof document.querySelector(".house_slide_thumbs") === "undefined")
      return;
    if (typeof document.querySelector(".house_slide_banner") === "undefined")
      return;
    const classArray = [
      "ico_grendal",
      "ico_guntfell",
      "ico_erhard",
      "ico_collin",
      "ico_aindal",
      "ico_aerius",
    ];
    const swiperBanner = new Swiper(".house_slide_banner", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
      allowTouchMove: false,
      loop: true,
      navigation: {
        nextEl: ".button_pagination_next",
        prevEl: ".button_pagination_prev",
      },
    });

    const swiperBanner1 = new Swiper(".house_slide_thumbs", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
      thumbs: {
        swiper: swiperBanner,
      },
      pagination: {
        el: ".pagination_house",
        clickable: true,
        renderBullet: function (index, className) {
          const spanClass = classArray[index % classArray.length];
          return `<button class="${className}"><span class="${spanClass}"></span></button>`;
        },
      },
    });
    const swiperBanner2 = new Swiper(".slide_pagination_house", {
      slidesPerView: 3,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 0,
      centeredSlides: true,
      watchSlidesProgress: true,
      allowTouchMove: false,
      loop: true,
      navigation: {
        nextEl: ".button_pagination_next",
        prevEl: ".button_pagination_prev",
      },
      thumbs: {
        swiper: swiperBanner1,
      },
    });
  };
  var onShowPopup = function () {
    var btnOpen = $(".js_show_popup");
    var btnClose = $(".btn_close_popup");
    if (btnOpen.length > 0) {
      btnOpen.click(function () {
        var id = $(this).attr("data-id");
        var idItem = $(this).attr("data-popup");
        var btn = $("#" + id).find('.btn_close_popup');
        btn.addClass('is_show');
        $("#" + id).addClass("is_show");
        $("#" + idItem).addClass("is_show");

        var video = $("#" + idItem).find(".video")[0];
        if (video) {
          video.play();
        }
      });
      btnClose.click(function () {
        $(this).removeClass("is_show");
        $(this).parent().removeClass("is_show");
        $(this).siblings().removeClass("is_show");
        var videos = $(this).siblings().find(".video");
        videos.each(function () {
          this.pause();
          this.currentTime = 0;
        });
      });
    }
  };
  var toggleMenu = function () {
    var btnShow = $(".js_toggle_menu");
    var btnClose = $(".btn_close_menu");
    var overlay = $(".over-lay");
    var menuItem = $(".menu_link");
    var handleMenuToggle = function () {
      $(".header, .over-lay").toggleClass("is_open");
    };
    btnShow.click(handleMenuToggle);
    btnClose.click(handleMenuToggle);
    overlay.click(handleMenuToggle);
    menuItem.click(handleMenuToggle);
  };

  return {
    _: function () {
      initFullPage();
      onShowPopup();
      toggleMenu();
    },
  };
})();
$(document).ready(function () {
  SCRIPT_MAIN._();
});
