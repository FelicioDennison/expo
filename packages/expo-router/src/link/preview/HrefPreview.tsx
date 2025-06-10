'use client';

import { useMemo } from 'react';

import { PreviewRouteContext } from './PreviewRouteContext';
import { RouteNode } from '../../Route';
import { store } from '../../global-state/router-store';
import { Href, UnknownOutputParams } from '../../types';
import { useNavigation } from '../../useNavigation';
import { getQualifiedRouteComponent } from '../../useScreens';
import { getPathFromState } from '../linking';

export function HrefPreview({ href }: { href: Href }) {
  const navigation = useNavigation();
  const { routeNode, params, state } = getParamsAndNodeFromHref(href);

  const path = state ? getPathFromState(state) : undefined;

  const value = useMemo(
    () => ({
      params,
      pathname: href.toString(),
      segments: path?.split('/').filter(Boolean) || [],
    }),
    [params, href]
  );

  if (!routeNode) {
    return null;
  }

  const Component = getQualifiedRouteComponent(routeNode);

  return (
    <PreviewRouteContext.Provider value={value}>
      <Component navigation={navigation} />
    </PreviewRouteContext.Provider>
  );
}

export function getParamsAndNodeFromHref(href: Href) {
  const initialState = store.getStateForHref(href as any)?.routes[0]?.state;
  let state = initialState;
  let routeNode: RouteNode | undefined | null = store.routeNode;

  const params: UnknownOutputParams = {};

  while (state && routeNode) {
    const route = state.routes[state.index || state.routes.length - 1];
    Object.assign(params, route.params);
    state = route.state;
    routeNode = routeNode.children.find((child) => child.route === route.name);
  }

  return { params, routeNode, state: initialState };
}
