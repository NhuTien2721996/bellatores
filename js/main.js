"use strict";
(function (win, $) {
  win.MAIN = win.MAIN || {};
  win.MAIN.common = (function () {
    const params = {
      mediaBox: ".section_media",
      control: ".control_page",
      nameSpace: ".name_item",
      header: ".header",
      btnShowMenu: ".js_toggle_menu",
      btnCloseMenu:".btn_close_menu",
      sections: ".section",
      control_prev: ".control_prev",
      control_next: ".control_next",
      control_page:".control_page",
      btn_skip: ".btn_skip",
      btn_open_popup: ".js_show_popup",
      btn_close_popup:".btn_close_popup",
      overlay:".overlay",
      menuItem:".menu_link",
      videoIntro:".section_intro .video",

      MOBILE_WIDTH:720,

      is_show: "is_show",
      is_hidden: "is_hidden",
      is_delay: "is_delay",
      is_visible: "is_visible",
      is_open:"is_open",
    };
    return {
      init: function () {
        this.setElement();
        this.initFullPage();
        this.initSlider();
        this.bindEvents();
      },
      initSlider: function () {
        this.slideWorldView();
        this.slideStory();
        this.slideCombat();
        this.slideMedia();
        this.slideHouse();
      },
      setElement: function () {
        this.window = $(window);
        this.mediaBox = $(params.mediaBox);
        this.control = $(params.control);
        this.nameSpace = $(params.nameSpace);
        this.header = $(params.header);
        this.overlay = $(params.overlay);
        this.btnShowMenu = $(params.btnShowMenu);
        this.btnCloseMenu = $(params.btnCloseMenu);
        this.sections = $(params.sections);
        this.control_prev = $(params.control_prev);
        this.control_next = $(params.control_next);
        this.control_page = $(params.control_page);
        this.btn_skip = $(params.btn_skip);
        this.btn_open_popup = $(params.btn_open_popup);
        this.btn_close_popup = $(params.btn_close_popup);
        this.menuItem = $(params.menuItem);
        this.videoIntro = $(params.videoIntro)[0];
        this.width = this.window.width();
      },
      bindEvents: function () {
        this.control_prev.on("click", () => {
          fullpage_api.moveSectionUp();
        });
        this.control_next.on("click", () => {
          fullpage_api.moveSectionDown();
        });
        this.btn_skip.on("click", () => {
          fullpage_api.moveSectionDown();
        });
        $.each(this.btn_open_popup, function(index, btn) {
          $(btn).on("click", $.proxy(this.onShowPopup, this));
        }.bind(this));
        $.each(this.btn_close_popup, function(index, btn) {
          $(btn).on("click", $.proxy(this.onClosePopup, this));
        }.bind(this));
        const elements = [this.btnShowMenu, this.btnCloseMenu, this.overlay, this.menuItem];
        elements.forEach(element => element.on("click", $.proxy(this.toggleMenu, this)));
      },

      initFullPage: function () {
        if ($("#fullpage").length > 0) {
          $("#fullpage").fullpage({
            autoScrolling: true,
            scrollHorizontally: true,
            sectionSelector: ".section",
            controlArrows: false,
            verticalCentered: false,
            scrollOverflow: false,
            scrollingSpeed: 800,
            anchors: ["intro","main","world_view","story","combat","media","footer"],
            menu: ".menu_list",
            onLeave: this.onSectionLeave.bind(this),
            afterLoad: this.onSectionLoad.bind(this),
          });
        }
        if (this.videoIntro) {
          this.videoIntro.onended = () => {
            fullpage_api.moveSectionDown();
          };
        }
      },

      onSectionLeave: function (origin, destination, direction, trigger) {
        if (destination.index === 0) {
          this.videoIntro.currentTime = 0;
          this.videoIntro.play();
        }

        this.mediaBox.toggleClass(params.is_visible, destination.index == 6);
        this.control.toggleClass(
          params.is_show,
          destination.index !== 0 &&
            destination.index !== 1 &&
            destination.index !== 6
        );
        this.nameSpace.each(function () {
          const _this = $(this);
          const anchor = _this.attr("data-id");
          _this.toggleClass(params.is_show, anchor === destination.anchor);
          if (destination.anchor === "house" && anchor === "story") {
            _this.addClass(params.is_show);
          }
        });
        this.resetSlidesBySection(destination.index, direction);
      },

      onSectionLoad: function (origin, destination, direction, trigger) {
        const shouldShowHeader = !destination.isFirst && !destination.isLast;

        this.header.toggleClass(params.is_show, shouldShowHeader);
        this.header.toggleClass(params.is_delay, destination.index === 1);

        const isPenultimateSection =
          destination.index === this.sections.length - 2;
        this.btnShowMenu.toggleClass(params.is_hidden, destination.isLast);

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
        if (this.width <= params.MOBILE_WIDTH && destination.isFirst) {
          fullpage_api.moveSectionDown();
        }
      },
      resetSlidesBySection: function (index, direction) {
        switch (index) {
          case 2:
            this.resetSlides(".world_slide_thumbs", ".world_slide_banner");
            break;
          case 3:
            this.resetSlides(".story_slide");
            break;
          case 4:
            this.resetSlides(".combat_slide_thumbs", ".combat_slide_banner");
            break;
          case 5:
            if (direction === "down") {
              this.resetSlides(".media_slide_thumbs",".media_slide_banner",".slide_media_popup"
              );
            }
            break;
          case 7:
            this.resetSlides(".house_slide_thumbs", ".house_slide_banner", {
              selector: ".slide_pagination_house",
              slideIndex: 2,
            });
            break;
          default:
            break;
        }
      },

      resetSlides: function (...selectors) {
        if (!Array.isArray(selectors)) {
          selectors = [selectors];
        }
        selectors.forEach(function (selector) {
          let swiperInstance;
          if (typeof selector === "string") {
            swiperInstance = $(selector)[0]?.swiper;
          } else if (typeof selector === "object" && selector.selector) {
            swiperInstance = $(selector.selector)[0]?.swiper;
          }
          if (swiperInstance) {
            swiperInstance.slideTo(0);
          }
        });
      },

      slideWorldView: function () {
        if (
          typeof document.querySelector(".world_slide_thumbs") === "undefined"
        )
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

        if (
          typeof document.querySelector(".world_slide_banner") === "undefined"
        )
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
            renderBullet: (index, className) => {
              return `<button class="${className}"><i class="sp ico_pagination"></i></button>`;
            },
          },
        });
      },

      slideStory: function () {
        if (typeof document.querySelector(".story_slide") === "undefined")
          return;
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
            renderBullet: (index, className) => {
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
      },

      slideCombat: function () {
        if (
          typeof document.querySelector(".combat_slide_thumbs") === "undefined"
        )
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

        if (
          typeof document.querySelector(".combat_slide_banner") === "undefined"
        )
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
            renderBullet: (index, className) => {
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
          const index = $(this).index();
          swiperBanner.slideTo(index);
          swiperBanner1.slideTo(index);
          $(".combat_slide_thumbs .swiper-slide").removeClass(
            "swiper-slide-thumb-active"
          );
          $(this).addClass("swiper-slide-thumb-active");
        });
      },

      slideMedia: function () {
        if (
          typeof document.querySelector(".media_slide_thumbs") === "undefined"
        )
          return;
        if (
          typeof document.querySelector(".media_slide_banner") === "undefined"
        )
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
          const indexActive = swiperBanner.activeIndex;
          swiperBanner2.slideTo(indexActive);
        });
      },

      slideHouse: function () {
        if (
          typeof document.querySelector(".slide_pagination_house") ===
          "undefined"
        )
          return;
        if (
          typeof document.querySelector(".house_slide_thumbs") === "undefined"
        )
          return;
        if (
          typeof document.querySelector(".house_slide_banner") === "undefined"
        )
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
            renderBullet: (index, className) => {
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
      },
      onShowPopup: function (event) {
        var btn = $(event.currentTarget);
        if (btn.length > 0) {
            var id = btn.attr("data-id");
            var idItem = btn.attr("data-popup");
            var btn = $("#" + id).find(".btn_close_popup");
            btn.addClass(params.is_show);
            $("#" + id).addClass(params.is_show);
            $("#" + idItem).addClass(params.is_show);
            var video = $("#" + idItem).find(".video")[0];
            if (video) {
              video.play();
            }
            fullpage_api.setAllowScrolling(false);
            this.header.removeClass(params.is_show);
            this.btnShowMenu.addClass(params.is_hidden);
            if (
              btn.attr("data-id") === "popup_combat" ||
              btn.attr("data-id") === "popup_media"
            ) {
              this.control_page.removeClass(params.is_show);
            }
        }
      },
      onClosePopup: function (event) {
        var btn = $(event.currentTarget);
        if (btn.length > 0) {
          btn.removeClass(params.is_show);
          btn.parent().removeClass(params.is_show);
          btn.siblings().removeClass(params.is_show);
          var videos = btn.siblings().find(".video");
          videos.each(function () {
            this.pause();
            this.currentTime = 0;
          });
          if (btn.parent().hasClass("house_popup")) {
            this.header.removeClass(params.is_show);
            this.btnShowMenu.addClass(params.is_hidden);
            fullpage_api.setAllowScrolling(false);
          } else {
            this.header.addClass(params.is_show);
            this.btnShowMenu.removeClass(params.is_hidden);
            fullpage_api.setAllowScrolling(true);
          }
          if (
            btn.parent().attr("id") === "popup_combat" ||
            btn.parent().attr("id") === "popup_media"
          ) {
            this.control_page.addClass(params.is_show);
          }
        }
      },
      toggleMenu: function () {
        $(this.header,this.overlay).toggleClass(params.is_open);
      },
    };
  })();
  $(win).on("load", function () {
    MAIN.common.init();
  });
})(window, window.jQuery);
