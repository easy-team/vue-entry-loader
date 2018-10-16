'use strict';
module.exports = (context, source, options, config) => {
  return `
    import Vue from 'vue';
    import vm from '${context.resourcePath.replace(/\\/g, '\\\\')}';
    ${config.codeSegment}
    const data = window.__INITIAL_STATE__ || {};
    const context = { state: data };
    const hook = vm.hook || Vue.hook || {};
    const render = hook.render || vm.hookRender || Vue.hookRender;
    if (render) {
      render(context, vm);
    }
    const store = typeof vm.store === 'function' ? vm.store(data) : vm.store;
    const router = typeof vm.router === 'function' ? vm.router() : vm.router;
    const options = store && router ? {
      ...vm, 
      store,
      router
    } : { ...vm, data };
    const app = new Vue(options);
    app.$mount('#app');
  `;
};