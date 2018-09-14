'use strict';
module.exports = (context, source, options, config) => {
  return `
    import Vue from 'vue';
    import vm from '${context.resourcePath.replace(/\\/g, '\\\\')}';
    ${config.codeSegment}
    export default function(context) {
      if (vm.store && vm.router) {
        vm.store.replaceState({ ...vm.store.state, ...context.state });
        vm.router.push({ path: context.state.url });
        const matchedComponents = vm.router.getMatchedComponents();
        if (!matchedComponents) {
          return Promise.reject({ code: '404' });
        }
        return Promise.all(
          matchedComponents.map((component) => {
            if (component.methods && component.methods.fetchApi) {
              return component.methods.fetchApi(vm.store);
            }
            return null;
          })
        ).then(() => {
          context.state = { ...vm.store.state, ...context.state };
          const hookRender = vm.hookRender || Vue.hookRender;
          if (hookRender) {
            hookRender(context, vm);
          }
          return new Vue(vm);
        });
      } else {
        const VueApp = Vue.extend(vm);
        const hookRender = vm.hookRender || Vue.hookRender;
        const opts = { data: context.state };
        if (hookRender) {
          hookRender(context, opts);
        }
        return new VueApp(opts);
      }
    };
  `;
};