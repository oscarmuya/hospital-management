import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebase";

export function generateCombinations(s: string) {
  s = s.toLowerCase();
  const groups = 3;
  var res: string[] = [];
  if (s.length === groups) return [s];
  for (let i = groups; i <= s.length; i++) {
    res.push(s.slice(0, i));
    if (s.length - i >= 1) res.push(s.slice(i - (groups - 1), s.length));
  }
  return res;
}

//formart date to readable date
export function dateFormatter(date: any) {
  // @ts-ignore
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval < 1) {
    return timeSince(date);
  }
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${da}-${mo}-${ye}`;
}

//convert to time ago
function timeSince(date: any) {
  // @ts-ignore
  var seconds = Math.floor((new Date() - date) / 1000);
  var interval = seconds / 31536000;
  if (interval > 1) {
    return Math.floor(interval) > 1
      ? Math.floor(interval) + " years ago"
      : Math.floor(interval) + " year ago";
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) > 1
      ? Math.floor(interval) + " months ago"
      : Math.floor(interval) + " month ago";
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) > 1
      ? Math.floor(interval) + " days ago"
      : Math.floor(interval) + " day ago";
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) > 1
      ? Math.floor(interval) + " hours ago"
      : Math.floor(interval) + " hour ago";
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) > 1
      ? Math.floor(interval) + " minutes ago"
      : Math.floor(interval) + " minute ago";
  }
  return Math.floor(seconds) > 1
    ? Math.floor(seconds) + " seconds ago"
    : Math.floor(seconds) + " second ago";
}

export function isEmptyOrSpaces(str: string) {
  return str === null || str.match(/^ *$/) !== null;
}

/**
 *
 * @param length length of random string
 * @returns random string of specified length
 */
export function makeid(length = 50) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getChatTime(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const amPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

  return `${formattedHours}:${formattedMinutes} ${amPm}`;
}

//formart date to readable date
export function exactDateFormatter(date: number | Date | undefined) {
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);
  return `${da} ${mo} ${ye}`;
}

export function getChatDate(date: Date) {
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(date);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(date);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(date);

  return mo + " " + da + ", " + ye;
}

export const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 *
 * @param image image uri
 * @param path path to folder of image
 * @returns download url
 */

export function uploadImage(image: string, path: string) {
  return new Promise<string>(async (resolve, reject) => {
    const response = await fetch(image);
    const blob = await response.blob();
    const imageRef = ref(
      storage,
      `${path}/${makeid()}-${new Date().toString()}.jpg`
    );
    uploadBytes(imageRef, blob)
      .then(() => {
        getDownloadURL(imageRef)
          .then((res) => {
            resolve(res);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

export function getFileNameFromStorageLink(storageLink: string) {
  const pathParts = storageLink.split("/");
  const fileNameWithParams = pathParts[pathParts.length - 1];
  const fileNameParts = fileNameWithParams.split("?")[0].split("%2F");
  const fileName = decodeURIComponent(fileNameParts[fileNameParts.length - 1]);

  return fileName;
}

export const uploadFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const imageLoc = ref(
      storage,
      `uploads/${new Date().toString()}-${file.name}`
    );

    uploadBytes(imageLoc, file)
      .then((photo) => {
        getDownloadURL(photo.ref)
          .then((file) => {
            resolve(file);
          })
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
};

export function getDateOneMonthBeforeToday(): string {
  const today = new Date();
  today.setMonth(today.getMonth() - 1);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getTodayStringDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function pickElementsFromArray(
  arr: any[],
  startIndex: number,
  endIndex: number
) {
  return arr.slice(startIndex, endIndex + 1);
}
