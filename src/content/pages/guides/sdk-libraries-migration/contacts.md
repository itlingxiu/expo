---
title: 迁移到新的 expo-contacts API
description: 从旧版 expo-contacts API 迁移到基于类的新 expo-contacts API，使用 Contact 类。
---

# 迁移到新的 expo-contacts API

新的基于类的 `expo-contacts` API 现已稳定。旧版 API 仍可从 `expo-contacts/legacy` 导入使用。请迁移到根路径的 `expo-contacts` 导入，以享受新 API 和后续修复带来的好处。

新 API 用 `Contact` 类取代了基于函数的 API。联系人现在以类实例表示，实例只持有原生联系人的 ID。主要变化：

- 联系人属性（姓名、公司、生日等）现在是异步 getter 和 setter，而不再是普通对象属性。
- 子记录（电话、邮箱、地址……）通过专用的 `add*`/`get*`/`update*`/`delete*` 方法管理，而不再重写整个数组。
- 现在提供两个更新方法：`patch` 用于部分更新，`update` 用于整体替换。

## 安装

安装 SDK 兼容包：

```sh
$ npx expo install expo-contacts
```

## 导入新 API

从 `expo-contacts` 导入：

```ts
import { Contact } from 'expo-contacts';
```

## 联系人

### 创建联系人

```ts
// 之前
const id = await Contacts.addContactAsync({ firstName: 'John', lastName: 'Doe' });

// 之后
const contact = await Contact.create({ givenName: 'John', familyName: 'Doe' });
```

`Contact.create` 返回一个 `Contact` 实例，而不仅仅是 ID。

### 获取所有联系人

```ts
// 之前
const { data } = await Contacts.getContactsAsync({
  fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  pageSize: 20,
  pageOffset: 10,
  sort: Contacts.SortTypes.FirstName,
});

// 之后，返回实例对象
const contacts = await Contact.getAll({
  limit: 20,
  offset: 10,
  sortOrder: ContactsSortOrder.GivenName,
});

// 之后，带类型的字段投影
const contacts = await Contact.getAllDetails([ContactField.FULL_NAME, ContactField.PHONES], {
  limit: 20,
  offset: 10,
});
```

`getAllDetails` 返回强类型投影，结果类型会收窄到所请求的字段。

### 按 ID 获取联系人

`getAllDetails` 的结果包含联系人 ID。如果想对 `getAllDetails` 返回的联系人调用方法，请用构造函数将它包装成 `Contact` 实例：

```ts
const results = await Contact.getAllDetails([ContactField.FULL_NAME, ContactField.PHONES]);
const contact = new Contact(results[0].id);
await contact.addPhone({ label: 'work', number: '+12345678912' });
```

### 统计联系人数量

```ts
// 之前
const hasAny = await Contacts.hasContactsAsync();

// 之后
const hasAny = await Contact.hasAny();

// 之后，此方法此前没有直接对应的 API
const count = await Contact.getCount();
```

### 更新联系人

```ts
// 之前，重写整个联系人
await Contacts.updateContactAsync({ ...contact, firstName: 'Andrew' });

// 之后，部分更新（只修改提供的字段）
await contact.patch({ givenName: 'Andrew' });

// 之后，整体替换——所有未提供的字段都会被清空
await contact.update({
  givenName: 'John',
  familyName: 'Doe',
  phones: [{ label: 'mobile', number: '+12123456789' }],
});
```

### 删除联系人

```ts
// 之前
await Contacts.removeContactAsync(id);

// 之后
await contact.delete();
```

## 标量字段

所有标量联系人属性现在都是异步 getter 和 setter。用 `get*` 读取，用 `set*` 写入。你也可以通过 `contact.getDetails()` 一次获取多个字段。

| 字段                  | 读取方法               | 写入方法               |
| --------------------- | ---------------------- | ---------------------- |
| 名                    | `getGivenName`         | `setGivenName`         |
| 姓                    | `getFamilyName`        | `setFamilyName`        |
| 中间名                | `getMiddleName`        | `setMiddleName`        |
| 全名                  | `getFullName`          | 无                     |
| 昵称（仅 iOS）        | `getNickname`          | `setNickname`          |
| 称谓前缀              | `getPrefix`            | `setPrefix`            |
| 称谓后缀              | `getSuffix`            | `setSuffix`            |
| 名字拼音              | `getPhoneticGivenName` | `setPhoneticGivenName` |
| 姓氏拼音              | `getPhoneticFamilyName`| `setPhoneticFamilyName`|
| 公司                  | `getCompany`           | `setCompany`           |
| 职位                  | `getJobTitle`          | `setJobTitle`          |
| 部门                  | `getDepartment`        | `setDepartment`        |
| 生日（仅 iOS）        | `getBirthday`          | `setBirthday`          |
| 备注                  | `getNote`              | `setNote`              |
| 图片                  | `getImage`             | `setImage`             |
| 缩略图                | `getThumbnail`         | 无                     |
| 收藏（仅 Android）    | `getIsFavourite`       | `setIsFavourite`       |

### 姓名

