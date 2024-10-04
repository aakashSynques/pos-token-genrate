export const padZeroToMonth = (date) => {
  return date.replace(/-(\d)-/, (match, p1) => `-${p1.padStart(2, "0")}-`);
};
export const getday = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${day}`;
};

export const getYear = () => {
  const date = new Date();
  const year = date.getFullYear();

  const shortYear = year % 100;

  return `${shortYear}`;
};

export const formatDateTimePrint = (dateString) => {
  const date = new Date(dateString.replace(" ", "T"));

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day}-${month}-${year} ${String(hours).padStart(
    2,
    "0"
  )}:${minutes} ${ampm}`;
};

