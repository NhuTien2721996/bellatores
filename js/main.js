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
        anchors: ["main", "world_view", "story", "combat", "media", "footer"],
        menu: ".menu_list",
        onLeave: function (origin, destination, direction, trigger) {
          var media_box = document.querySelector(".section_media");
          var control = document.querySelector(".control_page");
          var name_space = document.querySelectorAll(".name_item");
          media_box.classList.toggle("is_visible", destination.index == 5);
          control.classList.toggle(
            "is_show",
            destination.index !== 0 && destination.index !== 5
          );
          name_space.forEach(function (elm, index) {
            var anchor = elm.getAttribute("data-id");
            elm.classList.toggle("is_show", anchor === destination.anchor);
            if (destination.anchor === "house" && anchor === "story") {
              elm.classList.add("is_show");
            }
          });
        },
        afterLoad: function (origin, destination, direction, trigger) {
          const header = document.querySelector(".header");
          header.classList.add("is_show");
          header.classList.toggle("is_delay", destination.index === 0);
          const sections = document.querySelectorAll(".section");
          const isPenultimateSection =
            destination.index === sections.length - 2;
          fullpage_api.setAllowScrolling(!isPenultimateSection, "down");
          header.classList.toggle("is_show", destination.index !== 6);
        },
      });
    }
    $(document).on("click", ".control_prev", function () {
      fullpage_api.moveSectionUp();
    });
    $(document).on("click", ".control_next", function () {
      fullpage_api.moveSectionDown();
    });
    $(document).on("click", ".js_show_popup", function () {
      fullpage_api.setAllowScrolling(false);
      $(".header").removeClass("is_show");
      if (
        $(this).attr("data-id") === "popup_combat" ||
        $(this).attr("data-id") === "popup_media"
      ) {
        $(".control_page").removeClass("is_show");
      }
    });
    $(document).on("click", ".btn_close_popup", function () {
      fullpage_api.setAllowScrolling(true);
      if ($(this).parent().hasClass("house_popup")) {
        $(".header").removeClass("is_show");
      } else {
        $(".header").addClass("is_show");
      }
      if (
        $(this).parent().attr("id") === "popup_combat" ||
        $(this).parent().attr("id") === "popup_media"
      ) {
        $(".control_page").addClass("is_show");
      }
    });
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
      thumbs: {
        swiper: swiperBanner1,
      },
      navigation: {
        nextEl: ".button_slide_next",
        prevEl: ".button_slide_prev",
      },
      pagination: {
        el: ".pagination_world_view",
        clickable: true,
      },
    });
  };
  var slideStory = function () {
    if (typeof document.querySelector(".story_slide") === "undefined") return;
    const swiperBanner = new Swiper(".story_slide", {
      slidesPerView: "auto",
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 21,
      watchSlidesProgress: true,
      allowTouchMove: false,

    });
  };
  var slideCombat = function () {
    if (typeof document.querySelector(".combat_slide_thumbs") === "undefined")
      return;
    const swiperBanner1 = new Swiper(".combat_slide_thumbs", {
      slidesPerView: 3,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 21,
      watchSlidesProgress: true,
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
    const swiperBanner1 = new Swiper(".media_slide_thumbs", {
      slidesPerView: 4,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 10,
      watchSlidesProgress: true,
    });
    if (typeof document.querySelector(".media_slide_banner") === "undefined")
      return;
    const swiperBanner = new Swiper(".media_slide_banner", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
      allowTouchMove: false,

      navigation: {
        nextEl: ".button_media_next",
        prevEl: ".button_media_prev",
      },
      thumbs: {
        swiper: swiperBanner1,
      },
    });
    if (typeof document.querySelector(".slide_media_popup") === "undefined")
      return;
    const swiperBanner2 = new Swiper(".slide_media_popup", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 0,
      watchSlidesProgress: true,
    });
    swiperBanner.on('slideChange', function () {
      var indexActive = swiperBanner.activeIndex;
      swiperBanner2.slideTo(indexActive);
    });
  };
  var slideHouse = function () {
    if (typeof document.querySelector(".house_slide_thumbs") === "undefined")
      return;
    const swiperBanner1 = new Swiper(".house_slide_thumbs", {
      slidesPerView: 1,
      disableOnInteraction: true,
      speed: 600,
      spaceBetween: 8,
      watchSlidesProgress: true,
      effect: "fade",
    });
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
      thumbs: {
        swiper: swiperBanner1,
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
  };
  var onShowPopup = function () {
    var btnOpen = $(".js_show_popup");
    var btnClose = $(".btn_close_popup");
    if (btnOpen.length > 0) {
      btnOpen.click(function () {
        var id = $(this).attr("data-id");
        var idItem = $(this).attr("data-popup");
        $("#" + id).addClass("is_show");
        $("#" + idItem).addClass("is_show");
        var video = $('#' + idItem).find('.video')[0];
        if(video){
          video.play();
        }
      });
      btnClose.click(function () {
        $(this).parent().removeClass("is_show");
        $(this).siblings().removeClass("is_show");
        var videos = $(this).siblings().find('.video');
        videos.each(function() {
          this.pause();
          this.currentTime = 0;
      });
      });
    }
  };
  return {
    _: function () {
      initFullPage();
      slideWorldView();
      slideStory();
      slideCombat();
      slideMedia();
      slideHouse();
      onShowPopup();
    },
  };
})();
$(document).ready(function () {
  SCRIPT_MAIN._();
});