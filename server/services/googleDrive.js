
const { google } = require('googleapis');
const fs = require('fs-extra');
const path = require('path');


// Create a folder for APK files if it doesn't exist
const GOOGLE_DRIVE_APK_FOLDER_NAME = 'WebToAPK_Builds';

/**
 * Initialize the Google Drive API client
 */
function getDriveClient() {
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive']
  });

  return google.drive({ version: 'v3', auth });
}

/**
 * Get or create the APK folder in Google Drive
 */
async function getOrCreateApkFolder() {
  const drive = getDriveClient();
  
  // Check if folder already exists
  const folderResponse = await drive.files.list({
    q: `name='${GOOGLE_DRIVE_APK_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
    fields: 'files(id, name)'
  });
  
  if (folderResponse.data.files.length > 0) {
    return folderResponse.data.files[0].id;
  }
  
  // Create folder if it doesn't exist
  const folderMetadata = {
    name: GOOGLE_DRIVE_APK_FOLDER_NAME,
    mimeType: 'application/vnd.google-apps.folder'
  };
  
  const folder = await drive.files.create({
    resource: folderMetadata,
    fields: 'id'
  });
  
  return folder.data.id;
}

/**
 * Upload a file to Google Drive and make it publicly accessible
 * @param {string} filePath - Local path to the file
 * @param {string} fileName - Name for the file in Google Drive
 * @param {string} mimeType - MIME type of the file (defaults to APK)
 * @returns {Promise<{id: string, webViewLink: string, webContentLink: string}>}
 */
async function uploadFileToDrive(filePath, fileName, mimeType = 'application/vnd.android.package-archive') {
  try {
    const drive = getDriveClient();
    const folderId = await getOrCreateApkFolder();
    
    // File metadata
    const fileMetadata = {
      name: fileName,
      parents: [folderId]
    };
    
    // Media content
    const media = {
      mimeType: mimeType,
      body: fs.createReadStream(filePath)
    };
    
    // Upload file
    const file = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id,webViewLink'
    });
    
    // Make the file publicly accessible
    await drive.permissions.create({
      fileId: file.data.id,
      resource: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    // Get the file with links
    const fileInfo = await drive.files.get({
      fileId: file.data.id,
      fields: 'webViewLink, webContentLink'
    });
    
    return {
      id: file.data.id,
      webViewLink: fileInfo.data.webViewLink,
      webContentLink: fileInfo.data.webContentLink || 
        `https://drive.google.com/uc?export=download&id=${file.data.id}`
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

module.exports = {
  uploadFileToDrive
};
