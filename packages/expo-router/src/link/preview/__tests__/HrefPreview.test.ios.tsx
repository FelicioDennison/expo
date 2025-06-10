import React from 'react';
import { View, Text } from 'react-native';

import {
  useGlobalSearchParams,
  useLocalSearchParams,
  usePathname,
  useSegments,
} from '../../../hooks';
import { Stack } from '../../../layouts/Stack';
import { renderRouter, screen } from '../../../testing-library';
import { HrefPreview } from '../HrefPreview';

it.each([
  { visible: 'foo', hidden: 'bar' },
  { visible: 'bar', hidden: 'foo' },
])('renders preview for $visible href', async ({ visible, hidden }) => {
  renderRouter({
    index: () => (
      <View testID="index">
        <HrefPreview href={`/${visible}`} />
      </View>
    ),
    foo: () => <View testID="foo" />,
    bar: () => <View testID="bar" />,
  });

  expect(screen.getByTestId(visible)).toBeVisible();
  expect(await screen.queryByTestId(hidden)).toBeFalsy();
});

it.each([
  { visible: 'foo', hidden: 'foo/bar' },
  { visible: 'foo/bar', hidden: 'foo' },
])('renders preview for $visible in nested stack href', async ({ visible, hidden }) => {
  renderRouter({
    _layout: () => <Stack />,
    index: () => (
      <View testID="index">
        <HrefPreview href={`/${visible}`} />
      </View>
    ),
    'foo/_layout': () => <Stack />,
    'foo/index': () => <View testID="foo" />,
    'foo/bar': () => <View testID="foo/bar" />,
  });

  expect(screen.getByTestId(visible)).toBeVisible();
  expect(await screen.queryByTestId(hidden)).toBeFalsy();
});

it.each([
  { paramA: 'foo', paramB: 'bar' },
  { paramA: '123', paramB: 'aBcD' },
])(
  'renders preview for route with params [paramA=$paramA, paramB=$paramB]',
  async ({ paramA, paramB }) => {
    const ParamsComponent = () => {
      const globalParams = useGlobalSearchParams();
      const localParams = useLocalSearchParams();
      return (
        <View testID="params-route">
          <Text testID="local-paramA">{localParams.paramA}</Text>
          <Text testID="local-paramB">{localParams.paramB}</Text>
          <Text testID="global-paramA">{globalParams.paramA}</Text>
          <Text testID="global-paramB">{globalParams.paramB}</Text>
        </View>
      );
    };
    renderRouter({
      index: () => (
        <View testID="index">
          <HrefPreview href={`/${paramA}/${paramB}`} />
        </View>
      ),
      '[paramA]/[paramB]': ParamsComponent,
    });

    expect(screen.getByTestId('params-route')).toBeVisible();
    expect(screen.getByTestId('local-paramA')).toHaveTextContent(paramA);
    expect(screen.getByTestId('local-paramB')).toHaveTextContent(paramB);
    expect(screen.getByTestId('global-paramA')).toHaveTextContent(paramA);
    expect(screen.getByTestId('global-paramB')).toHaveTextContent(paramB);
  }
);

it('usePathname() returns the correct path', async () => {
  const FooComponent = () => {
    const pathname = usePathname();
    return (
      <View>
        <Text testID="pathname">{pathname}</Text>
      </View>
    );
  };
  renderRouter({
    index: () => (
      <View testID="index">
        <HrefPreview href="/foo" />
      </View>
    ),
    foo: FooComponent,
  });

  expect(screen.getByTestId('pathname')).toBeVisible();
  expect(screen.getByTestId('pathname')).toHaveTextContent('/foo');
});

it('useSegments() returns the correct path', async () => {
  const FooComponent = () => {
    const segments = useSegments();
    return (
      <View>
        <Text testID="segments">{JSON.stringify(segments)}</Text>
      </View>
    );
  };
  renderRouter({
    index: () => (
      <View testID="index">
        <HrefPreview href="/foo" />
      </View>
    ),
    foo: FooComponent,
  });

  expect(screen.getByTestId('segments')).toBeVisible();
  expect(screen.getByTestId('segments')).toHaveTextContent(JSON.stringify(['foo']));
});
