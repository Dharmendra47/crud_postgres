const client = require("../Database/dataBase");
const catchAsync = require("../Utils/catchAsync");
const AppError = require("../Utils/appError");
const bcrypt = require("bcrypt");

exports.create = async (userData) => {
  const { email, name, city, role } = userData;
  const user = await client.query("SELECT * FROM students WHERE email=$1", [
    email,
  ]);
  if (user.rowCount == 0) {
    const password = await bcrypt.hash(userData.password, 12);
    console.log(role);
    const data = await client.query(
      "INSERT INTO students(email,name,password,city,role) VALUES($1,$2,$3,$4,$5) RETURNING *",
      [email, name, password, city, role]
    );
    return data ? data.rows : false;
  } else {
    throw new AppError("User Allready Exist", 404);
  }
};

exports.loggedIn = async (userData) => {
  const data = await client.query("SELECT * FROM students WHERE email=$1", [
    userData.email,
  ]);
  if (
    !data.rowCount ||
    !(await bcrypt.compare(userData.password, data.rows[0].password))
  )
    throw new AppError("invalid credintical ", 415);
  return data.rows[0];
};

exports.getAlluser = async () => {
  const data = await client.query(
    "SELECT id,name,email,city FROM students WHERE isdeleted = 'false' "
  );
  return data.rowCount ? data.rows : false;
};

exports.getUserid = async (id) => {
  const data = await client.query(
    "SELECT id,name,email,city FROM students WHERE id = $1 and isdeleted = 'false'",
    [id]
  );
  return data.rowCount ? data.rows : false;
};

exports.updateById = async (id, userData) => {
  const { email, name } = userData;
  const user = await client.query(
    "SELECT * FROM students WHERE id=$1 and isdeleted='false' ",
    [id]
  );
  if (user.rowCount) {
    const data = await client.query(
      "UPDATE students SET name=$2,email=$3 WHERE id = $1",
      [id, name, email]
    );
    return data.rowCount || false;
  }
};

exports.deleteById = async (id) => {
  const user = await client.query(
    "SELECT * FROM students WHERE id=$1 and isdeleted='false' ",
    [id]
  );
  if (user.rowCount) {
    const data = await client.query(
      "UPDATE students SET isdeleted='true' WHERE id = $1",
      [id]
    );
    return data.rowCount || false;
  }
};
