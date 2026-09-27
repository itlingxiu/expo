---
title: Contacts 包参考
description: 提供手机系统通讯录访问能力的库。
---

# Contacts 包参考

`expo-contacts` 提供对设备系统通讯录的访问，让你可以获取联系人信息，以及添加、编辑或删除联系人。在 iOS 上，联系人具有多层分组系统，你也可以通过此 API 访问。

> 支持平台：Android、iOS、Expo Go。

## 安装

:::tabs
:::tab npm
```sh
npx expo install expo-contacts
```
:::
:::tab yarn
```sh
yarn expo install expo-contacts
```
:::
:::tab pnpm
```sh
pnpm expo install expo-contacts
```
:::
:::tab bun
```sh
bun expo install expo-contacts
```
:::
:::

## 在应用配置中配置

如果你的项目使用配置插件（[持续原生生成（CNG）](/workflow/continuous-native-generation)），可以使用内置的[配置插件](/config-plugins/introduction)来配置 `expo-contacts`。该插件允许你配置若干无法在运行时设置的属性，这些属性需要重新构建应用二进制文件后才会生效。如果应用**没有**使用 CNG，则需要手动配置此库。

```json app.json
{
  "expo": {
    "plugins": [
      [
        "expo-contacts",
        {
          "contactsPermission": "Allow $(PRODUCT_NAME) to access your contacts."
        }
      ]
    ]
  }
}
```

### 可配置属性

