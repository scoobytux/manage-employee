/**
 * Dom manipulation
 */

const getElem = id => document.getElementById(id);

// Input dom
const account = getElem("tknv");
const fullName = getElem("name");
const email = getElem("email");
const password = getElem("password");
const workingDate = getElem("datepicker");
const basicSalary = getElem("luongCB");
const title = getElem("chucvu");
const workingHours = getElem("gioLam");
const keyword = getElem("searchName");

// Output dom
const table = getElem("tableDanhSach");

// Btn dom
const addEmployeeBtn = getElem("btnThemNV");
const updateEmployeeBtn = getElem("btnCapNhat");

//-------------------------------------------------------------------
/**
 * Helpers and initializers
 */
// Initializers
const employeeList = new EmployeeList();
const validation = new Validation();

// Local storage handler
function setLocalStorage() {
  const json = JSON.stringify(employeeList.list);
  localStorage.setItem("employeeList", json);
}

(function getLocalStorage() {
  const json = localStorage.getItem("employeeList");
  if (json) {
    const data = JSON.parse(json);
    employeeList.list = data;
    createTable(employeeList.list);
  }
})();

//-------------------------------------------------------------------
/**
 * Main features
 */

// Create table of employee
function createTable(employeeList) {
  content = "";
  for (let i = 0; i < employeeList.length; ++i) {
    const employee = employeeList[i];
    content += `
      <tr>
        <td>${employee.account}</td>
        <td>${employee.fullName}</td>
        <td>${employee.email}</td>
        <td>${employee.workingDate}</td>
        <td>${employee.title}</td>
        <td>${employee.totalSalary}</td>
        <td>${employee.type}</td>
        <td><button class="btn btn-danger" onclick="deleteEmployee('${employee.account}');">X</button></td>
      <tr>
    `;
  }

  table.innerHTML = content;
}

keyword.addEventListener("keyup", function () {
  const employeeListByType = employeeList.findEmployeeByType(
    keyword.value.trim()
  );
  createTable(
    !employeeListByType.length ? employeeList.list : employeeListByType
  );
});

