const fs = require('fs');

function countValidPassports(input) {
  const validPassportRegex = /(?=.*byr:)(?=.*iyr:)(?=.*eyr:)(?=.*hgt:)(?=.*hcl:)(?=.*ecl:)(?=.*pid:)/s;
  return input
    .split('\n\n')
    .filter(passport => passport.match(validPassportRegex))
    .length;
}

const passports = fs.readFileSync(__dirname + '/input', 'utf8');
console.log(countValidPassports(passports));
