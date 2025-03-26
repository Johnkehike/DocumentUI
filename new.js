const express = require('express');
const axios = require('axios');
const path = require('path');
const { error } = require('console');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3600;

const TENANT_ID = process.env.TENANT_ID;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const SITE_ID = process.env.SITE_ID;
const DOCUMENT_LIBRARY_ID = process.env.DOCUMENT_LIBRARY_ID;

if (!process.env.API_KEY) {
    console.error("API_KEY is not defined!");
};
if (!process.env.CLIENT_ID) {
    console.error("CLIENT_ID is not defined!");
};
if (!process.env.API_KEY) {
    console.error("CLIENT_SECRET is not defined!");
};
if (!process.env.API_KEY) {
    console.error("SITE_ID is not defined!");
};
if (!process.env.API_KEY) {
    console.error("DOCUMENT_LIBRARY_ID is not defined!");
};




async function getAccessToken() {
    console.log(TENANT_ID);

    
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


async function getAllSharePointFiles(accessToken, endpoint) {
    let allFiles = [];

    try {
        while (endpoint) {
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });

            allFiles = allFiles.concat(response.data.value); 

            endpoint = response.data["@odata.nextLink"] || null; 
        }

        return allFiles; 
    } catch (error) {
        console.error("Error fetching SharePoint files:", error.response ? error.response.data : error.message);
        return [];
    }
}


async function getAllSharePointFile(accessToken, endpoint) {
    try {
        const response = await axios.get(endpoint, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        return response.data; 
    } catch (error) {
        console.error("Error fetching SharePoint file:", error.response ? error.response.data : error.message);
        return null; 
    }
}

app.get('/api/sharepoint/files', async (req, res) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        return res.status(500).json({ error: 'Failed to get access token' });
    }

    console.log(TENANT_ID);
    
    
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

        
        const decodedFileContent = Buffer.from(fileContent, 'base64');

        const response = await axios.put(uploadEndpoint, decodedFileContent, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/octet-stream' 
            }
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error uploading file:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to upload file' });
    }
});

app.delete("/api/sharepoint/del", async(req, res) => {
    try {
        const { fileName } = req.query;
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to get access token' });
        }
        const deleteEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/root:/${fileName}`;
        const response = await axios.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status === 204) { 
            res.status(204).send(); 
        } else {
            res.status(response.status).json(response.data); 
        }
    } catch (error) {
        console.error("Error deleting file:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});
app.delete("/api/sharepoint/folder/del", async(req, res) => {

    try {
        const { itemId, fileName } = req.query;
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to get access token'});
        }
        const deleteEndpoint = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/items/${itemId}:/${fileName}`;
        const response = await axios.delete(deleteEndpoint, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (response.status === 204) {
            res.status(204).send();
        } else {
            res.status(response.status).json(response.data);
        }
    } catch (error) {
        console.error("Error deleting file:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to delete file' });
    }
});
app.get('api/sharepoint/download', async(req, res) => {
    try {
        const { fileName } = req.query;
        console.log(fileName);
        
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return res.status(500).json({ error: 'Failed to get access token'});
        }
        const getFolder = `https://graph.microsoft.com/v1.0/sites/${SITE_ID}/drives/${DOCUMENT_LIBRARY_ID}/root:/${fileName}?@microsoft.graph.downloadUrl`;
        const files = await getAllSharePointFile(accessToken, getFolder);
        res.json(files);
    } catch (error) {
        console.error("Error downloading file:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to download file' });
    }
});
// DELETE /drives/{drive-id}/items/{item-id}
// DELETE /groups/{group-id}/drive/items/{item-id}
// DELETE /me/drive/items/{item-id}
// DELETE /sites/{siteId}/drive/items/{itemId}
// DELETE /users/{userId}/drive/items/{itemId}


app.use(express.static(path.join(__dirname, 'src')));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
