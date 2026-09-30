import { File, Directory, Paths } from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";

// create directory
const codeStoreDir = new Directory(Paths.document, "CodeStore");

// create file inside directory
export const createFile = (name, type) => {
  const file = new File(codeStoreDir, `${name}.${type}`);
  if (!file.exists) {
    file.create({ intermediates: true }); // intermediates: true ka matlab hai agar CodeStore parent directory missing hai, to usse bhi create kar do.
  } else {
    console.log("File already exists");
  }
  return file.uri;
};

// Write File
export const writeFile = (fileUri, data) => {
  try {
    const file = new File(fileUri);
    file.write(data);
  } catch (error) {
    console.log(error);
  }
};

// read file
export const readFile = (fileUri) => {
  const file = new File(fileUri);
  return file.text();
};

// read directory
export const readDir = () => {
  try {
    const fileList = codeStoreDir.list();
    return fileList;
  } catch (error) {
    console.log(error);
  }
};

// Delete File
export const deleteFile = (fileUri) => {
  const file = new File(fileUri);
  file.delete();
};

// pickFile file
export const pickFile = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/png", "image/jpg"],
      copyToCacheDirectory: true,
    });

    if (result.canceled) return null;

    return result.assets[0];
  } catch (error) {
    console.log("Pick file error:", error);
    return null;
  }
};

export const copyImportedFile = async (selectedFile, finalName) => {
  try {
    if (!codeStoreDir.exists) {
      codeStoreDir.create({ intermediates: true });
    }

    const destinationFile = new File(codeStoreDir, finalName);

    const sourceFile = new File(selectedFile.uri);
    sourceFile.copy(destinationFile);

    return destinationFile;
  } catch (error) {
    console.log("Copy file error:", error);
    return null;
  }
};

// Share File
export const shareFile = async (uri) => {
  try {
    const available = await Sharing.isAvailableAsync();

    if (!available) {
      console.log("Sharing is not available");
      return;
    }

    await Sharing.shareAsync(uri, { dialogTitle: "Share file" });
  } catch (error) {
    console.log("Share file error:", error);
  }
};

export const openPdf = async (uri) => {
  try {
    const file = new File(uri);

    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: file.contentUri,
      flags: 1,
      type: "application/pdf",
    });
  } catch (error) {
    console.log("Open PDF error:", error);
  }
};
