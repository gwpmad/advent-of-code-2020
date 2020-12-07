const fs = require('fs');

function countValidPassports(input) {
  return input
    .split('\n\n')
    .reduce((count, passport) => {
      const fields = passport.split(/\n| /);
      return validateFields(fields) ? count + 1 : count;
    }, 0);
}

function validateFields(fields) {
  const fieldsMap = fields.reduce((map, field) => {
    const [key, value] = field.split(':');
    map[key] = value;
    return map;
  }, {});

  if (fields.length < 7 || (fields.length === 7 && fieldsMap.cid)) return false;

  return checkByr(fieldsMap.byr)
    && checkIyr(fieldsMap.iyr)
    && checkEyr(fieldsMap.eyr)
    && checkHgt(fieldsMap.hgt)
    && checkHcl(fieldsMap.hcl)
    && checkEcl(fieldsMap.ecl)
    && checkPid(fieldsMap.pid);
}

function checkByr(byr) {
  const numericByr = Number(byr);
  return numericByr >= 1920 && numericByr <= 2002;
}

function checkIyr(iyr) {
  const numericIyr = Number(iyr);
  return numericIyr >= 2010 && numericIyr <= 2020;
}

function checkEyr(eyr) {
  const numericEyr = Number(eyr);
  return numericEyr >= 2020 && numericEyr <= 2030;
}

function checkHgt(hgt) {
  const metric = hgt.slice(-2);
  const numericHgt = hgt.slice(0, hgt.length - 2);
  if (metric === 'cm') return numericHgt >= 150 && numericHgt <= 193;
  if (metric === 'in') return numericHgt >= 59 && numericHgt <= 76;
}

function checkHcl(hcl) {
  return !!hcl.match(/^#[a-z0-9]{6}$/);
}

function checkEcl(ecl) {
  return !!ecl.match(/^((amb)|(blu)|(brn)|(gry)|(grn)|(hzl)|(oth))$/);
}

function checkPid(pid) {
  return !!pid.match(/^[0-9]{9}$/);
}

const passports = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(countValidPassports(passports));
