---
title: HorizontalPager 组件参考
description: 用于可滑动页面的 Jetpack Compose HorizontalPager 组件。
---

# HorizontalPager 组件参考

> 支持平台：Android、Expo Go。

Expo UI 的 HorizontalPager 与 Jetpack Compose 的 [HorizontalPager](https://developer.android.com/reference/kotlin/androidx/compose/foundation/pager/package-summary#HorizontalPager(androidx.compose.foundation.pager.PagerState,androidx.compose.ui.Modifier,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function0,kotlin.Function2)) 保持一致——水平滚动并吸附到单个页面的分页器。

`HorizontalPager` 不会自己决定高度——用 [`height`](/versions/latest/sdk/ui/jetpack-compose/modifiers) 修饰符给出高度，或把它放在具有有限高度的父级中。

![HorizontalPager 显示三页中的第二页，下方有页面指示器](/static/images/expo-ui/horizontalpager/android-light.webp)

## 安装

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

## 用法

### 非受控

分页器在原生侧拥有自己的滚动位置。用 `initialPage` 选择起始页，用 `onCurrentPageChange` 监听变化（滑动中途、吸附目标翻转时触发），或用 `onSettledPageChange`（仅在滑动停稳后触发）。

![分页器打开在第二页，上方一行写着 currentPage 1 和 settledPage 1](/static/images/expo-ui/examples/horizontalpager-uncontrolled-android-light.webp)

```tsx UncontrolledPagerExample.tsx
import {
  Box,
  Column,
  Host,
  HorizontalPager,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  fillMaxSize,
  fillMaxWidth,
  height,
} from '@expo/ui/jetpack-compose/modifiers';
import { useState } from 'react';

export default function UncontrolledPagerExample() {
  const colors = useMaterialColors();
  const [currentPage, setCurrentPage] = useState(1);
  const [settledPage, setSettledPage] = useState(1);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Column
        verticalArrangement={{ spacedBy: 12 }}
        modifiers={[fillMaxWidth()]}>
        <Text
          style={{ typography: 'titleLarge' }}
          color={colors.onBackground}>
          currentPage: {currentPage} · settledPage: {settledPage}
        </Text>
        <HorizontalPager
          initialPage={1}
          onCurrentPageChange={setCurrentPage}
          onSettledPageChange={setSettledPage}
          modifiers={[fillMaxWidth(), height(240)]}>
          <Page label="Page 1" color="#6200EE" />
          <Page label="Page 2" color="#03DAC5" />
          <Page label="Page 3" color="#FF5722" />
        </HorizontalPager>
      </Column>
    </Host>
  );
}

function Page({ label, color }: { label: string; color: string }) {
  return (
    <Box
      modifiers={[fillMaxSize(), background(color)]}
      contentAlignment="center">
      <Text color="#FFFFFF" style={{ typography: 'headlineLarge' }}>
        {label}
      </Text>
    </Box>
  );
}
```

### 编程式导航

附加 `ref` 并调用 `animateScrollToPage` 或 `scrollToPage`。它们对应 Compose 的 `PagerState.animateScrollToPage` 和 `PagerState.scrollToPage`。

![5 页中的第 1 页，下方有 Prev、Next 和 Jump to first 按钮](/static/images/expo-ui/examples/horizontalpager-programmatic-android-light.webp)

```tsx ProgrammaticPagerExample.tsx
import {
  Box,
  Button,
  Column,
  Host,
  HorizontalPager,
  type HorizontalPagerHandle,
  Row,
  Text,
  useMaterialColors,
} from '@expo/ui/jetpack-compose';
import {
  background,
  fillMaxSize,
  fillMaxWidth,
  height,
} from '@expo/ui/jetpack-compose/modifiers';
import { useRef, useState } from 'react';

const PAGE_COUNT = 5;

export default function ProgrammaticPagerExample() {
  const colors = useMaterialColors();
  const pagerRef = useRef<HorizontalPagerHandle>(null);
  const [page, setPage] = useState(0);

  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <Column
        verticalArrangement={{ spacedBy: 12 }}
        modifiers={[fillMaxWidth()]}>
        <Text
          style={{ typography: 'titleLarge' }}
          color={colors.onBackground}>
          Page {page + 1} / {PAGE_COUNT}
        </Text>
        <HorizontalPager
          ref={pagerRef}
          onSettledPageChange={setPage}
          modifiers={[fillMaxWidth(), height(200)]}>
          {Array.from({ length: PAGE_COUNT }).map((_, i) => (
            <Page
              key={i}
              label={`Page ${i + 1}`}
              color={COLORS[i]}
            />
          ))}
        </HorizontalPager>
        <Row horizontalArrangement={{ spacedBy: 8 }}>
          <Button
            onClick={() =>
              pagerRef.current?.animateScrollToPage(
                Math.max(0, page - 1)
              )
            }>
            <Text>Prev</Text>
          </Button>
          <Button
            onClick={() =>
              pagerRef.current?.animateScrollToPage(
                Math.min(PAGE_COUNT - 1, page + 1)
              )
            }>
            <Text>Next</Text>
          </Button>
          <Button onClick={() => pagerRef.current?.scrollToPage(0)}>
            <Text>Jump to first</Text>
          </Button>
        </Row>
      </Column>
    </Host>
  );
}

const COLORS = [
  '#6200EE',
  '#03DAC5',
  '#FF5722',
  '#4CAF50',
  '#2196F3',
];

function Page({ label, color }: { label: string; color: string }) {
  return (
    <Box
      modifiers={[fillMaxSize(), background(color)]}
      contentAlignment="center">
      <Text color="#FFFFFF" style={{ typography: 'headlineLarge' }}>
        {label}
      </Text>
    </Box>
  );
}
```

### 页面间距与内容内边距

使用 `pageSpacing` 在页面之间添加间隙（滑动时可见），使用 `contentPadding` 内缩分页器，使相邻页面在静止时露出一角。

![分页器页面从屏幕边缘内缩，下一页在右侧露出](/static/images/expo-ui/examples/horizontalpager-layout-android-light.webp)

```tsx PagerLayoutExample.tsx
import {
  Box,
  Host,
  HorizontalPager,
  Text,
} from '@expo/ui/jetpack-compose';
import {
  background,
  fillMaxSize,
  fillMaxWidth,
  height,
} from '@expo/ui/jetpack-compose/modifiers';

export default function PagerLayoutExample() {
  return (
    <Host
      matchContents={{ vertical: true }}
      style={{ width: '100%' }}>
      <HorizontalPager
        pageSpacing={12}
        contentPadding={{ start: 32, end: 32 }}
        modifiers={[fillMaxWidth(), height(180)]}>
        <Page label="Page 1" color="#6200EE" />
        <Page label="Page 2" color="#03DAC5" />
        <Page label="Page 3" color="#FF5722" />
      </HorizontalPager>
    </Host>
  );
}

function Page({ label, color }: { label: string; color: string }) {
  return (
    <Box
      modifiers={[fillMaxSize(), background(color)]}
      contentAlignment="center">
      <Text color="#FFFFFF" style={{ typography: 'headlineLarge' }}>
        {label}
      </Text>
    </Box>
  );
}
```

## API

```tsx
import { HorizontalPager } from '@expo/ui/jetpack-compose';
```
