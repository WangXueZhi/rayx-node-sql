# rayx-node-sql
node中拼接sql语句的工具类。

通常我们会写好多逻辑判断来拼接sql语句，这样会造成两个问题，1. 可读性和语义性太差，因为代码里可能穿插了很多处理查询条件的逻辑；2. 代码量，代码逻辑导致代码管理成本增加。

所以，这个工具类是为了解决这个问题，使你在处理sql语句时，语义清晰，代码量少

# 安装

```
npm i rayx-node-sql --save
```

# 使用

```javascript
const RayxNodeSql = require('rayx-node-sql')
const sql = new RayxNodeSql()

// 增
const insertSql = sql.insert("tableName")
        .columnsWidthValues({ column1: "value1", column2: "value2" })
        .end();
// => insert into tableName (column1, column2) values ("value1", "value2")

// 删
const deleteSql = sql.deleteFrom("tableName")
        .where([{ key: "id", value: "123", type: "=" }])
        .end();
// => delete from tableName where id='123'

// 改
const updateSql = sql.update("tableName")
        .set({
            is_delete: 1
        })
        .where([{ key: "id", value: 123, type: "=" }])
        .end();
// => update tableName set is_delete=1 where id=123

// 查
const selectSql = sql.select("*")
        .from("tableName")
        .where([{ key: "id", value: 123, type: "=" }])
        .end();
// => select * from tableName where id=123

// 排序
const selectSql = sql.select(["name","age"])
        .from("tableName")
        .where([{ key: "id", value: 123, type: "=" }])
        .orderBy("age").end();
// => select name,age from tableName where id=123 order by age desc
```

# 说明
end方法表示结束拼接，返回拼接后的字符串，并重置内部的拼接记录