<template>
  <main id="main-content" tabindex="-1" class="not-found"><div><p>404 / PAGE NOT FOUND</p><h1>There's nothing here.</h1><span>The page may have moved, or the address may be incorrect.</span><router-link to="/">Go to workspace <span aria-hidden="true">→</span></router-link></div></main>
</template>
<style scoped>
.not-found { min-height:100vh; display:grid; place-items:center; padding:24px; background:#f3f5ef; color:#20372f; }.not-found > div { width:min(100%,480px); padding:40px; border:1px solid #e2e9e2; border-radius:16px; background:white; box-shadow:0 8px 28px #203b2910; }.not-found p { color:#82938a; font-size:11px; font-weight:700; letter-spacing:.14em; }.not-found h1 { margin:18px 0 10px; font-size:36px; font-weight:700; letter-spacing:-.045em; }.not-found div > span { color:#7a8c82; font-size:14px; }.not-found a { display:flex; justify-content:space-between; align-items:center; margin-top:32px; padding:12px 15px; border-radius:8px; background:#254b3c; color:white; font-size:13px; font-weight:650; }
</style>
