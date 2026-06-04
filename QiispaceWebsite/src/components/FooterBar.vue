<template>
  <footer class="footer">
    <div class="footer__inner">
      <div class="footer__brand">
        <h3 class="footer__brand-name">栖愈 QIISPACE</h3>
        <p class="footer__brand-desc">
          在城市的一隅，寻一处静谧。<br />
          栖愈，以自然之力，愈身心之疲。<br />
          让每一次呼吸，都是一场疗愈之旅。
        </p>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-title">快速导航</h4>
        <router-link to="/">首页</router-link>
        <router-link to="/services">服务介绍</router-link>
        <router-link to="/about">关于我们</router-link>
        <router-link to="/stores">门店列表</router-link>
      </div>

      <div class="footer__col">
        <h4 class="footer__col-title">联系我们</h4>
        <a href="tel:400-000-0000">400-000-0000</a>
        <a href="mailto:hello@qiispace.com">hello@qiispace.com</a>
        <a href="#">微信公众号</a>
        <a href="#">小红书</a>
      </div>
    </div>

    <div class="footer__bottom">
      <p>&copy; 2026 栖愈 QIISPACE. All rights reserved.</p>
    </div>
  </footer>
</template>