```ts
// 之前，通过 getContactByIdAsync 获取联系人
const contact = await Contacts.getContactByIdAsync(id);
console.log(contact.firstName, contact.lastName);

// 之后，使用单个异步 getter
const givenName = await contact.getGivenName();
const familyName = await contact.getFamilyName();

// 之后，通过 getDetails() 获取全名对象
const details = await contact.getDetails([ContactField.FULL_NAME]);

await contact.setGivenName('John');
await contact.setFamilyName('Doe');
await contact.setMiddleName('Michael');
```

## 子记录

子记录不再通过 `updateContactAsync` 重写整个数组来管理。每种类型都有专用的 `add*`、`get*`、`update*` 和 `delete*` 方法：

| 子记录                  | 方法                                                                                  |
| ----------------------- | ------------------------------------------------------------------------------------- |
| 电话号码                | `addPhone`、`getPhones`、`updatePhone`、`deletePhone`                                 |
| 邮箱                    | `addEmail`、`getEmails`、`updateEmail`、`deleteEmail`                                 |
| 地址                    | `addAddress`、`getAddresses`、`updateAddress`、`deleteAddress`                        |
| 网址                    | `addUrlAddress`、`getUrlAddresses`、`updateUrlAddress`、`deleteUrlAddress`            |
| 社交资料                | `addSocialProfile`、`getSocialProfiles`、`updateSocialProfile`、`deleteSocialProfile` |
| IM 地址                 | `addImAddress`、`getImAddresses`、`updateImAddress`、`deleteImAddress`                |
| 日期                    | `addDate`、`getDates`、`updateDate`、`deleteDate`                                     |
| 附加姓名（仅 Android）  | `addExtraName`、`getExtraNames`、`updateExtraName`、`deleteExtraName`                 |

以下示例以电话号码为例。

```ts
// 之前，重写整个数组
await Contacts.updateContactAsync({
  ...contact,
  phoneNumbers: [...existing, { label: 'work', number: '+12345678912' }],
});

// 之后，添加
await contact.addPhone({ label: 'work', number: '+12345678912' });

// 之后，获取
const phones = await contact.getPhones();

// 之后，更新
await contact.updatePhone(existingPhone);

// 之后，删除
await contact.deletePhone(existingPhone);
```

## 原生 UI

```ts
// 之前
const contact = await Contacts.presentContactPickerAsync();
await Contacts.presentFormAsync(null, contactData, { isNew: true });
await Contacts.presentFormAsync(contactId);

// 之后
const contact = await Contact.presentPicker();
if (contact) {
  // 用户选择了一个联系人
}
const created = await Contact.presentCreateForm(contactData);
await contact.editWithForm();
```

### 访问选择器（仅 iOS 18+）

```ts
// 之前
const contactIds = await Contacts.presentAccessPickerAsync();

// 之后
const selectedContacts = await Contact.presentAccessPicker();
```

## 群组（仅 iOS）

```ts
// 之前
const groups = await Contacts.getGroupsAsync({});
await Contacts.createGroupAsync('Family');
await Contacts.addExistingContactToGroupAsync(contactId, groupId);
await Contacts.removeContactFromGroupAsync(contactId, groupId);

// 之后
const groups = await Group.getAll();
const group = await Group.create('Family');
await group.addContact(contact);
await group.removeContact(contact);
const contacts = await group.getContacts();
const name = await group.getName();
await group.setName('Close Friends');
await group.delete();
```

## 容器（仅 iOS）

```ts
// 之前
const containers = await Contacts.getContainersAsync({});
const defaultId = await Contacts.getDefaultContainerIdAsync();

// 之后
const containers = await Container.getAll();
const defaultContainer = await Container.getDefault(); // 可能为 null
const name = await container.getName();
const type = await container.getType();
const groups = await container.getGroups();
const contacts = await container.getContacts();
```

## 权限

```ts
// 之前
const { status } = await Contacts.requestPermissionsAsync();
const { status } = await Contacts.getPermissionsAsync();

// 之后
const { status } = await requestPermissionsAsync();
const { status } = await getPermissionsAsync();
```

## 监听变化

```ts
// 之前
const subscription = Contacts.addContactsChangeListener(() => {
  // 联系人发生变化
});
subscription.remove();

// 之后
const subscription = addContactsChangeListener(() => {
  // 联系人发生变化
});
subscription.remove();

// 一次性移除所有监听器
removeAllContactsChangeListeners();
```

## 破坏性语义变更

- 字段名遵循平台惯例。例如，`firstName`/`lastName` 变成了 `givenName`/`familyName`。
- 字段选择使用带类型的 `ContactField` 枚举。`getAllDetails` 的结果类型会收窄到所请求的字段。
- `Async` 后缀已移除。整个库都是异步的。
- 联系人属性现在是异步 getter 和 setter，而不再是联系人对象上的普通属性。使用 `contact.getDetails()` 可一次获取多个字段。
- 子记录（电话、邮箱、地址……）通过专用的 `add*`/`get*`/`update*`/`delete*` 方法管理，而不再通过 `updateContactAsync` 重写整个数组。
- 两个更新方法取代了 `updateContactAsync`：`patch` 应用部分修改，`update` 替换整个联系人。
- `shareContactAsync` 和 `writeContactToFileAsync` 已被移除，且没有替代方法。你可以放心删除对这两个函数的所有调用。

## 参考

有关 expo-contacts 的完整 API 参考，请参阅 [Contacts](/versions/latest/sdk/contacts)。
