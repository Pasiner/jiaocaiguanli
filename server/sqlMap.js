// sql语句
var sqlMap = {
  user: {
    // 添加用户
    add: 'insert into user(name, email,password,type) values (?, ?, ?,?)',
    // 查询用户
    select: 'select * from user where name = ? ',
    // 查询用户用于注册判断
    select_like: 'select * from user where name = ? or email =? ',
    // 查验证码
    selectcode: 'select code from user where name = ?',
    // 修改密码
    updatepass: 'update user set password= ? where name=?'

    // 查询书籍
    // select: 'select * from Book where name like "%"?"%"',
    // 添加书籍
    // select: 'select * from bookname where name like '
    // 删除书籍
  },
  book: {
    // 查询书籍
    select: 'select * from book where name like "%"?"%"',
    // 添加书籍
    add: 'insert into book(name, master, book, introduction, content, picture) values (?, ?, ?, ?, ?, ?)',
    // 删除书籍
    delete: 'delete from book where id = ?',
    // 修改书籍
    update: 'update book set name= ? ,master= ?, book= ?, introduction= ?, content= ?, picture= ? where id = ? '

  }
}

module.exports = sqlMap
