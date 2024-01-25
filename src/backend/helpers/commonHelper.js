// function to get current date and time
export function getCurrentDateTime() {
  // target -> "2024-01-03 13:48:41"

  // get current date
  let date = new Date().toLocaleDateString("pt-PT");
  date = date.split("/").reverse().join("-");

  // get current time
  let time = new Date().toLocaleString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // combine date and time
  return `${date} ${time}`;
}
