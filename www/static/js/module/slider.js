var mySwiper = new Swiper('.swiper-container', {
  autoplay: true, // 可选选项，自动滑动
  slidesPerView: 'auto',
  effect: 'fade',
  observer: true, // 修改swiper自己或子元素时，自动初始化swiper
  observeParents: true, // 修改swiper的父元素时，自动初始化swiper
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function(index, className) {
      return '<span class="' + className + '">' + (index + 1) + '</span>';
    }
  },
  on: {
    init: function() {
      swiperAnimateCache(this); // 隐藏动画元素
      swiperAnimate(this); // 初始化完成开始动画
    },
    slideChangeTransitionEnd: function() {
      swiperAnimate(this); // 每个slide切换结束时也运行当前slide动画
    }
  }
});
