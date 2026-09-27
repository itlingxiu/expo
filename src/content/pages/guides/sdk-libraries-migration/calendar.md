---
title: 迁移到新的 expo-calendar API
description: 从旧版 expo-calendar API 迁移到基于类的新 API，使用 ExpoCalendar、ExpoCalendarEvent 以及各类 hook。
---

# 迁移到新的 expo-calendar API

新的面向对象 `expo-calendar` API 现已稳定。旧版 API 仍可从 `expo-calendar/legacy` 导入使用。请迁移到根路径的 `expo-calendar` 导入，以享受新 API 和后续修复带来的好处。

新 API 将原本接收 ID 的自由函数替换为类实例上的方法。日历、事件、提醒和参与者现在都以类实例表示，并自带各自的方法。主要变化：

- 对日历、事件、提醒和参与者的操作现在改为相应实例上的方法，而不再是接收 ID 的自由函数。
- `createCalendar`、`createEvent` 和 `createReminder` 返回类实例，而不是字符串 ID。

## 安装

安装包含新 `expo-calendar` API 的 SDK 兼容包：

```sh
$ npx expo install expo-calendar
```

## 导入新 API

迁移期间，从 `expo-calendar/legacy` 导入旧 API，同时从 `expo-calendar` 导入新 API：

```ts
// 之前
import * as Calendar from 'expo-calendar/legacy';

// 之后
import { ExpoCalendar, ExpoCalendarEvent } from 'expo-calendar';
```

## 日历

### 创建日历

```ts
// 之前
const calendarId = await Calendar.createCalendarAsync({ title: 'My Calendar', color: '#ff0000' });

// 之后
const calendar = await createCalendar({ title: 'My Calendar', color: '#ff0000' });
```

`createCalendar` 返回一个 `ExpoCalendar` 实例，而不仅仅是 ID。

### 列出日历

```ts
// 之前
const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

// 之后
const calendars = await getCalendars(EntityTypes.EVENT);
```

### 按 ID 获取日历

```ts
// 之前
// 没有直接对应的 API，此前需要从 getCalendarsAsync 的结果中过滤

// 之后
const calendar = await ExpoCalendar.get(calendarId);
```

### 更新日历

```ts
// 之前
await Calendar.updateCalendarAsync(calendarId, { title: 'Renamed' });

// 之后
await calendar.update({ title: 'Renamed' });
```

### 删除日历

```ts
// 之前
await Calendar.deleteCalendarAsync(calendarId);

// 之后
await calendar.delete();
```

### 获取默认日历（仅 iOS）

```ts
// 之前
const calendar = await Calendar.getDefaultCalendarAsync();

// 之后
const calendar = getDefaultCalendarSync();
```

### 显示日历选择器（仅 iOS）

```ts
// 之前
// 没有对应的 API

// 之后
const calendar = await presentPicker();
if (calendar) {
  // 用户选择了一个日历
}
```

如果应用用户未选择日历便关闭了选择器，`presentPicker` 会返回 `null`。

## 事件

### 创建事件

```ts
// 之前
const eventId = await Calendar.createEventAsync(calendarId, {
  title: 'Lunch',
  startDate,
  endDate,
});

// 之后
const event = await calendar.createEvent({ title: 'Lunch', startDate, endDate });
```

`createEvent` 返回一个 `ExpoCalendarEvent` 实例，而不仅仅是 ID。

### 列出日历中的事件

```ts
// 之前
const events = await Calendar.getEventsAsync([calendarId], startDate, endDate);

// 之后
const events = await calendar.listEvents(startDate, endDate);
```

### 列出多个日历中的事件

```ts
// 之前
const events = await Calendar.getEventsAsync([id1, id2], startDate, endDate);

// 之后
const events = await listEvents([calendar1, calendar2], startDate, endDate);
```

### 按 ID 获取事件

```ts
// 之前
const event = await Calendar.getEventAsync(eventId);

// 之后
const event = await ExpoCalendarEvent.get(eventId);
```

### 更新事件

```ts
// 之前
await Calendar.updateEventAsync(eventId, { title: 'Lunch with Alex' });

// 之后
await event.update({ title: 'Lunch with Alex' });
```

旧版 `updateEventAsync` 接受 `recurringEventOptions`（仅 iOS），用于指定重复事件中的某一次发生或之后的多次发生。新 API 不支持此参数——`update()` 始终修改整个重复事件系列。

### 删除事件

```ts
// 之前
await Calendar.deleteEventAsync(eventId);

// 之后
await event.delete();
```

旧版 `deleteEventAsync` 接受 `recurringEventOptions`（仅 iOS），用于指定重复事件中的某一次发生或之后的多次发生。新 API 不支持此参数——`delete()` 始终删除整个重复事件系列。

### 在日历中打开事件

```ts
// 之前
await Calendar.openEventInCalendarAsync(params);

// 之后
await event.openInCalendar(params);
```

`id` 字段不再是参数的一部分——它取自事件实例。展示选项（`allowsEditing`、`allowsCalendarPreview`、`startNewActivityTask`）现在与其余参数放在同一个 params 对象中传递，而不是作为单独的参数。

