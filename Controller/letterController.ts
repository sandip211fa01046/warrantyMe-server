import { Request, Response } from "express";
import Letter from "../Model/Letter";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
const drive = google.drive({ version: "v3", auth: oauth2Client });

let lettersFolderId: string | null = null;

const ensureLettersFolder = async (): Promise<string> => {
  if (lettersFolderId) return lettersFolderId;

  const res = await drive.files.list({
    q: "name='Letters' and mimeType='application/vnd.google-apps.folder'",
    fields: "files(id, name)",
  });

  if (res.data.files && res.data.files.length > 0) {
    lettersFolderId = res.data.files[0].id!;
  } else {
    const folder = await drive.files.create({
      requestBody: {
        name: "Letters",
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id",
    });

    lettersFolderId = folder.data.id || "";
  }

  return lettersFolderId;
};

export const createLetter = async (req: Request, res: Response) => {
  const { title, content, userId } = req.body;

  try {
    const newLetter = new Letter({ title, content, userId });
    await newLetter.save();
    res.status(201).json(newLetter);
  } catch (error) {
    res.status(500).json({ error: "Failed to create letter" });
  }
};

export const uploadToDrive = async (req: Request, res: Response) => {
  const { title, content } = req.body;

  try {
    const folderId = await ensureLettersFolder();
    const fileMetadata = {
      name: `${title}.docx`,
      parents: [folderId],
      mimeType: "application/vnd.google-apps.document",
    };
    const media = {
      mimeType: "text/html",
      body: `<html><body>${content}</body></html>`,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id",
    });

    res.json({ fileId: response.data.id });
  } catch (error) {
    console.error("Error uploading to Google Drive:", error);
    res.status(500).json({ error: "Failed to upload to Google Drive" });
  }
};
