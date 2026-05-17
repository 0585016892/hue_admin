const chuSo = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"];

function doc3So(num) {
  let tram = Math.floor(num / 100);
  let chuc = Math.floor((num % 100) / 10);
  let donvi = num % 10;

  let result = "";

  if (tram > 0) {
    result += chuSo[tram] + " trăm ";
  }

  if (chuc > 1) {
    result += chuSo[chuc] + " mươi ";
    if (donvi > 0) result += chuSo[donvi];
  } else if (chuc === 1) {
    result += "mười ";
    if (donvi > 0) result += chuSo[donvi];
  } else if (chuc === 0 && donvi > 0) {
    if (tram > 0) result += "lẻ ";
    result += chuSo[donvi];
  }

  return result.trim();
}

export function numberToVietnamese(n) {
  if (!n) return "không đồng";

  const units = ["", "nghìn", "triệu", "tỷ"];

  let i = 0;
  let result = "";

  while (n > 0) {
    let part = n % 1000;

    if (part > 0) {
      result = doc3So(part) + " " + units[i] + " " + result;
    }

    n = Math.floor(n / 1000);
    i++;
  }

  return result.trim() + " đồng";
}