function isValidEmployeeInfo(
  account,
  fullName,
  email,
  password,
  workingDate,
  basicSalary,
  title,
  workingHours
) {
  let isValid = true;

  // Validate account
  isValid &=
    validation.isValid(
      isEmpty,
      account,
      "tbTKNV",
      "(*) Vui l??ng kh??ng ????? tr???ng t??i kho???n"
    ) &&
    validation.isValid(
      isValidLength,
      account,
      "tbTKNV",
      "(*) T??i kho???n ph???i t??? 4 - 6 k?? s???",
      [4, 6]
    ) &&
    validation.isValid(
      isValidPattern,
      account,
      "tbTKNV",
      "(*) T??i kho???n ph???i l?? s???",
      /^[0-9]+$/
    );

  // Validate employee name
  isValid &=
    validation.isValid(
      isEmpty,
      fullName,
      "tbTen",
      "(*) Vui l??ng kh??ng ????? tr???ng t??n nh??n vi??n"
    ) &&
    validation.isValid(
      isValidPattern,
      fullName,
      "tbTen",
      "(*) T??n nh??n vi??n ph???i l?? ch???",
      "^[a-zA-Z_???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" +
        "???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????" +
        "????????????????????????????????????????????????????????\\s]+$"
    );

  // Validate email
  isValid &=
    validation.isValid(
      isEmpty,
      email,
      "tbEmail",
      "(*) Vui l??ng kh??ng ????? tr???ng email"
    ) &&
    validation.isValid(
      isValidPattern,
      email,
      "tbEmail",
      "Email kh??ng ????ng ?????nh d???ng",
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    );

  // Validate working date
  isValid &=
    validation.isValid(
      isEmpty,
      workingDate,
      "tbNgay",
      "(*) Vui l??ng kh??ng ????? tr???ng ng??y l??m vi???c"
    ) &&
    validation.isValid(
      isValidPattern,
      workingDate,
      "tbNgay",
      "?????nh d???ng ng??y l??m vi???c ph???i l?? dd/mm/yyyy",
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
    );

  // Validate password
  isValid &=
    validation.isValid(
      isEmpty,
      password,
      "tbMatKhau",
      "(*) Vui l??ng kh??ng ????? tr???ng m???t kh???u"
    ) &&
    validation.isValid(
      isValidLength,
      password,
      "tbMatKhau",
      "(*) M???t kh???u ph???i t??? 6 - 10 k?? t???",
      [6, 10]
    ) &&
    validation.isValid(
      isValidPattern,
      password,
      "tbMatKhau",
      "(*) Ch???a ??t nh???t 1 k?? t??? s???, 1 k?? t??? in hoa, 1 k?? t??? ?????c bi???t",
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{0,}$/
    );

  // Validate basic salary
  isValid &=
    validation.isValid(
      isEmpty,
      basicSalary,
      "tbLuongCB",
      "(*) Vui l??ng kh??ng ????? tr???ng l????ng c?? b???n"
    ) &&
    validation.isValid(
      isValidPattern,
      basicSalary,
      "tbLuongCB",
      "(*) L????ng c?? b???n ph???i l?? s???",
      /^[0-9]+$/
    ) &&
    validation.isValid(
      isInValidRange,
      basicSalary,
      "tbLuongCB",
      "(*) L????ng c?? b???n ph???i t??? 1.000.000 - 20.000.000",
      [1000000, 20000000]
    );

  // Validate title
  isValid &= validation.isValid(
    function (value) {
      return value !== "Ch???n ch???c v???";
    },
    title,
    "tbChucVu",
    "(*) Vui l??ng ch???n ch???c v??? h???p l???"
  );

  // Validate working hours
  isValid &=
    validation.isValid(
      isEmpty,
      workingHours,
      "tbGiolam",
      "(*) Vui l??ng kh??ng ????? tr???ng gi??? l??m vi???c"
    ) &&
    validation.isValid(
      isValidPattern,
      workingHours,
      "tbGiolam",
      "(*) Gi??? l??m vi???c ph???i l?? s???",
      /^[0-9]+$/
    ) &&
    validation.isValid(
      isInValidRange,
      workingHours,
      "tbGiolam",
      "(*) Gi??? l??m vi???c ph???i t??? 80 - 200 gi???",
      [80, 200]
    );

  return isValid;
}

function deleteEmployee(account) {
  employeeList.delete(account);
  setLocalStorage();
  createTable(employeeList.list);
}

function getEmployeeInfo() {
  if (
    !isValidEmployeeInfo(
      account.value.trim(),
      fullName.value.trim(),
      email.value.trim(),
      password.value.trim(),
      workingDate.value.trim(),
      basicSalary.value.trim(),
      title.value.trim(),
      workingHours.value.trim()
    )
  )
    return null;

  return new Employee(
    account.value.trim(),
    fullName.value.trim(),
    email.value.trim(),
    password.value.trim(),
    workingDate.value.trim(),
    +basicSalary.value.trim(),
    title.value.trim(),
    +workingHours.value.trim()
  );
}

addEmployeeBtn.addEventListener("click", function () {
  const employee = getEmployeeInfo();
  if (!employee) return;

  const employeeIdx = employeeList.findEmployeeByAccount(employee.account);
  if (employeeIdx !== -1) {
    getElem("tbTKNV").style.display = "block";
    getElem("tbTKNV").innerHTML =
      "(*) Nh??n vi??n v???i account n??y ???? t???n t???i (Account nh??n vi??n l?? duy nh???t)";
    return;
  }

  getElem("tbTKNV").style.display = "none";
  employeeList.add(employee);

  setLocalStorage();
  createTable(employeeList.list);
});

updateEmployeeBtn.addEventListener("click", function () {
  const employee = getEmployeeInfo();
  if (!employee) return;
  const isUpdateSuccess = employeeList.update(employee);
  if (!isUpdateSuccess) {
    getElem("tbTKNV").style.display = "block";
    getElem("tbTKNV").innerHTML = "(*) Kh??ng t???n t???i nh??n vi??n v???i account n??y";
    return;
  }

  getElem("tbTKNV").style.display = "none";

  setLocalStorage();
  createTable(employeeList.list);
});