| 属性 | 平台 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `contactsPermission` | iOS | `"Allow $(PRODUCT_NAME) to access your contacts"` | 用于设置 [`NSContactsUsageDescription`](#ios) 权限说明的字符串。 |

如果你没有使用持续原生生成（[CNG](/workflow/continuous-native-generation)）（你在手动使用原生 **android** 和 **ios** 项目），则需要在原生项目中配置以下权限：

- 对于 Android，在项目的 **android/app/src/main/AndroidManifest.xml** 中添加 `android.permission.READ_CONTACTS` 和 `android.permission.WRITE_CONTACTS` 权限：

  ```xml
  <uses-permission android:name="android.permission.READ_CONTACTS" />
  <uses-permission android:name="android.permission.WRITE_CONTACTS" />
  ```

- 对于 iOS，在项目的 **ios/[app]/Info.plist** 中添加 `NSContactsUsageDescription` 键：

  ```xml
  <key>NSContactsUsageDescription</key>
  <string>Allow $(PRODUCT_NAME) to access your contacts</string>
  ```

## 用法

<details>
<summary>操作联系人</summary>

```tsx
const contact = await Contact.create({ givenName: 'John', familyName: 'Doe' });
// { givenName: "John", familyName: "Doe"}

await contact.setGivenName('Andrew');
// { givenName: "Andrew", familyName: "Doe"}

await contact.addPhone({ label: 'work', number: '+12345678912' });
// { givenName: "Andrew", familyName: "Doe", phones: [{label: "work", number: "+12345678912"}]}

const phones = await contact.getPhones();
// 只更改已定义的字段，其余保持不变
await contact.patch({ phones: [...phones, { label: 'home', number: '+98765432198' }] });
/*
{
  givenName: "Andrew",
  familyName: "Doe",
  phones: [
    {label: "work", number: "+12345678912"},
    {label: "home", number: "+98765432198"}
  ]
}
*/

// 用对象中定义的字段替换所有字段
await contact.update({ givenName: 'John', familyName: 'Doe' });
// { givenName: "John", familyName: "Doe"}
```

</details>

<details>
<summary>获取联系人</summary>

```tsx
const contactDetails = await Contact.getAllDetails([ContactField.FULL_NAME, ContactField.PHONES], {
  limit: 20,
  offset: 10,
  sortOrder: ContactsSortOrder.GivenName,
});

// 可以从获取到的详情创建 Contact 实例
const contacts = contactDetails.map(item => new Contact(item.id));

const contactsFromGetAll = await Contact.getAll({
  limit: 20,
  offset: 10,
  sortOrder: ContactsSortOrder.GivenName,
});
```

</details>

<details>
<summary>联系人无限滚动示例</summary>

```tsx
import { Contact, ContactField, PartialContactDetails } from 'expo-contacts';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';

const FIELDS = [ContactField.FULL_NAME, ContactField.PHONES] as const;

export default function InfiniteContacts() {
  const [contactDetails, setContactDetails] = useState<PartialContactDetails<typeof FIELDS>[]>([]);

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async () => {
    const newBatch = await Contact.getAllDetails(FIELDS, {
      limit: 20,
      offset: contactDetails.length,
    });
    setContactDetails(prev => [...prev, ...newBatch]);
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contactDetails}
        keyExtractor={item => item.id}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text>{item.fullName}</Text>
            <Text>{item.phones[0]?.number ?? 'No phone number'}</Text>
          </View>
        )}
      />
    </View>
  );
}
```

</details>

<details>
<summary>编辑联系人表单示例</summary>

```tsx
import { Contact, ContactField, ContactPatch } from 'expo-contacts';
import { useEffect, useState } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';

export default function ContactForm() {
  const [contact, setContact] = useState<Contact | null>(null);
  const [contactPatch, setContactPatch] = useState<ContactPatch>({});
  const [newPhoneInput, setNewPhoneInput] = useState('');

  useEffect(() => {
    Contact.getAll({ limit: 1 }).then(async ([first]) => {
      if (first) {
        setContact(first);
        setContactPatch(await first.getDetails([ContactField.GIVEN_NAME, ContactField.PHONES]));
      }
    });
  }, []);

  if (!contactPatch && contact) {
    return <Text style={{ marginTop: 50 }}>Loading details...</Text>;
  }

  const handleChangeName = (text: string) =>
    setContactPatch(prev => ({ ...prev, givenName: text }));

  const handleAddPhone = () => {
    if (!newPhoneInput) {
      return;
    }
    setContactPatch(prev => ({
      ...prev,
      phones: [...(prev.phones || []), { label: 'mobile', number: newPhoneInput }],
    }));
    setNewPhoneInput('');
  };

  const handleRemovePhone = (idx: number) =>
    setContactPatch(prev => ({
      ...prev,
      phones: prev.phones?.filter((_, i) => i !== idx),
    }));

  const handlePatch = async () => {
    if (contact) {
      await contact.patch(contactPatch);
    }
    Alert.alert('Contact patched successfully');
  };

  if (!contact) {
    return <Text style={{ marginTop: 50 }}>Loading...</Text>;
  }

  return (
    <ScrollView style={{ padding: 20, paddingTop: 60 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Edit ID: {contact.id}</Text>

      <Text>Name:</Text>
      <TextInput
        style={{ borderWidth: 1, padding: 5, marginBottom: 10 }}
        value={contactPatch.givenName || ''}
        onChangeText={handleChangeName}
      />

      <Text>Phones:</Text>
      {contactPatch.phones?.map((phone, index) => (
        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 5 }}>
          <Text style={{ flex: 1 }}>{phone.number}</Text>
          <Button title="Remove" onPress={() => handleRemovePhone(index)} />
        </View>
      ))}

      <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 10 }}>
        <TextInput
          style={{ borderWidth: 1, flex: 1, padding: 5, marginRight: 5 }}
          value={newPhoneInput}
          onChangeText={setNewPhoneInput}
          placeholder="New phone..."
        />
        <Button title="Add" onPress={handleAddPhone} />
      </View>

      <Button title="PATCH CONTACT" onPress={handlePatch} />
    </ScrollView>
  );
}
```

</details>

## API

```jsx
import { Contact } from 'expo-contacts';
```

## 权限

### Android

此库会自动为应用添加 `READ_CONTACTS` 和 `WRITE_CONTACTS` 权限：

- `READ_CONTACTS`
- `WRITE_CONTACTS`

### iOS

此库使用以下用途说明键：

- `NSContactsUsageDescription`
