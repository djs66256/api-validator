# api-validator

最初想法是基于`typescript`的强类型检查来检查JSON数据格式的正确性，但是由于数据之间的关联性，所以整个工作量太大，暂时弃坑，这里说一下这个想法。


#### Idea

比如有一段json数据表示User

```json
{
  "id": "1243",
  "name": "daniel",
  "gender": {
    "type": 1,
    "description": "male"
  }
}
```

或者有这样的数据：

```json
[
{
  "type": 1,
  "title": "xxxx"
},
{
  "type": 2,
  "image": "xxxxx"
}
]
```

怎么去校验数据的正确性呢？

目前大部分的接口工具能够定义详细的内容类型，但是难以定义多变的数据类型，比如可选(string|number)，是否可以为空(string|null)，以及列表内容的多样性([title|image])

恰好typescript给我们提供了这个功能，但是typescript是一种静态类型检查，不能直接用来检测数据，所以需要调用其编译服务。

```typescript
interface User {
  id: string|number
  name: string
  gender?: {
    type: number,
    description: string
  }
}
```

```typescript
interface title {
  type: 1
  title: string
}

interface image {
  type: 2
  image: string
}

let list = [title|image]
```
