'use strict';
module.exports = (context, source, options, config) => {
  return `
    import Vue from 'vue';
    import vm from '${context.resourcePath.replace(/\\/g, '\\\\')}';
    ${config.codeSegment}
    const state = window.__INITIAL_STATE__ || {};
    if (vm.store) {
      vm.store.replaceState(state);
    } else {
      vm.data = { ...state, ...vm.data };
    }
    const hookRender = vm.hookRender || Vue.hookRender;
    if (hookRender) {
      const context = { state };
      hookRender(context, vm);
    }
    const app = new Vue(vm);
    app.$mount('#app');
  `;
};