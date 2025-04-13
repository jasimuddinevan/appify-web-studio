
const { google } = require('googleapis');
const fs = require('fs-extra');
const path = require('path');

// Google Drive API credentials
const credentials = {
  "type": "service_account",
  "project_id": "web-to-apk-builder",
  "private_key_id": "e4045ec74210813be48695f3f31db7d4abec9169",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDiLjluKZxmoHa0\nc0HaAPw0xmneoTtXivNoKaUQT+9/n7cY7CVJ4vCPzBSs6JkrTtcjYztMW6f7n54E\nUNplnaJau/tXv4puyw3MWQZqnWJbNDtgSAY7b+sxP+Ad6JZGaKsZoW7FSuzm6/kL\nADfZPLKFFexhENzucbENVvYPXxRlyxvM8Pct55vJWA7S8+/FkKBlY7j1wZbNHnh0\nVvK1qW0Gv6hE1zRL8L8b8bedXy+GmdbZwLi3yuMLICJuqjRp7GWd96ClT73SJ5UQ\nCXIKMnAJ0K2iOndaQcZbBDZZCG6dZMwersPmiV67KCy1LXPZHfe8k/yakA68vp/U\nt/fFg6nrAgMBAAECggEAXTk4KpO0Bwi0ZIPs7HHjgc0V7dD+qIJ4+MHRavvHdw7Z\nZMhQRjfndx1imDH2j8cbHVbVJg/RGQEdHCJHIgLq3AMHAY/M+wVuVn+LCX58/6Jz\npqeJCg6DHfV55lnrNnIFs7a59U+AfV1ddI9OdZdy7S+wEgHlTdJGa30gRg2mVp2u\nJBOCmAh39L2ZPwAc2uLyIRvpmsUm/m1b9yp8PFG9eEsh5q0Plwve7LGenPFeDBvq\n4NAtVhZWgf5Vr8QWKNKfHsdC288C8dUjxbIJYXUeMt5LYDqmB8XLRAJFntGN5JCs\nRtAIWBd+M6XTGOE1b6J+qxmAFbcXQVVUQBpV+67+oQKBgQDzce0SnZ+ICCSi25Gf\nDlBjoSWbAsXCTHhXAlKdfodap00cECR0R/reBHyWIRbRuI9X2s1wNMH0btoQIomb\nsX7mE6myhOaP6toaJk22KYDKBbIam9tNp/PNiyLH6/4BS3k+lsbr1IXksVh+mZFk\n855iyXJeglSBTuddo4Bo95vl5wKBgQDt2F1opKXJ28KpTCx8W9DtO5lWor3yHQ72\n6ArllZ8nnt0W3DC9BQbrb3ot5TcW5qAYSxSpKJZAYI8WXyQQ4jI1fZUR6+1N5Aqr\nS8l3OqqZxYbg+t24SZnzaW+Je5FWtMM/XgNfvuseCogBhSVEYNE3VkzEDJB/XFv2\nloYChYcTXQKBgFKJ8eM55fjtKd69qyXOaJse6+0eh4ZU/wghFXmoiKPHzXESWAnE\nzd2wj70nAuGgPZl/6d99Q7VoUC7gRt+u0mOXjxWj0bhB3Ci5i+eTMsNMIxK6fSRb\nKWIrJmO6M6ikujrqTA9xQuRC7MofrxgXMUA1JL2+WoBtDCzHXqY4LXdJAoGBALIR\nrU1tB5qrZ4AswZmRfEhAuLq+OQuNaei9LXtZm8CkFc7Jp8u8ecPGwGigFbCVlgLa\nI2vKMUOdh0Muk+f4EbMuhG7YfeA0/S/mG72iNJvP4P2LlHgm0pYEuDbsRpHt38gP\ncOM8Ivdo1w6cSpx5B+owOGUHKx/PXCKv60D0C38ZAoGADK8yy0RmGE3fXKr/C327\nYuFj+FPZsav6csUQSaxQU/QcRvsKIQbPgbnBM+ADNuDG73ThyTb4gR8kwu0eMvgv\nnTmQIugKxsZ6clCEQROFgP1UfnvM5s6LbbN14Q8phVcUeKt22Jw3amsgEczwtHJ9\nGPqhjndj2jBZ6AJ1JRHSJiw=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@web-to-apk-builder.iam.gserviceaccount.com",
  "client_id": "105425719271814555386",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40web-to-apk-builder.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

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
