---
title: KeepAwake
description: A React component that prevents the screen from sleeping when rendered.
packageName: expo-keep-awake
---

# KeepAwake

> 支持平台：Android、iOS、tvOS、Web、Expo Go。

`expo-keep-awake` provides a React hook that prevents the screen from sleeping and a pair of functions to enable this behavior imperatively.

## Installation

:::tabs
:::tab npm
```sh
npx expo install expo-keep-awake
```
:::
:::tab yarn
```sh
yarn expo install expo-keep-awake
```
:::
:::tab pnpm
```sh
pnpm expo install expo-keep-awake
```
:::
:::tab bun
```sh
bun expo install expo-keep-awake
```
:::
:::

## Usage

### Example: hook

```jsx
import { useKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { Text, View } from 'react-native';

export default function KeepAwakeExample() {
  /* @info As long as this component is mounted, the screen will not turn off from being idle. */
  useKeepAwake();
  /* @end */
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>This screen will never sleep!</Text>
    </View>
  );
}
```

### Example: functions

```jsx
import { activateKeepAwake, deactivateKeepAwake } from 'expo-keep-awake';
import React from 'react';
import { Button, View } from 'react-native';

export default class KeepAwakeExample extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={this._activate} title="Activate" />
        <Button onPress={this._deactivate} title="Deactivate" />
      </View>
    );
  }

  _activate = () => {
    /* @info Screen will remain on after called until **deactivateKeepAwake()** is called. */ activateKeepAwake(); /* @end */
    alert('Activated!');
  };

  _deactivate = () => {
    /* @info Deactivates KeepAwake, or does nothing if it was never activated. */ deactivateKeepAwake(); /* @end */
    alert('Deactivated!');
  };
}
```

## API

```js
import * as KeepAwake from 'expo-keep-awake';
```

