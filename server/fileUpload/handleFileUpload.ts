import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/app/lib/S3/client";
import { createFile } from "../db/db";

let userId = "";
const bucket = process.env.NEXT_PUBLIC_BUCKET_NAME!;
const region = process.env.NEXT_PUBLIC_AWS_REGION!;

export async function handleFileUpload(formData: FormData, user_Id: string) {
  const file = formData.get("file") as File;
  userId = user_Id;
  const folderId = formData.get("folderId") as string | null;
  const { key, response } = await uploadFileToS3(file);
  const folderData = await createFile(fileObject(file, key, folderId!));
  return { folderData, response };
}

const uploadFileToS3 = async (file: File) => {
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const timestamp = Date.now();
  const key = `${userId}-${timestamp}-${file.name}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: fileBuffer,
    ContentType: file.type,
  });

  try {
    const response = await s3.send(command);
    console.log("File uploaded successfully:", response);
    return { key, response };
  } catch (err) {
    console.error("S3 upload failed", err);
    throw new Error("Upload to S3 failed");
  }
};

const fileObject = (file: File, key: string, folder_id: string) => {
  const publicUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
  const fileData = {
    name: file.name!,
    size: file.size,
    type: file.type,
    url: publicUrl,
    folder_id: folder_id!,
    user_id: userId!,
  };

  return fileData;
};