### 用原生表单编辑事件

```ts
// 之前
await Calendar.editEventInCalendarAsync(params);
// 或者，通过表单创建新事件
await Calendar.createEventInCalendarAsync({ title, startDate, endDate });

// 之后
await event.editInCalendar(params);
// 或者，通过表单创建新事件
await calendar.addEventWithForm({ title, startDate, endDate });
```

`id` 字段不再是参数的一部分——它取自事件实例。展示选项（`startNewActivityTask`）现在与其余参数放在同一个 params 对象中传递，而不是作为单独的参数。

### 获取重复事件的单次发生

```ts
// 之前
const event = await Calendar.getEventAsync(eventId, { instanceStartDate });

// 之后
const event = await ExpoCalendarEvent.get(eventId);
const occurrence = event.getOccurrenceSync({ instanceStartDate });
```

## 参与者

### 获取事件的参与者

```ts
// 之前
const attendees = await Calendar.getAttendeesForEventAsync(eventId);

// 之后
const attendees = await event.getAttendees();
```

### 添加参与者

```ts
// 之前
const attendeeId = await Calendar.createAttendeeAsync(eventId, {
  email: 'alex@example.com',
  name: 'Alex',
  role: Calendar.AttendeeRole.ATTENDEE,
  type: Calendar.AttendeeType.PERSON,
  status: Calendar.AttendeeStatus.ACCEPTED,
});

// 之后
const attendee = await event.createAttendee({ email: 'alex@example.com', name: 'Alex' });
```

### 更新参与者（仅 Android）

```ts
// 之前
await Calendar.updateAttendeeAsync(attendeeId, { name: 'Alexander' });

// 之后
await attendee.update({ name: 'Alexander' });
```

### 删除参与者（仅 Android）

```ts
// 之前
await Calendar.deleteAttendeeAsync(attendeeId);

// 之后
await attendee.delete();
```

## 提醒（仅 iOS）

### 创建提醒

```ts
// 之前
const reminderId = await Calendar.createReminderAsync(calendarId, { title: 'Buy milk' });

// 之后
const reminder = await calendar.createReminder({ title: 'Buy milk' });
```

`createReminder` 返回一个 `ExpoCalendarReminder` 实例，而不仅仅是 ID。

### 列出提醒

```ts
// 之前
const reminders = await Calendar.getRemindersAsync([calendarId], status, startDate, endDate);

// 之后
const reminders = await calendar.listReminders(startDate, endDate, status);
```

### 按 ID 获取提醒

```ts
// 之前
const reminder = await Calendar.getReminderAsync(reminderId);

// 之后
const reminder = await ExpoCalendarReminder.get(reminderId);
```

### 更新提醒

```ts
// 之前
await Calendar.updateReminderAsync(reminderId, { title: 'Buy oat milk' });

// 之后
await reminder.update({ title: 'Buy oat milk' });
```

### 删除提醒

```ts
// 之前
await Calendar.deleteReminderAsync(reminderId);

// 之后
await reminder.delete();
```

## 数据源

```ts
// 之前
const sources = await Calendar.getSourcesAsync();

// 之后
const sources = getSourcesSync();
```

`getSourcesAsync` 已被同步的 `getSourcesSync` 取代。新 API 中没有按 ID 获取单个数据源的直接对应方法。

## 权限

```ts
// 之前
await Calendar.requestCalendarPermissionsAsync();
await Calendar.getCalendarPermissionsAsync();
await Calendar.requestRemindersPermissionsAsync();
await Calendar.getRemindersPermissionsAsync();

// 之后
await requestCalendarPermissions();
await getCalendarPermissions();
await requestRemindersPermissions();
await getRemindersPermissions();
```

`useCalendarPermissions` 和 `useRemindersPermissions` hook 保持不变。

## 破坏性语义变更

- 日历、事件、提醒和参与者现在都是类实例。对它们的操作改为实例上的方法，而不再是接收 ID 的自由函数。如果手头只有 ID，请使用对应的 `.get(id)` 静态方法获取实例。
- `createCalendar`、`createEvent` 和 `createReminder` 返回类实例，而不是字符串 ID。
- `Async` 后缀已移除。该库的大部分 API 都是异步的——只有同步函数才使用 `Sync` 后缀（例如 `getDefaultCalendarSync`、`getSourcesSync`、`getOccurrenceSync`）。
- `getSourcesAsync` 已被同步的 `getSourcesSync` 取代。按 ID 获取单个数据源没有直接的对应方法。
- `createEventInCalendarAsync` 已重命名为 `calendar.addEventWithForm`。
- `openEventInCalendar`（即发即忘的同步版本）已移除，请改用 `event.openInCalendar()`。
- 参与者操作现在也是实例方法：创建参与者通过 `ExpoCalendarEvent` 实例上的 `event.createAttendee()` 完成；更新和删除则是返回的 `ExpoCalendarAttendee` 实例上的方法。

## 参考

有关 expo-calendar 的完整 API 参考，请参阅 [Calendar](/versions/latest/sdk/calendar)。
