// 数据转换
function transformDatatype(value) {
    if (typeof value == "number") {
        return value;
    }
    if (typeof value == "string") {
        return `'${value}'`;
    }
}

class RayxNodeSql {
    constructor() {
        this.sql = "";
        this.hasWhere = false;
    }

    /**
     * 删除指定表名中的数据
     * @param {String} tableName
     * @example student => 'delete from student'
     */
    deleteFrom(tableName) {
        this.sql = "delete ";
        this.from(tableName)
        return this;
    }

    /**
     * 根据字段检索
     * @param {Array | String | undefined} columns
     * @example ['age','name'] => 'select age, name'
     */
    select(columns) {
        this.sql = "select ";
        if (typeof columns == "string") {
            this.sql += `${columns} `;
        }
        if (Array.isArray(columns)) {
            if (columns.length < 1) {
                this.sql += "* ";
            } else {
                this.sql += columns.join(",") + " ";
            }
        }
        if (columns == undefined) {
            this.sql += "* ";
        }
        return this;
    }

    /**
     * 更新指定表名
     * @param {String} tableName
     * @example student => 'update student'
     */
    update(tableName) {
        this.sql = `update ${tableName} `;
        return this;
    }

    /**
     * 插入指定表名
     * @param {String} tableName
     * @example student => 'insert into student'
     */
    insert(tableName) {
        this.sql = `insert into ${tableName} `;
        return this;
    }

    /**
     * 指定表名
     * @param {String} tableName
     * @example student => 'from student'
     */
    from(tableName) {
        this.sql += `from ${tableName}`;
        return this;
    }

    /**
     * where条件
     * @param {Array} datas
     * @example [{ key: "id", value: "123", type: "=" }, { key: "name", value: "Json", type: "like" }] => ' where id="123" and name like "Json"'
     */
    where(datas) {
        const whereQuery = this.conditions(datas);
        this.sql += whereQuery ? " where " + whereQuery : "";
        this.hasWhere = true;
        return this;
    }

    /**
     * 或者, 前面有where语句才会起作用
     * @param {Array} datas
     * @example [{ key: "id", value: "123", type: "=" }, { key: "name", value: "Json", type: "like" }] => ' or id="123" and name like "Json"'
     */
    or(datas) {
        if (this.hasWhere) {
            const whereQuery = this.conditions(datas);
            this.sql += whereQuery ? " or " + whereQuery : "";
        }
        return this;
    }

    /**
     * 排序
     * @param {String} name 排序字段 
     * @param {String} type 排序方式
     * @example ('age', 'desc') => ' order by age desc'
     */
    orderBy(name, type = "desc") {
        if (name) {
            this.sql += ` order by ${name} ${type}`;
        }
        return this;
    }

    /**
     * 设置更新的值
     * @param {Object} data 
     * @example { column1: "value1", column2: "value2" } => 'set column1="value1", column2="value2"'
     */
    set(data) {
        let setDatas = [];
        for (let key in data) {
            setDatas.push(`${key}=${transformDatatype(data[key])}`);
        }
        this.sql += `set ${setDatas.join(", ")}`;
        return this;
    }
    columns(columns) {
        if (typeof columns == "string") {
            this.sql += `(${columns}) `;
        }
        if (Array.isArray(columns)) {
            this.sql += `(${columns.join(", ")}) `;
        }
        return this;
    }
    values(values) {
        if (typeof values == "string") {
            this.sql += `values (${values}) `;
        }
        if (Array.isArray(values)) {
            for (let i = 0; i < values.length; i++) {
                values[i] = `${transformDatatype(values[i])}`;
            }
            this.sql += `values (${values.join(", ")}) `;
        }
        return this;
    }

    /**
     * 字段和对应值，
     * @param {Object} data 
     * @example { column1: "value1", column2: "value2" } => '(column1, column2) values ("value1", "value2")'
     */
    columnsWidthValues(data) {
        let columns = [];
        let values = [];
        for (let key in data) {
            columns.push(key);
            values.push(`${transformDatatype(data[key])}`)
        }
        this.sql += `(${columns.join(", ")}) values (${values.join(", ")}) `;
        return this;
    }

    /**
     * 查询条件
     * @param {Array} datas 
     * @example [{ key: "id", value: "123", type: "=" }, { key: "name", value: "Json", type: "like" }] => 'id="123" and name like "Json"'
     */
    conditions(datas) {
        let arr = [];
        for (let i = 0; i < datas.length; i++) {
            const type = datas[i].type;
            const key = datas[i].key;
            const value = datas[i].value;
            if (type == "=") {
                arr.push(`${key}=${transformDatatype(value)}`);
            }
            if (type == "like") {
                arr.push(`${key} like ${transformDatatype(value)}`);
            }
        }
        return arr.join(" and ");
    }
    end() {
        const sql = this.sql + ";";
        this.sql = "";
        this.hasWhere = false;
        return sql;
    }
}


module.exports = RayxNodeSql;