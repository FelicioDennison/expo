"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrefPreview = HrefPreview;
exports.getParamsAndNodeFromHref = getParamsAndNodeFromHref;
const react_1 = require("react");
const PreviewRouteContext_1 = require("./PreviewRouteContext");
const router_store_1 = require("../../global-state/router-store");
const useNavigation_1 = require("../../useNavigation");
const useScreens_1 = require("../../useScreens");
const linking_1 = require("../linking");
function HrefPreview({ href }) {
    const navigation = (0, useNavigation_1.useNavigation)();
    const { routeNode, params, state } = getParamsAndNodeFromHref(href);
    const path = state ? (0, linking_1.getPathFromState)(state) : undefined;
    const value = (0, react_1.useMemo)(() => ({
        params,
        pathname: href.toString(),
        segments: path?.split('/').filter(Boolean) || [],
    }), [params, href]);
    if (!routeNode) {
        return null;
    }
    const Component = (0, useScreens_1.getQualifiedRouteComponent)(routeNode);
    return (<PreviewRouteContext_1.PreviewRouteContext.Provider value={value}>
      <Component navigation={navigation}/>
    </PreviewRouteContext_1.PreviewRouteContext.Provider>);
}
function getParamsAndNodeFromHref(href) {
    const initialState = router_store_1.store.getStateForHref(href)?.routes[0]?.state;
    let state = initialState;
    let routeNode = router_store_1.store.routeNode;
    const params = {};
    while (state && routeNode) {
        const route = state.routes[state.index || state.routes.length - 1];
        Object.assign(params, route.params);
        state = route.state;
        routeNode = routeNode.children.find((child) => child.route === route.name);
    }
    return { params, routeNode, state: initialState };
}
//# sourceMappingURL=HrefPreview.js.map