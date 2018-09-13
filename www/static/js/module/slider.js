var mySwiper = new Swiper('.swiper-container', {
  autoplay: true, // 可选选项，自动滑动
  slidesPerView: 'auto',
  observer: true, // 修改swiper自己或子元素时，自动初始化swiper
  observeParents: true, // 修改swiper的父元素时，自动初始化swiper
  pagination: {
    el: '.swiper-pagination'
  }
});
