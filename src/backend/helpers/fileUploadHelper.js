// import some npm packages
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Sharp from "sharp";

let imageExtension = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "avif",
  "pjp",
  "svg",
  "heif"
];

// upload single file : code define here
export const uploadSingle = async (file, folder) => {

  let response = {
    message: "Something went wronge at file upload!",
    code: 500,
    data: null,
  };

  try {
    let fileName = null;

    // define target folder
    const dir = `public/media/${folder}/`;

    // it create folder if not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // convert file into buffer value
    const buffer = Buffer.from(await file.arrayBuffer());

    // get id and generate new file name
    let uuid = uuidv4();
    let splitedName = file.name.split(".");
    let extension = splitedName[splitedName.length - 1];
    let newName = `${uuid}.${extension}`;

    fileName = `${newName}`;

    // change the image formate
    if (imageExtension.includes(extension)) {
      await Sharp(buffer).webp({ quality: 30 }).toFile(`${dir}/${uuid}.webp`);
      fileName = `${uuid}.webp`;
    }
    else {
      fs.writeFileSync(`${dir}/${fileName}`, buffer);
    }

    if (fileName != null) {
      response.message = "Successfully upload file";
      response.code = 201;
      response.data = fileName;
    }

  } catch (error) {
    response.message = error.message;
  }

  return response;
};

// upload multiple files : code define here
export const uploadMultiple = async (files, folder) => {

  let response = {
    message: "Something went wronge at files upload!",
    code: 500,
    data: null,
  };

  try {
    let fileNames = [];

    // convert form data into into array of files
    const fileArray = Array.from(files.values());

    // define target folder
    const dir = `public/media/${folder}/`;

    // it create folder if not exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // for each file one by one
    for (const file of fileArray) {
      //

      // convert file into buffer value
      const buffer = Buffer.from(await file.arrayBuffer());

      // get id and generate new file name
      let uuid = uuidv4();
      let splitedName = file.name.split(".");
      let extension = splitedName[splitedName.length - 1];
      let newName = `${uuid}.${extension}`;

      // change the image formate
      if (imageExtension.includes(extension)) {
        await Sharp(buffer).webp({ quality: 30 }).toFile(`${dir}/${uuid}.webp`);
        fileNames.push(`${uuid}.webp`);
      }
      else {
        fs.writeFileSync(`${dir}/${newName}`, buffer);
        fileNames.push(`${newName}`);
      }
    }

    if (fileNames.length) {
      response.message = "Successfully upload file";
      response.code = 201;
      response.data = fileNames;
    }

  } catch (error) {
    return response;
  }

  return response;
};
