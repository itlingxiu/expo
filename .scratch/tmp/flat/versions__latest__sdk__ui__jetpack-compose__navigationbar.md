---
title: NavigationBar 组件参考
description: A Jetpack Compose NavigationBar component for Material 3 bottom navigation.
---

# NavigationBar 组件参考

> 支持平台：Android、Expo Go。

Expo UI NavigationBar matches the official Jetpack Compose [`NavigationBar`](https://developer.android.com/develop/ui/compose/components/navigation-bar) API. It displays a row of destinations for switching between top-level app sections.

![Material 3 navigation bar with selectable destinations](/static/images/expo-ui/navigationbar/android-light.webp)

## Installation

:::tabs
:::tab npm
```sh
npx expo install @expo/ui
```
:::
:::tab yarn
```sh
yarn expo install @expo/ui
```
:::
:::tab pnpm
```sh
pnpm expo install @expo/ui
```
:::
:::tab bun
```sh
bun expo install @expo/ui
```
:::
:::

## Usage

### Basic navigation bar

Manage the selected item in React state and pass `selected` to each `NavigationBarItem`.

![A Material 3 navigation bar with Home, Search, and Settings items, Home selected](/static/images/expo-ui/examples/navigationbar-basic-android-light.webp)

```tsx BasicNavigationBar.tsx
import { useState } from 'react';
import {
  Host,
  Icon,
  NavigationBar,
  NavigationBarItem,
  Text,
} from '@expo/ui/jetpack-compose';

const HOME_ICON = require('./assets/home.xml');
const SEARCH_ICON = require('./assets/search.xml');
const SETTINGS_ICON = require('./assets/settings.xml');

export default function BasicNavigationBar() {
  const [selectedTab, setSelectedTab] = useState('home');

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <NavigationBar>
        <NavigationBarItem
          selected={selectedTab === 'home'}
          onClick={() => setSelectedTab('home')}>
          <NavigationBarItem.Icon>
            <Icon source={HOME_ICON} />
          </NavigationBarItem.Icon>
          <NavigationBarItem.Label>
            <Text>Home</Text>
          </NavigationBarItem.Label>
        </NavigationBarItem>

        <NavigationBarItem
          selected={selectedTab === 'search'}
          onClick={() => setSelectedTab('search')}>
          <NavigationBarItem.Icon>
            <Icon source={SEARCH_ICON} />
          </NavigationBarItem.Icon>
          <NavigationBarItem.Label>
            <Text>Search</Text>
          </NavigationBarItem.Label>
        </NavigationBarItem>

        <NavigationBarItem
          selected={selectedTab === 'settings'}
          onClick={() => setSelectedTab('settings')}>
          <NavigationBarItem.Icon>
            <Icon source={SETTINGS_ICON} />
          </NavigationBarItem.Icon>
          <NavigationBarItem.Label>
            <Text>Settings</Text>
          </NavigationBarItem.Label>
        </NavigationBarItem>
      </NavigationBar>
    </Host>
  );
}
```

## API

```tsx
import {
  NavigationBar,
  NavigationBarItem,
} from '@expo/ui/jetpack-compose';
```
