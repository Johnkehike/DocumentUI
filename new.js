const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const apiKeyTenantId = process.env.API_KEY;
const apiKeyClientId = process.env.CLIENT_ID;
const apiKeyClientSecret = process.env.CLIENT_SECRET;
const databaseUrl = process.env.SITE_ID;
const databaseUrllib = process.env.DOCUMENT_LIBRARY_ID;

console.log("Tenant ID:", apiKeyTenantId); // Temporary
console.log("Client ID:", apiKeyClientId); // Temporary
console.log("Client Secret:", apiKeyClientSecret); // Temporary
console.log("Site ID:", databaseUrl); // Temporary
console.log("Document Library ID:", databaseUrllib); // Temporary

const app = express();
const PORT = process.env.PORT || 3600;

// 🔹 Replace these with your actual credentials
const TENANT_ID = apiKeyTenantId;
const CLIENT_ID = apiKeyClientId;
const CLIENT_SECRET = apiKeyClientSecret;
const SITE_ID  = databaseUrl;
const DOCUMENT_LIBRARY_ID = databaseUrllib; 


// ✅ Function to get an access token from Microsoft Entra ID (Azure AD)
async function getAccessToken() {
    const tokenEndpoint = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', CLIENT_ID);
    params.append('client_secret', CLIENT_SECRET);
    params.append('scope', 'https://graph.microsoft.com/.default');

    try {
        const response = await axios.post(tokenEndpoint, params);
        return response.data.access_token;
    } catch (error) {
        console.error('Error getting access token:', error.response ? error.response.data : error.message);
        return null;
    }
}

// ✅ Function to fetch **all** SharePoint files with pagination
async function getAllSharePointFiles(accessToken, endpoint) {
    let allFiles = [];

    try {
        while (endpoint) {
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            allFiles = allFiles.concat(response.data.value); // Add new batch of files

            endpoint = response.data["@odata.nextLink"] || null; // Get the next page link
        }

        return allFiles; // 🔹 Returning **all properties** of each file
    } catch (error) {
        console.error("Error fetching SharePoint files:", error.response ? error.response.data : error.message);
        return [];
    }
}

//per file
async function getAllSharePointFile(accessToken, endpoint) {
    try {
        const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return response.data; // Return the single file object
    } catch (error) {
        console.error("Error fetching SharePoint file:", error.response ? error.response.data : error.message);
        return null; // Or throw error
    }
}
// ✅ API Route: Fetch all SharePoint files
app.get('/api/sharepoint/files', async (req, res) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to get access token' });
    }

    const initialEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/root/children`;
    const files = await getAllSharePointFiles(accessToken, initialEndpoint);
    res.json(files);
});

app.get('/api/sharepoint/folders', async (req, res) => {
    // const { folder } = req.query; 
    const { itemId } = req.query; 
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to get access token' });
    }

    // let folderPath = "root"; 
    // if (folder) {
    //     folderPath = encodeURIComponent(folder);
    // }

    // const folderEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/root:/${folderPath}:/children`;
    const folderEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/items/${itemId}/children`;

    const files = await getAllSharePointFiles(accessToken, folderEndpoint);
    res.json(files);
});

app.get('/api/sharepoint/eachFolder', async (req, res) => {
    
    const { itemId, fileName } = req.query;
    console.log(itemId);
    console.log(fileName);
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to get access token' });
    }
    const folderEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/items/${itemId}:/${fileName}`;
    
    console.log(folderEndpoint);
    

    const files = await getAllSharePointFile(accessToken, folderEndpoint);
    console.log("Files from getAllSharePointFiles:", files)
    res.json(files);    
});


app.get('/api/sharepoint/rootFolder', async (req, res) => {
    
    const { fileName } = req.query;
    console.log(fileName);
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to get access token' });
    }
    // const folderEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/items/${itemId}:/${fileName}`;
    const folderEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/root:/${fileName}`;
    
    
    console.log(folderEndpoint);
    

    const files = await getAllSharePointFile(accessToken, folderEndpoint);
    console.log("Files from getAllSharePointFiles:", files)
    res.json(files);    
});

app.put('/api/sharepoint/uploadFile', async (req, res) => {
    

    try {
        const { parentId, filename, fileContent } = req.query;
        console.log(parentId, filename, fileContent, );
        
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to get access token' });
        }

        const uploadEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/items/${parentId}:/${filename}:/content`;

        // Decode base64 file content
        const decodedFileContent = Buffer.from(fileContent, 'base64');

        const response = await axios.put(uploadEndpoint, decodedFileContent, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/octet-stream' // Or the appropriate MIME type
            }
        });

        res.json(response.data); // Return the Graph API response
    } catch (error) {
        console.error("Error uploading file:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});
app.use(express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
